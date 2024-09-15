import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";

import { headers } from "../hentagMock";
import { useLilithHenTag } from "../../src/loader";
import { useLilithLog } from "../../src/utils/log";
import { HentagRepo } from "../../src/interfaces";

const debug = false;
const { log, warn } = useLilithLog(debug);

describe("DOMLoader", () => {
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

    test("Custom fetch for JSON", async () => {
        const res = await loader.getChapter("480154");

        if (res === null)
            warn("[Custom fetch for JSON] Resource was not found");

        log(res);
        expect(res).toBeDefined();
    });

    test("Custom fetch for text", async () => {
        const res = await loader.getRandomBook();

        if (res === null)
            warn("[Custom fetch for JSON] Resource was not found");

        log(res);
        expect(res).toBeDefined();
    });

    test("Custom fetch for text", async () => {
        const res = await loader.search("ass");

        if (res === null)
            warn("[Custom fetch for JSON] Resource was not found");

        log(res);
        expect(res).toBeDefined();
    });
});
