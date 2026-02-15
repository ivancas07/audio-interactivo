import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";
import { ExtendedRecordMap } from "notion-types";

// Initialize Notion Clients lazily
let notionClient: Client | null = null;
let notionAPIClient: NotionAPI | null = null;

export const getNotionClient = () => {
    if (!notionClient) {
        const token = process.env.NOTION_TOKEN;
        if (!token) {
            console.warn("getNotionClient: NOTION_TOKEN is missing");
        } else {
            console.log("getNotionClient: Initializing with token starting with", token.substring(0, 4));
        }
        notionClient = new Client({
            auth: token,
        });
        console.log("getNotionClient: Keys:", Object.keys(notionClient));
    }
    return notionClient;
};

export const getNotionAPI = () => {
    if (!notionAPIClient) {
        notionAPIClient = new NotionAPI({
            authToken: process.env.NOTION_TOKEN_V2
        });
    }
    return notionAPIClient;
}


export interface Week {
    id: string;
    title: string;
    slug: string;
    weekNumber: number;
    date: string;
    summary: string;
    type: string;
    hasKey?: boolean; // Optional: if we implement the "Clave" feature
}

// Helper for direct API calls to bypass SDK issues in build
async function queryDatabase(databaseId: string, filter: any, sorts: any[]) {
    const token = process.env.NOTION_TOKEN;
    if (!token) throw new Error("Missing NOTION_TOKEN");

    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            filter,
            sorts,
        }),
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        throw new Error(`Notion API error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
}

export const getPublishedWeeks = async (): Promise<Week[]> => {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const token = process.env.NOTION_TOKEN;

    if (!databaseId || !token) {
        console.warn("getPublishedWeeks: Missing NOTION_DATABASE_ID or NOTION_TOKEN. Using mock data.");
        return [
            {
                id: "mock-1",
                title: "Semana 1: Introducción",
                slug: "semana-1",
                weekNumber: 1,
                date: "2026-02-14",
                summary: "Introducción al curso y conceptos básicos de audio interactivo. Mock data.",
                type: "Clase",
                hasKey: true
            },
            {
                id: "mock-2",
                title: "Semana 2: Síntesis Web",
                slug: "semana-2",
                weekNumber: 2,
                date: "2026-02-21",
                summary: "Fundamentos de síntesis de audio en la web usando Web Audio API.",
                type: "Clase",
                hasKey: false
            }
        ];
    }

    try {
        const response = await queryDatabase(
            databaseId,
            {
                property: "Publicado",
                checkbox: {
                    equals: true,
                },
            },
            [
                {
                    property: "Semana",
                    direction: "ascending",
                },
            ]
        );

        const weeks = response.results.map((page: any) => {
            const props = page.properties;
            const title = props.Name?.title?.[0]?.plain_text || "Untitled";
            const slug = props.Slug?.rich_text?.[0]?.plain_text || "";
            const weekNumber = props.Semana?.number || 0;
            const date = props.Fecha?.date?.start || "";
            const summary = props.Resumen?.rich_text?.[0]?.plain_text || "";
            const type = props.Tipo?.select?.name || "";
            const hasKey = props.Clave?.rich_text?.length > 0;

            return {
                id: page.id,
                title,
                slug,
                weekNumber,
                date,
                summary,
                type,
                hasKey,
            };
        });

        return weeks;
    } catch (error) {
        console.error("Error fetching weeks:", error);
        return [];
    }
};

export const getPageContent = async (slug: string): Promise<ExtendedRecordMap | null> => {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const token = process.env.NOTION_TOKEN;

    if (!databaseId || !token) {
        console.warn("getPageContent: Missing credentials. Using mock recordMap.");
        return {
            block: {
                "block-id": {
                    role: "editor",
                    value: {
                        id: "block-id",
                        type: "page",
                        properties: { title: [["Mock Page Content"]] },
                        content: ["block-id-2"],
                        version: 1,
                        format: {},
                    } as any
                },
                "block-id-2": {
                    role: "editor",
                    value: {
                        id: "block-id-2",
                        type: "text",
                        properties: { title: [["This is mock content because credentials are missing."]] },
                        version: 1
                    } as any
                }
            },
            signed_urls: {},
            collection: {},
            collection_view: {},
            notion_user: {},
            collection_query: {},
            space: {},
        } as unknown as ExtendedRecordMap;
    }

    // 1. Find the page ID by slug
    // Use direct fetch helper
    const response = await queryDatabase(
        databaseId,
        {
            and: [
                {
                    property: "Slug",
                    rich_text: {
                        equals: slug,
                    },
                },
                {
                    property: "Publicado",
                    checkbox: {
                        equals: true,
                    },
                },
            ],
        },
        [] // no sort needed
    );

    if (!response.results || response.results.length === 0) {
        return null;
    }

    const pageId = response.results[0].id;

    // 2. Fetch the recordMap using notion-client
    const api = getNotionAPI();
    const recordMap = await api.getPage(pageId);

    return recordMap;
};
