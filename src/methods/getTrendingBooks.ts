import { GetTrendingBooks, BookBase } from "@atsu/lilith";
import { UseHenTagMethodProps } from "../interfaces";
import { useLilithLog } from "../utils/log";

/**
 * Custom hook for fetching the latest HenTag books using the provided options and methods.
 *
 * @param {UseHenTagMethodProps} props - The options and methods needed for HenTag latest book retrieval.
 * @returns {GetTrendingBooks} - The function for fetching the latest books.
 */
export const useHenTagGetTrendingBooksMethod = (
    props: UseHenTagMethodProps,
): GetTrendingBooks => {
    const { domains } = props;

    //! Hentag doesnt have trending
    return async (): Promise<BookBase[]> => {
        useLilithLog(false).log(domains);
        return [];
    };
};
