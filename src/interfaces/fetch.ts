import { CustomFetchInitOptions } from "@atsu/lilith";

export interface Result<T> {
    statusCode: number;
    data: T;
}

export type CustomFetch = (
    url: string,
    options: Partial<CustomFetchInitOptions>,
) => Promise<CustomFetchResponse>;

export interface CustomFetchResponse {
    text: () => Promise<string>;
    json: <T>() => Promise<T>;
    status: number;
}

export type UrlParamPair = [string, UrlParamValue];
export type UrlParamValue = string | number | boolean;

export interface HenTagRequestProps {
    url: string;
    onEvaluation?: () => string;
    requestOptions?: CustomFetchInitOptions;
    params?: UrlParamPair[];
}

export type HenTagRequest = <T>(
    props: HenTagRequestProps,
) => Promise<Result<T>>;
