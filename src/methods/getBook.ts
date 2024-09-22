import { Book, GetBook, LilithLanguage } from "@atsu/lilith";
import { HenTagResult, UseHenTagMethodProps } from "../interfaces";
import { useHenTagMethods } from "./base";
/**
 * Hook for interacting with HenTag books.
 * @param {UseHenTagMethodProps} props - Properties required for the hook.
 * @returns {GetBook} - A function that retrieves information about a book based on its identifier.
 */
export const useHenTagGetBookmethod = (
    props: UseHenTagMethodProps,
): GetBook => {
    const {
        request,
        domains: { apiUrl },
    } = props;

    const { getHenTagResultToBookBase, LanguageCodeMapper } =
        useHenTagMethods();

    return async (identifier): Promise<Book> => {
        const response = await request.fetchRequest<HenTagResult>({
            url: `${apiUrl}/vault/${identifier}`,
            params: [],
        });

        const bookBase = getHenTagResultToBookBase(response.data);
        const {
            locations,
            language,
            title,
            artists,
            maleTags,
            femaleTags,
            otherTags,
        } = response.data;

        return {
            ...bookBase,
            author: artists.length > 0 ? artists.join(", ") : "unknown",
            // TODO maybe lilith should provide a unified Tag system
            tags: [...maleTags, ...otherTags, ...femaleTags], // * Coincidentally we don't need a transform for HenTag tag to Lilith
            chapters: locations.map((location) => ({
                id: location,
                chapterNumber: 1, // We assume that all resources are single chapter entries
                title,
                language:
                    LanguageCodeMapper[`${language}`] ||
                    LilithLanguage.japanese,
            })),
        };
    };
};
