import {
    GetLatestBooks,
    BookListResults,
    LilithError,
    BookBase,
    LilithImage,
} from "@atsu/lilith";
import {
    NHentaiImageExtension,
    NHentaiPaginateResult,
    UseNHentaiMethodProps,
} from "../interfaces";
import { useNHentaiMethods } from "./base";

/**
 * Custom hook for fetching the latest NHentai books using the provided options and methods.
 *
 * @param {UseNHentaiMethodProps} props - The options and methods needed for NHentai latest book retrieval.
 * @returns {GetLatestBooks} - The function for fetching the latest books.
 */
export const useNHentaiGetLatestBooksMethod = (
    props: UseNHentaiMethodProps,
): GetLatestBooks => {
    const {
        domains: { apiUrl },
        request,
    } = props;
    const { LanguageMapper, getLanguageFromTags, getImageUri } =
        useNHentaiMethods();

    /**
     * Function for fetching the latest NHentai books for a specific page.
     *
     * @param {number} page - The page number for pagination.
     * @returns {Promise<BookListResults>} - The pagination result containing the latest books.
     */
    return async (page: number): Promise<BookListResults> => {
        // Making a request to the NHentai API for the latest books
        const response = await request<NHentaiPaginateResult>(
            `${apiUrl}/galleries/all?page=${page}`,
        );

        if (response.statusCode !== 200) {
            throw new LilithError(
                response.statusCode,
                "Could not find a correct pagination",
            );
        }

        const data = await response.json();
        const numPages = data.num_pages || 0;
        const perPageEntries = data.per_page || 0;
        const totalResults = numPages * perPageEntries;

        // Mapping the response data to book objects
        const books: BookBase[] = (data.result || []).map((result) => {
            const cover = result.images.cover;
            const coverImage: LilithImage = {
                uri: getImageUri({
                    type: "cover",
                    mediaId: result.media_id,
                    imageExtension: NHentaiImageExtension[cover.t],
                    domains: props.domains,
                }),
                width: cover.w,
                height: cover.h,
            };
            return {
                id: `${result.id}`,
                title: result.title.english,
                cover: coverImage,
                availableLanguages: [
                    LanguageMapper[getLanguageFromTags(result.tags)],
                ],
            };
        });

        // Constructing and returning the pagination result
        return {
            page,
            totalResults,
            totalPages: numPages,
            results: books,
        };
    };
};
