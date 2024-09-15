/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetRandomBook, Book } from "@atsu/lilith";
import { UseHenTagMethodProps } from "../interfaces";
import { useLilithLog } from "../utils/log";

/**
 * Hook for retrieving a random book from HenTag.
 * @param {UseHenTagMethodProps} props - Properties required for the hook.
 * @returns {GetRandomBook} - A function that retrieves a random book.
 */
export const useHenTagGetRandomBookMethod = (
    props: UseHenTagMethodProps,
): GetRandomBook => {
    //! Hentag doesnt have trending
    return async (): Promise<Book> => {
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
