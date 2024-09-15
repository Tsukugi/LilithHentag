import {
    LilithLanguage,
    BookBase,
    LilithError,
    LilithImage,
    Sort,
} from "@atsu/lilith";

import { UseDomParserImpl } from "../interfaces/domParser";
import { GetImageUriProps, HenTagLanguage } from "../interfaces";
import { ArrayUtils } from "../utils/array";

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

/**
 * Extracts LilithLanguage array from the given title string.
 * @param {string} title - Title string.
 * @returns {LilithLanguage[]} - Array of LilithLanguage values.
 */
const extractLanguages = (title: string): LilithLanguage[] => {
    const matches = title.toLowerCase().match(/\[(.*?)\]/g);
    const possibleLanguages = matches
        ? matches.map((match) => match.slice(1, -1))
        : [];
    const languages: LilithLanguage[] = possibleLanguages
        .filter((lang) => Object.keys(LanguageMapper).includes(lang))
        .map((lang) => LanguageMapper[lang]);

    return languages;
};
/**
 * Function for extracting galleries (books) from a parsed DOM document.
 *
 * @param {UseDomParserImpl} document - The parsed DOM document.
 * @param {LilithLanguage[]} requiredLanguages - The languages required for filtering galleries.
 * @returns {BookBase[]} - An array of book objects representing the extracted galleries.
 */
const getGalleries = (
    document: UseDomParserImpl,
    requiredLanguages: LilithLanguage[],
    containerSelector: string = "div.container.index-container",
): BookBase[] => {
    // Checking for Cloudflare challenge
    const cloudflareDomCheck = document.find("div#content").getAttribute("id");
    if (!cloudflareDomCheck) {
        throw new LilithError(
            401,
            "Cloudflare challenge triggered, we should provide the correct Cloudflare clearance",
        );
    }

    // Extracting the container element from the document
    const container = document.find(containerSelector);
    if (!container) {
        throw new LilithError(
            404,
            "DOM Parser failed to find necessary elements needed for this process",
        );
    }

    // Extracting gallery elements from the container
    const galleries: UseDomParserImpl[] = container.findAll("div.gallery");

    // Handling case where no galleries are found
    if (!galleries || galleries.length === 0) {
        throw new LilithError(404, "No search results found");
    }

    // Function to extract languages from a gallery element
    const getLanguageFromAttribute = (
        el: UseDomParserImpl,
    ): LilithLanguage[] => {
        const languagesRetrieved = el
            .getAttribute("data-tags")
            .split(" ")
            .filter((code) => Object.keys(LanguageCodeMapper).includes(code))
            .map((code) => LanguageCodeMapper[code]);
        return languagesRetrieved;
    };

    // Filtering and mapping gallery elements to book objects
    return galleries
        .filter((searchElement) => {
            return (
                ArrayUtils.findCommonElements(
                    getLanguageFromAttribute(searchElement),
                    requiredLanguages,
                ).length > 0
            );
        })
        .map((searchElement) => {
            const anchorElement = searchElement.find("> a");
            const bookId = anchorElement
                .getAttribute("href")
                .split("/")
                .find((p) => p.length > 5); // A NH code should never be less than 6 digits

            const resultCover = anchorElement.find("img");

            const { getAttribute } = resultCover;
            const cover: LilithImage = {
                uri: getAttribute("data-src") || getAttribute("src") || "",
                width: +getAttribute("width") || 0,
                height: +getAttribute("height") || 0,
            };

            const titleElement = anchorElement.find(".caption");
            const title: string = titleElement?.getText() || "";

            let availableLanguages: LilithLanguage[] =
                getLanguageFromAttribute(searchElement);

            // If no languages are retrieved, try extracting from the title
            if (availableLanguages.length === 0) {
                availableLanguages = extractLanguages(title);
            }

            // Constructing and returning the book object
            return {
                id: bookId,
                cover: cover,
                title,
                availableLanguages,
            };
        });
};

/**
 * Get the image URI based on the provided parameters.
 * @param {GetImageUriProps} props - The properties needed to generate the image URI.
 * @returns {string} - The generated image URI.
 * @throws {LilithError} - Throws an error for invalid type or missing page number.
 */
const getImageUri = ({
    domains: { tinyImgBaseUrl, imgBaseUrl },
    mediaId,
    type,
    imageExtension,
    pageNumber,
}: GetImageUriProps): string => {
    if (type === "cover")
        return `${tinyImgBaseUrl}/${mediaId}/cover.${imageExtension}`;
    if (type === "thumbnail")
        return `${tinyImgBaseUrl}/${mediaId}/thumb.${imageExtension}`;
    if (type === "page" && pageNumber !== undefined)
        return `${imgBaseUrl}/${mediaId}/${pageNumber}.${imageExtension}`;
    throw new LilithError(500, "Invalid type or missing page number.");
};

/**
 * HenTagBase object containing various utilities related to HenTag integration.
 */
export const useHenTagMethods = () => {
    return {
        HenTagPageResultSize,
        LanguageMapper,
        LanguageCodeMapper,
        getImageUri,
        extractLanguages,
        getGalleries,
    };
};
