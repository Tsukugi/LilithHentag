import { UrlParamValue, UrlParamPair, LilithError } from "@atsu/lilith";
import { HenTagRequestProps, Result } from "../interfaces/fetch";
import { useLilithLog } from "./log";
import { HenTagProps, UseRequest } from "../interfaces";

const useParamIfExists = (
    key: string,
    value: UrlParamValue | undefined,
): string => {
    return value !== undefined ? `${key}=${value}` : "";
};
const useUrlWithParams = (url: string, params?: UrlParamPair[]) => {
    if (!params || params.length === 0) return url;

    let useParams = "";
    params.forEach((param) => {
        const value = useParamIfExists(param[0], param[1]);
        if (!value) return;
        const separator = useParams ? "&" : "";
        useParams = `${useParams}${separator}${value}`;
    });

    return `${url}?${useParams}`;
};

export const useRequest = ({
    fetch,
    getPage,
    options: { debug },
}: HenTagProps): UseRequest => {
    const fetchRequest = async <T>({
        url,
        params,
    }: HenTagRequestProps): Promise<Result<T>> => {
        try {
            const apiUrl = useUrlWithParams(url, params);

            useLilithLog(debug).log(apiUrl);

            const response = await fetch(url, {
                method: "GET",
            });

            if (response.status !== 200) {
                throw new LilithError(response.status, "Unsuccessful request");
            }

            return {
                statusCode: response.status,
                data: await response.json(),
            };
        } catch (error) {
            console.trace(error);
            throw new LilithError(
                error.status || 500,
                "There was an error on the request",
                error,
            );
        }
    };

    const scrapRequest = async <T>({
        url,
        params,
        onEvaluation,
    }: HenTagRequestProps): Promise<Result<T>> => {
        try {
            const apiUrl = useUrlWithParams(url, params);

            useLilithLog(debug).log(apiUrl);

            const parsedDocument = await getPage({
                url,
                onEvaluation,
            });

            return {
                statusCode: 200,
                data: JSON.parse(parsedDocument),
            };
        } catch (error) {
            console.trace(error);
            throw new LilithError(
                error.status || 500,
                "There was an error on the request",
                error,
            );
        }
    };

    return { fetchRequest, scrapRequest };
};

export const RequestUtils = {
    useUrlWithParams,
    useParamIfExists,
};
