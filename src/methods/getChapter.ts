import { GetChapter, Chapter, LilithError } from "@atsu/lilith";
import {
    NHentaiImageExtension,
    NHentaiResult,
    UseNHentaiMethodProps,
} from "../interfaces";
import { useLilithLog } from "../utils/log";
import { useNHentaiMethods } from "./base";

/**
 * Hook for interacting with NHentai chapters.
 * @param {UseNHentaiMethodProps} props - Properties required for the hook.
 * @returns {GetChapter} - A function that retrieves information about a chapter based on its identifier.
 */
export const useNHentaiGetChapterMethod = (
    props: UseNHentaiMethodProps,
): GetChapter => {
    const {
        domains: { apiUrl },
        options: { debug },
        request,
    } = props;
    const { LanguageMapper, getLanguageFromTags, getImageUri } =
        useNHentaiMethods();

    /**
     * Retrieves information about a chapter based on its identifier.
     * @param {string} chapterId - The unique identifier of the chapter.
     * @returns {Promise<Chapter>} - A Promise that resolves to the retrieved chapter.
     * @throws {LilithError} - Throws an error if the chapter is not found.
     */
    return async (chapterId: string): Promise<Chapter> => {
        /**
         * NHentai doesn't use chapters; it directly gets the pages from the book as 1 chapter books.
         */
        const response = await request<NHentaiResult>(
            `${apiUrl}/gallery/${chapterId}`,
        );

        if (!response || response?.statusCode !== 200) {
            throw new LilithError(response?.statusCode, "No chapter found");
        }

        const book = await response.json();

        useLilithLog(debug).log({
            language: LanguageMapper[getLanguageFromTags(book.tags)],
        });

        return {
            id: chapterId,
            pages: book.images.pages.map((page, index) => ({
                uri: getImageUri({
                    type: "page",
                    mediaId: book.media_id,
                    imageExtension:
                        NHentaiImageExtension[book.images.thumbnail.t],
                    pageNumber: index + 1,
                    domains: props.domains,
                }),
                width: page.w,
                height: page.h,
            })),
            language: LanguageMapper[getLanguageFromTags(book.tags)],
            title:
                book.title[getLanguageFromTags(book.tags)] || book.title.pretty,
            chapterNumber: 1,
        };
    };
};
