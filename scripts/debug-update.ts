import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function debugUpdate() {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
        console.error("No database ID");
        return;
    }

    console.log(`Attempting to update DB: ${databaseId}`);
    try {
        const response = await notion.databases.update({
            database_id: databaseId,
            properties: {
                "TestProperty": { checkbox: {} }
            }
        });
        console.log("Update success!", response);

    } catch (error: any) {
        console.error("Update failed.");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        if (error.body) {
            console.error("Error Body:", error.body);
        }
    }
}

debugUpdate();
