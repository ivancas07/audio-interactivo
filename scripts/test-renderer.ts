
import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testRenderer() {
    console.log("Testing public access for content renderer...");

    // 1. Get a valid Page ID from the database using the Official API
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const dbId = process.env.NOTION_DATABASE_ID;

    if (!dbId) throw new Error("No Database ID env var");

    console.log("Fetching a sample page from DB:", dbId);
    const dbResponse = await notion.databases.query({
        database_id: dbId,
        page_size: 1
    });

    if (dbResponse.results.length === 0) {
        console.error("No pages found in database to test!");
        return;
    }

    const pageId = dbResponse.results[0].id;
    console.log("Found sample Page ID:", pageId);

    // 2. Try to fetch it using the Unofficial Client (simulating the frontend renderer)
    const notionAPI = new NotionAPI(); // No auth = Anonymous/Public access

    try {
        console.log("Attempting to fetch page content via NotionAPI (Anonymous)...");
        const recordMap = await notionAPI.getPage(pageId);

        if (recordMap && recordMap.block) {
            console.log("✅ Success! Page is publicly accessible.");
            console.log("Block count:", Object.keys(recordMap.block).length);
        } else {
            console.error("❌ Failed: returned empty recordMap.");
        }
    } catch (error: any) {
        console.error("❌ Error fetching page content:", error.message);
        console.log("\nPossible causes:");
        console.log("- The page is not actually public.");
        console.log("- 'Allow duplicate as template' might be needed/not needed depending on Notion version (usually not).");
        console.log("- Propagation delay.");
    }
}

testRenderer();
