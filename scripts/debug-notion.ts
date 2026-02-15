import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

async function checkConnection() {
    console.log("Checking Notion connection...");
    try {
        const response = await notion.search({
            query: "Audio Interactivo 2026",
            // filter: { value: 'database', property: 'object' } // Let's not filter first, to see everything
        });

        console.log("Search successful.");
        if (response.results.length === 0) {
            console.log("No databases found. Please ensure you have shared the database with your integration.");
        } else {
            console.log("Found databases:");
            response.results.forEach((db: any) => {
                console.log(`- Name: ${db.title?.[0]?.plain_text || "Untitled"}`);
                console.log(`  ID: ${db.id}`);
                console.log(`  URL: ${db.url}`);
            });
        }
    } catch (error) {
        console.error("Connection failed:", error);
    }
}

checkConnection();
