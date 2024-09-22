import {
    SearchResult,
    Search,
    SearchQueryOptions,
    BookBase,
} from "@atsu/lilith";

import { HenTagPaginateResult, UseHenTagMethodProps } from "../interfaces";
import { MaxLatestBooksSize, useHenTagMethods } from "./base";

/**
 * Custom hook for searching HenTag using the provided options and methods.
 *
 * @param {UseHenTagMethodProps} options - The options and methods needed for HenTag search.
 * @returns {Search} - The search function.
 */
export const useHenTagSearchMethod = ({
    domains: { apiUrl },
    request,
}: UseHenTagMethodProps): Search => {
    return async (
        query: string,
        options?: Partial<SearchQueryOptions>,
    ): Promise<SearchResult> => {
        const { getHenTagResultsToBookBase } = useHenTagMethods();
        const response = await request.fetchRequest<HenTagPaginateResult>({
            url: `${apiUrl}/vault-search`,
            params: [
                ["s", MaxLatestBooksSize],
                ["p", options?.page || 1],
            ],
        });

        const { page, total, pageSize, works } = response.data;

        const results: BookBase[] = getHenTagResultsToBookBase(works);

        return {
            query,
            results,
            page,
            totalResults: total,
            totalPages: Math.floor(total / pageSize),
        };
    };
};
