import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const parentPageId = "308324d5-abf1-80b3-a53c-d8714e933f67";

async function createDatabase() {
    console.log(`Creating database on page ${parentPageId}...`);
    try {
        const response = await notion.databases.create({
            parent: {
                type: "page_id",
                page_id: parentPageId,
            },
            title: [
                {
                    type: "text",
                    text: {
                        content: "Audio Interactivo 2026 DB",
                    },
                },
            ],
            properties: {
                "Name": { title: {} },
                "Semana": { number: {} },
                "Fecha": { date: {} },
                "Slug": { rich_text: {} },
                "Resumen": { rich_text: {} },
                "Publicado": { checkbox: {} },
                "Clave": { rich_text: {} },
                "Tipo": { select: {} },
                "Tema": { rich_text: {} },
                "Año": { number: {} }
            },
        });
        console.log("Database created successfully!");
        console.log("New Database ID:", response.id);
        console.log("URL:", response.url);
    } catch (error: any) {
        console.error("Failed to create database:", error.body || error);
    }
}

createDatabase();
