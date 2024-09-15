import { RepositoryBase } from "@atsu/lilith";

import { useRequest } from "./utils/request";

import { useHenTagGetBookmethod } from "./methods/getBook";
import { useHenTagGetChapterMethod } from "./methods/getChapter";
import { useHenTagSearchMethod } from "./methods/search";
import { useHenTagGetRandomBookMethod } from "./methods/getRandomBook";
import { useHenTagGetLatestBooksMethod } from "./methods/latest";
import { HenTagProps, UseHenTagMethodProps } from "./interfaces";
import { useHenTagGetTrendingBooksMethod } from "./methods/getTrendingBooks";

type HenTagRepositoryProps = (props: HenTagProps) => RepositoryBase;

export const useHenTagRepository: HenTagRepositoryProps = (props) => {
    const { headers, getPage } = props;

    const baseUrl = "https://hentag.com";
    const apiUrl = "https://hentag.com/api/v1";
    const imgBaseUrl = "https://cdn.hentag.com";
    const tinyImgBaseUrl = "https://cdn.hentag.com";

    const domains = { baseUrl, imgBaseUrl, apiUrl, tinyImgBaseUrl };
    const methodProps: UseHenTagMethodProps = {
        ...props,
        domains,
        headers,
        request: useRequest({
            ...props,
            getPage,
        }),
    };

    return {
        domains,
        getChapter: useHenTagGetChapterMethod(methodProps),
        getBook: useHenTagGetBookmethod(methodProps),
        search: useHenTagSearchMethod(methodProps),
        getRandomBook: useHenTagGetRandomBookMethod(methodProps),
        getLatestBooks: useHenTagGetLatestBooksMethod(methodProps),
        getTrendingBooks: useHenTagGetTrendingBooksMethod(methodProps),
    };
};
