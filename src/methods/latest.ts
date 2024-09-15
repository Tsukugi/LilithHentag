import {
    GetLatestBooks,
    BookListResults,
    BookBase,
    LilithLanguage,
} from "@atsu/lilith";
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

    return async (pageNumber: number): Promise<BookListResults> => {
        const response = await request.fetchRequest<HenTagPaginateResult>({
            url: `${apiUrl}public/api/vault-search`,
            params: [
                ["s", MaxLatestBooksSize],
                ["p", pageNumber],
            ],
        });

        const { page, total, pageSize, works } = response.data;

        const results: BookBase[] = works.map((work) => ({
            id: work.id,
            cover: { uri: work.coverImageUrl },
            title: work.title,
            availableLanguages: [
                useHenTagMethods().LanguageCodeMapper[`${work.language}`] ||
                    LilithLanguage.japanese,
            ],
        }));

        return {
            results,
            page,
            totalResults: total,
            totalPages: Math.floor(total / pageSize),
        };
    };
};
