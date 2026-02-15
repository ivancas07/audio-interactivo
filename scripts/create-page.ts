import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

// This ID was found by search, let's see if we can create a page inside it.
const parentId = "308324d5-abf1-805d-b3b5-ed2149f0b82c";

async function createParentPage() {
    console.log(`Creating page inside ${parentId}...`);
    try {
        const response = await notion.pages.create({
            parent: {
                database_id: parentId, // Assuming it's a database based on previous behavior
            },
            properties: {
                // If the parent is a database, we need to match its properties.
                // We don't know the properties.
                // But usually "Name" or "title" is safe.
                "Name": {
                    title: [{ text: { content: "Container Page for CMS" } }]
                }
            }
        });
        console.log("Page created successfully!");
        console.log("New Page ID:", response.id);
        return response.id;
    } catch (error: any) {
        console.error("Failed to create page in DB:", error.body || error);

        // If it failed because it's NOT a database (i.e. it's a page), try creating as child of page
        if (error.code === 'validation_error' || error.message.includes('parent')) {
            console.log("Retrying as child of PAGE...");
            try {
                const response = await notion.pages.create({
                    parent: {
                        page_id: parentId,
                    },
                    properties: {
                        title: [{ text: { content: "Container Page for CMS" } }] // Properties for page inside page are just title?
                        // actually for pages.create inside a page, properties is { title: ... }
                    }
                });
                console.log("Page created successfully (as child of page)!");
                console.log("New Page ID:", response.id);
                return response.id;
            } catch (e: any) {
                console.error("Failed to create page in PAGE:", e.body || e);
            }
        }
    }
}

createParentPage();
