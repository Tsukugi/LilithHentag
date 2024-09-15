import {
    LilithError,
    SearchResult,
    Search,
    SearchQueryOptions,
} from "@atsu/lilith";

import { UseHenTagMethodProps } from "../interfaces";

/**
 * Custom hook for searching HenTag using the provided options and methods.
 *
 * @param {UseHenTagMethodProps} options - The options and methods needed for HenTag search.
 * @returns {Search} - The search function.
 */
export const useHenTagSearchMethod = ({
    domains: { baseUrl },
    request,
}: UseHenTagMethodProps): Search => {
    return async (
        query: string,
        options?: Partial<SearchQueryOptions>,
    ): Promise<SearchResult> => {
        const page = options?.page || 1;
        const response = await request.fetchRequest<SearchResult>({
            url: baseUrl,
            params: [
                ["t", query],
                ["p", page],
            ],
            onEvaluation: () => {
                const res: SearchResult = {
                    query: query,
                    page: 1,
                    totalPages: 1,
                    totalResults: 1,
                    results: [
                        {
                            id: "test",
                            cover: { uri: "10", width: 10, height: 10 },
                            title: "string",
                            availableLanguages: [],
                        },
                    ],
                };
                return JSON.stringify(res);
            },
        });

        if (response.statusCode !== 200) {
            throw new LilithError(
                response.statusCode,
                "Could not find a correct pagination",
            );
        }

        return response.data;
    };
};
