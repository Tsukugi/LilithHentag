import { Book, GetBook } from "@atsu/lilith";
import { UseHenTagMethodProps } from "../interfaces";
import { useLilithLog } from "../utils/log";

/**
 * Hook for interacting with HenTag books.
 * @param {UseHenTagMethodProps} props - Properties required for the hook.
 * @returns {GetBook} - A function that retrieves information about a book based on its identifier.
 */
export const useHenTagGetBookmethod = (
    props: UseHenTagMethodProps,
): GetBook => {
    const { domains } = props;

    //! Hentag doesnt have trening
    return async (): Promise<Book> => {
        useLilithLog(false).log(domains);
        return {
            id: "test",
            cover: {
                uri: "test",
            },
            title: "test",
            availableLanguages: [],
            author: "test",
            tags: [],
            chapters: [],
        };
    };
};
