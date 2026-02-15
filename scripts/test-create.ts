import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function testCreate(id: string, name: string) {
    console.log(`Testing creation on ${name} (${id})...`);
    try {
        const response = await notion.pages.create({
            parent: { database_id: id },
            properties: {
                // Only using Name/title as we don't know if other props exist yet
                // If this works, write access is confirmed.
                "Name": { title: [{ text: { content: "Test Item" } }] }
            }
        });
        console.log("Success!");
        return true;
    } catch (error: any) {
        console.log("Failed:", error.code || error.message);
        if (error.code === 'validation_error') {
            console.log("Validation error details:", error.message);
            // If it says "Name is not a property", then we have access but schema is mismatched (or empty)
        }
        return false;
    }
}

async function run() {
    const sourceId = "308324d5-abf1-8059-bf82-000b5a21c186";
    const viewId = "308324d5-abf1-8093-9100-ef98916231a7";

    await testCreate(sourceId, "Source DB");
    await testCreate(viewId, "View DB");
}

run();
