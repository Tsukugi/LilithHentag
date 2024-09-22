import {
    LilithLanguage,
    BookBase,
    Sort,
    Chapter,
    LilithImage,
} from "@atsu/lilith";

import { HenTagLanguage, HenTagResult, UseRequest } from "../interfaces";
import { UseDomParserImpl } from "../interfaces/domParser";

/*
 *  This is the size that will define a Page in Search
 */
export const MaxSearchSize = 25;
export const MaxLatestBooksSize = 25;

export const DefaultSearchOptions = {
    sort: Sort.Latest,
    page: 1,
    size: MaxSearchSize,
};

/**
 * The size of results per page in an HenTag search.
 */
const HenTagPageResultSize = 25;

/**
 * Mapper that converts HenTag language codes to LilithLanguage enum values.
 */
const LanguageCodeMapper: Record<string, LilithLanguage> = {
    "1": LilithLanguage.english,
    "2": LilithLanguage.japanese,
    "3": LilithLanguage.spanish,
    "11": LilithLanguage.mandarin,
};

/**
 * Mapper that converts HenTagLanguage enum values to LilithLanguage enum values.
 */
const LanguageMapper: Record<HenTagLanguage, LilithLanguage> = {
    [HenTagLanguage.english]: LilithLanguage.english,
    [HenTagLanguage.japanese]: LilithLanguage.japanese,
    [HenTagLanguage.chinese]: LilithLanguage.mandarin,
};

const getHenTagResultToBookBase = (work: HenTagResult): BookBase => ({
    id: work.id,
    cover: { uri: work.coverImageUrl },
    title: work.title,
    availableLanguages: [
        LanguageCodeMapper[`${work.language}`] || LilithLanguage.japanese,
    ],
});

const getHenTagResultsToBookBase = (works: HenTagResult[]): BookBase[] => {
    return works.map(getHenTagResultToBookBase);
};

const scrapEHentaiChapter = async (
    url: string,
    { scrapRequest }: UseRequest,
): Promise<Chapter> => {
    const { data } = await scrapRequest({ url });

    const scrapImages = (data: UseDomParserImpl) => {
        return data.findAll(".gdtm a").map((a) => ({
            uri: a.getAttribute("href"),
        }));
    };

    const scrapPage = async (url: string): Promise<LilithImage[]> => {
        const { data } = await scrapRequest({
            url,
        });

        return scrapImages(data);
    };

    const exlanguage = data
        .findAll("#gdd td.gdt2")[3] // The fourth element is the language
        .getText()
        .trim()
        .toLowerCase();
    const title = data.find(".gn").getText();
    const pageUrls: string[] = Array.from(
        new Set(
            data
                .findAll("td a[onclick='return false']")
                .map((a) => a.getAttribute("href")),
        ),
    );

    let images = scrapImages(data);

    if (pageUrls.length > 1) {
        const processes = pageUrls
            .filter((url) => url.includes("?p=")) // We want pages excluding the first page (without ?p=)
            .map((url) => scrapPage(url));

        const extraPages = (await Promise.all(processes)).flat();
        images = [...images, ...extraPages];
    }

    return {
        id: url,
        title,
        language: LanguageMapper[exlanguage],
        chapterNumber: 1,
        pages: images,
    };
};

/**
 * HenTagBase object containing various utilities related to HenTag integration.
 */
export const useHenTagMethods = () => {
    return {
        scrapEHentaiChapter,
        getHenTagResultsToBookBase,
        getHenTagResultToBookBase,
        HenTagPageResultSize,
        LanguageMapper,
        LanguageCodeMapper,
    };
};
