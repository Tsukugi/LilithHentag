import { Chapter, GetChapter } from "@atsu/lilith";
import { UseHenTagMethodProps } from "../interfaces";
import { useLilithLog } from "../utils/log";

/**
 * Hook for interacting with HenTag chapters.
 * @param {UseHenTagMethodProps} props - Properties required for the hook.
 * @returns {GetChapter} - A function that retrieves information about a chapter based on its identifier.
 */
export const useHenTagGetChapterMethod = (
    props: UseHenTagMethodProps,
): GetChapter => {
    const { domains } = props;

    //! Hentag doesnt have trening
    return async (): Promise<Chapter> => {
        useLilithLog(false).log(domains);
        return {} as Chapter;
    };
};
