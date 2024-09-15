import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";

import { Book, SearchResult, BookListResults, BookBase } from "@atsu/lilith";

import { headers } from "../hentagMock";
import { useLilithHenTag } from "../../src/index";
import { useLilithLog } from "../../src/utils/log";
import { HentagRepo } from "../../src/interfaces";

const debug = false;
const { log } = useLilithLog(debug);

describe("Lilith", () => {
    describe("Test HenTag ", () => {
        let loader = {} as HentagRepo;
        beforeAll(async () => {
            loader = await useLilithHenTag({
                headers,
                options: { debug },
            });
        });

        afterAll(() => {
            loader.clear();
        });

        test("getBook", async () => {
            const book: Book = await loader.getBook("482151");
            log(book);
            expect(book).toBeDefined();
        });
        test("Search", async () => {
            const search: SearchResult = await loader.search("ass");
            log(search.results.map((result) => result.cover.uri));
            expect(search.results[0].cover.uri).toBeTruthy();
            expect(search).toBeDefined();
        });
        test("Search offset", async () => {
            const search2: SearchResult = await loader.search("English", {
                page: 2,
            });
            expect(search2).toBeDefined();
            const search4: SearchResult = await loader.search("English", {
                page: 4,
            });
            expect(search4).toBeDefined();
        });
        test("GetLatestBooks", async () => {
            if (!loader.getLatestBooks) return;
            const page: BookListResults = await loader.getLatestBooks(1);
            log(page.results.map((result) => result.availableLanguages));
            log(page.results.map((result) => result.cover.uri));
            expect(page).toBeDefined();
        });
        test("GetTrendingBooks", async () => {
            if (!loader.getTrendingBooks) return;
            const page: BookBase[] = await loader.getTrendingBooks();
            log(page.map((result) => result.title));
            expect(page).toBeDefined();
            //  expect(page.length).toBeGreaterThan(0); Trending doesnt exist in HenTag
        });
        test("RandomBook", async () => {
            const book: Book = await loader.getRandomBook();
            log(book);
            expect(book).toBeDefined();
        });
    });
});
