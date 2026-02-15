import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function checkSchema() {
    const ids = [
        "308324d5-abf1-8093-9100-ef98916231a7"  // View ID (User provided)
    ];

    for (const id of ids) {
        console.log(`\nChecking ID: ${id}`);
        try {
            const response = await notion.databases.retrieve({ database_id: id });
            console.log("Success! Title:", response.title?.[0]?.plain_text || "Untitled");
            console.log("Full DB Response:", JSON.stringify(response, null, 2));
            console.log("Keys:", Object.keys(response.properties));
            // console.log("Keys:", Object.keys(response.properties));
            // console.log("Full response:", JSON.stringify(response, null, 2));
        } catch (e: any) {
            console.log("Failed:", e.code || e.message);
        }
    }
}

checkSchema();
