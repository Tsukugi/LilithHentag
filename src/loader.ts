import { LilithLanguage, RepositoryBaseProps } from "@atsu/lilith";
import { useHenTagRepository } from "./hentag";
import { useCheerioDomParser } from "./impl/useCheerioDomParser";
import { useNodeFetch } from "./impl/useNodeFetch";
import { HenTagProps, HentagRepo } from "./interfaces";

export const useLilithHenTag = (
    config: Partial<RepositoryBaseProps>,
): HentagRepo => {
    const innerConfigurations: HenTagProps = {
        fetch: useNodeFetch,
        domParser: useCheerioDomParser,
        getPage: async () => JSON.stringify({ a: 2 }),
        ...config,
        options: {
            debug: false,
            requiredLanguages: Object.values(LilithLanguage),
            ...config.options,
        },
    };
    return {
        ...useHenTagRepository(innerConfigurations),
        clear: () => {},
    };
};
