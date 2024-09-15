import {
    LilithHeaders,
    CustomFetch,
    RepositoryBaseOptions,
    LilithLanguage,
} from "@atsu/lilith";
import { useHenTagRepository } from "./hentag";
import { UseDomParser } from "./interfaces/domParser";
import { useCheerioDomParser } from "./impl/useCheerioDomParser";
import { useNodeFetch } from "./impl/useNodeFetch";
import { HenTagProps, HentagRepo } from "./interfaces";

export interface APILoaderConfigurations {
    headers?: Partial<LilithHeaders>;
    fetch: CustomFetch;
    domParser: UseDomParser;
    options: Partial<RepositoryBaseOptions>;
}

export const useLilithHenTag = async (
    config: Partial<APILoaderConfigurations>,
): Promise<HentagRepo> => {
    const innerConfigurations: HenTagProps = {
        fetch: useNodeFetch,
        domParser: useCheerioDomParser,
        getPage: async () => JSON.stringify({ a: 2 }),
        ...config,
        options: {
            debug: false,
            requiredLanguages: [
                LilithLanguage.english,
                LilithLanguage.japanese,
                LilithLanguage.mandarin,
                LilithLanguage.spanish,
            ],
            ...config.options,
        },
    };
    return {
        ...useHenTagRepository(innerConfigurations),
        clear: () => {},
    };
};
