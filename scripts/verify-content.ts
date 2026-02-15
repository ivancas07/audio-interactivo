
import dotenv from "dotenv";
import path from "path";
// Load env before importing lib
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { getPublishedWeeks } from "../lib/notion";

async function verify() {
    console.log("Verifying content...");
    console.log("DB ID:", process.env.NOTION_DATABASE_ID);
    try {
        const weeks = await getPublishedWeeks();
        console.log(`Found ${weeks.length} weeks.`);
        weeks.forEach(w => {
            console.log(`- Week ${w.weekNumber}: ${w.title} (${w.summary})`);
        });
    } catch (e) {
        console.error("Failed:", e);
    }
}

verify();
