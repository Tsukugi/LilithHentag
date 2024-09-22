import { Chapter, GetChapter, LilithError } from "@atsu/lilith";
import { UseHenTagMethodProps } from "../interfaces";
import { useHenTagMethods } from "./base";

/**
 * Hook for interacting with HenTag chapters.
 * @param {UseHenTagMethodProps} props - Properties required for the hook.
 * @returns {GetChapter} - A function that retrieves information about a chapter based on its identifier.
 */

const SupportedSources = {
    // NHentai: "nhentai", // TODO fix when i have a element that has it on the site
    ExHentai: "exhentai",
    EHentai: "e-hentai",
};

export const useHenTagGetChapterMethod = (
    props: UseHenTagMethodProps,
): GetChapter => {
    const { request } = props;

    const { scrapEHentaiChapter } = useHenTagMethods();

    // const nhLoader = useLilithNHentai({
    //     options,
    // });

    const getSourceFromIdentifier = (id: string) =>
        Object.values(SupportedSources).find((source) => id.includes(source));

    return async (identifier): Promise<Chapter> => {
        const source = getSourceFromIdentifier(identifier);

        const getChapter = async (): Promise<Chapter> => {
            switch (source) {
                case SupportedSources.EHentai:
                    return await scrapEHentaiChapter(identifier, request);
                case SupportedSources.ExHentai:
                    return await scrapEHentaiChapter(identifier, request);
                default:
                    throw new LilithError(
                        404,
                        `Source not supported (${source})`,
                    );
            }
        };

        return await getChapter();
    };
};
