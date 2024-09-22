import { GetLatestBooks, BookListResults, BookBase } from "@atsu/lilith";
import { HenTagPaginateResult, UseHenTagMethodProps } from "../interfaces";
import { MaxLatestBooksSize, useHenTagMethods } from "./base";

/**
 * Custom hook for fetching the latest HenTag books using the provided options and methods.
 *
 * @param {UseHenTagMethodProps} props - The options and methods needed for HenTag latest book retrieval.
 * @returns {GetLatestBooks} - The function for fetching the latest books.
 */
export const useHenTagGetLatestBooksMethod = (
    props: UseHenTagMethodProps,
): GetLatestBooks => {
    const {
        domains: { apiUrl },
        request,
    } = props;

    const { getHenTagResultsToBookBase } = useHenTagMethods();

    return async (pageNumber: number): Promise<BookListResults> => {
        const response = await request.fetchRequest<HenTagPaginateResult>({
            url: `${apiUrl}/vault-search`,
            params: [
                ["s", MaxLatestBooksSize],
                ["p", pageNumber],
            ],
        });

        const { page, total, pageSize, works } = response.data;

        const results: BookBase[] = getHenTagResultsToBookBase(works);

        return {
            results,
            page,
            totalResults: total,
            totalPages: Math.floor(total / pageSize),
        };
    };
};
