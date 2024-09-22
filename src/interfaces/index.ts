import {
    RepositoryBaseProps,
    Domains,
    ImageUriType,
    RepositoryBase,
} from "@atsu/lilith";
import { HenTagRequestProps, Result } from "./fetch";
import { UseAmagiPageProps } from "@atsu/amagi";
import { UseDomParserImpl } from "./domParser";

export enum HenTagImageExtension {
    j = "jpg",
    p = "png",
    g = "gif",
}

export interface HenTagRef {
    id: string;
    name: string;
}
export interface HenTagTag extends HenTagRef {}

export interface HenTagResult {
    id: string;
    title: string;
    parodies: HenTagRef[];
    circles: HenTagRef[];
    artists: HenTagRef[];
    characters: HenTagRef[];
    maleTags: HenTagTag[];
    femaleTags: HenTagTag[];
    otherTags: HenTagTag[];
    language: number;
    category: number;
    locations: string[];
    createdAt: number;
    lastModified: number;
    coverImageUrl: string;
    favorite: boolean;
    isControversial: boolean;
    isDead: boolean;
    isPendingApproval: boolean;
}

export interface HenTagPaginateResult {
    page: number;
    pageSize: number;
    works: HenTagResult[];
    total: number;
    requestedAt: number; // Timestamp
}

export enum HenTagLanguage {
    english = "english",
    japanese = "japanese",
    chinese = "chinese",
}

export interface UseHenTagMethodProps extends RepositoryBaseProps {
    domains: Domains;
    request: UseRequest;
}

export interface UseRequest {
    fetchRequest: <T>(props: HenTagRequestProps) => Promise<Result<T>>;
    scrapRequest: (
        props: HenTagRequestProps,
    ) => Promise<Result<UseDomParserImpl>>;
    amagiRequest: <T>(props: HenTagRequestProps) => Promise<Result<T>>;
}

export interface HenTagProps extends RepositoryBaseProps {
    getPage: ({ url, onEvaluation }: UseAmagiPageProps) => Promise<string>;
}

export interface HentagRepo extends RepositoryBase {
    clear: () => void;
}

export interface GetImageUriProps {
    domains: Domains;
    mediaId: string;
    type: ImageUriType;
    imageExtension: HenTagImageExtension;
    pageNumber?: number;
}

export enum HenTagSort {
    RECENT = "recent",
    POPULAR_TODAY = "popular-today",
    POPULAR_WEEK = "popular-week",
    POPULAR = "popular",
}
