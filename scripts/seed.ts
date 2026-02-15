import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;

const csvData = `Name,Semana,Fecha,Tipo,Tema,Resumen,Slug,Publicado,Año
Semana 01 Bienvenida y equipo de grabación,1,2026-02-17,Clase,Intro + equipo de grabación,Pipeline del curso + cómo grabar limpio + room tone,semana-01,TRUE,2026
Semana 02 Formatos y edición base,2,2026-02-24,Clase,Formatos + limpieza + export,48k/24bit mono/estéreo + trims/fades + export preset,semana-02,TRUE,2026
Semana 03 Foley con variaciones,3,2026-03-03,Clase,Foley + variación controlada,5 acciones x 3 variaciones + consistencia,semana-03,TRUE,2026
Semana 04 Loops perfectos ambience,4,2026-03-10,Clase,Loops sin clicks,Crossfades + puntos de loop + ambience,semana-04,TRUE,2026
Semana 05 SFX gameplay como sistema,5,2026-03-17,Clase,Categorías + prioridades + footsteps,Qué se oye primero + pack de pasos variado,semana-05,TRUE,2026
Semana 06 Parcial 1,6,2026-03-24,Parcial,Evaluación librería bloque 1,Entrega ordenada de librería + loops + footsteps,semana-06,TRUE,2026
Semana 07 Asueto Semana Santa,7,2026-03-31,Asueto,Sin clase,Asueto (tarea ligera opcional),semana-07,TRUE,2026
Semana 08 Asueto,8,2026-04-07,Asueto,Sin clase,Asueto (tarea ligera opcional),semana-08,TRUE,2026
Semana 09 Tecnicrea,9,2026-04-14,Tecnicrea,Actividad institucional,Clínica/feedback si se puede,semana-09,TRUE,2026
Semana 10 Música para juego,10,2026-04-21,Clase,Stems + transiciones,Música lista para interactividad (A/B),semana-10,TRUE,2026
Semana 11 Reciclaje de sonido,11,2026-04-28,Clase,1 objeto pack completo,Pack creativo mínimo 20 assets + 1 loop,semana-11,TRUE,2026
Semana 12 Doblaje 1 grabación,12,2026-05-05,Clase,Doblaje 1 (grabación limpia),Microfonía + toma + niveles + intención,semana-12,TRUE,2026
Semana 13 Doblaje 2 edición y sync,13,2026-05-12,Clase,Doblaje 2 (edición + sincronía),Comping + limpieza + loudness + sync básico,semana-13,TRUE,2026
Semana 14 Parcial 2,14,2026-05-19,Parcial,Evaluación VO + librería,Entrega VO + consistencia + orden,semana-14,TRUE,2026
Semana 15 Intro FMOD,15,2026-05-26,Clase,FMOD conceptos base,Proyecto FMOD + buses + routing + eventos básicos,semana-15,TRUE,2026
Semana 16 FMOD eventos + params,16,2026-06-02,Clase,Eventos + parámetro simple,8–10 eventos + 1 param (pitch/vol),semana-16,TRUE,2026
Semana 17 FMOD variación avanzada,17,2026-06-09,Clase,Random + anti-repeat,Sistema de variación para no repetir,semana-17,TRUE,2026
Semana 18 RTPC aplicado,18,2026-06-16,Clase,Parámetro que controle 2 cosas,RTPC con curvas (ej pitch+filtro),semana-18,TRUE,2026
Semana 19 Unity + FMOD integración mínima,19,2026-06-23,Clase,Triggers simples en engine,Escena simple con 6 eventos funcionando,semana-19,TRUE,2026
Semana 20 Asueto,20,2026-06-30,Asueto,Sin clase,Asueto (QA opcional),semana-20,TRUE,2026
Semana 21 Finales institucionales,21,2026-07-07,Final,Sin clase por finales,Semana de exámenes (plan proyecto),semana-21,TRUE,2026
Semana 22 Proyecto final preproducción,22,2026-07-14,Proyecto,Scope + milestones,Audio map final + backlog + límites,semana-22,TRUE,2026
Semana 23 Proyecto final v1,23,2026-07-21,Proyecto,Implementación v1,V1 jugable + video corto,semana-23,TRUE,2026
Semana 24 Proyecto final v2 polish,24,2026-07-28,Proyecto,Polish + QA,Mezcla + variación + fixes,semana-24,TRUE,2026
Semana 25 Presentación final,25,2026-08-04,Final,Demo + entrega final,Build + doc + video + retro,semana-25,TRUE,2026`;

async function seed() {
    if (!databaseId) {
        console.error("Missing NOTION_DATABASE_ID");
        return;
    }

    // Schema update skipped as we rely on manual setup.
    console.log("Skipping schema update...");
    /*
    console.log("Updating database schema...");
    try {
        await notion.databases.update({
            database_id: databaseId,
            properties: {
                "Semana": { number: {} },
                "Fecha": { date: {} },
                "Slug": { rich_text: {} },
                "Resumen": { rich_text: {} },
                "Publicado": { checkbox: {} },
                "Clave": { rich_text: {} },
                "Tipo": { select: {} },
                "Tema": { rich_text: {} },
                "Año": { number: {} }
            }
        });
        console.log("Schema updated.");
    } catch (e: any) {
        console.error("Schema update failed:", e);
        // return; // Stop execution if schema update fails
    }
    */

    const rows = csvData.split("\n").slice(1);

    for (const row of rows) {
        // Basic CSV parsing (assuming no commas within fields for simplicity based on provided data)
        // For robust parsing, a library like csv-parse is better, but this suffices for the provided simple data.
        const columns = row.split(",");

        // Handle potential commas inside "Tema" or "Resumen" if they were not quoted.
        // The provided data seems to have commas only as separators, except... wait.
        // "Intro + equipo de grabación" -> "Intro + equipo de grabación"
        // "Pipeline del curso + cómo grabar limpio + room tone" -> seems safe.
        // Let's use a regex to be safer or just simple split if we trust the user input format.
        // User input: Name,Semana,Fecha,Tipo,Tema,Resumen,Slug,Publicado,Año

        // There might be commas in the content. Let's try to match 9 fields.
        // Actually, looking at the data: "48k/24bit mono/estéreo + trims/fades + export preset" has no commas.
        // "RTPC con curvas (ej pitch+filtro)" has no commas.
        // Seems safe to split by comma for now.

        if (columns.length < 9) {
            // Simple split might have failed if there were commas.
            // Let's try to reconstruct if needed, or just warn.
            console.warn("Skipping malformed row:", row);
            continue;
        }

        // Re-joining loose parts if split was too aggressive?
        // Given the structure, let's assume standard CSV.
        // Name, Semana, Fecha, Tipo, Tema, Resumen, Slug, Publicado, Año

        // A more robust way without a library for this specific data:
        // Regex for: value,value,value... 
        // But let's stick to simple split and map by index for speed, assuming no commas in text.

        const [name, weekStr, date, type, theme, summary, slug, publishedStr, year] = columns;

        console.log(`Creating: ${name}`);

        try {
            await notion.pages.create({
                parent: { database_id: databaseId },
                properties: {
                    Name: {
                        title: [{ text: { content: name } }],
                    },
                    Semana: {
                        number: parseInt(weekStr),
                    },
                    Fecha: {
                        date: { start: date },
                    },
                    Tipo: { // New property
                        select: { name: type },
                    },
                    Tema: { // New property
                        rich_text: [{ text: { content: theme } }],
                    },
                    Resumen: {
                        rich_text: [{ text: { content: summary } }],
                    },
                    Slug: {
                        rich_text: [{ text: { content: slug } }],
                    },
                    Publicado: {
                        checkbox: publishedStr.toUpperCase() === "TRUE",
                    },
                    Año: { // New property
                        number: parseInt(year),
                    },
                },
                children: [
                    {
                        object: "block",
                        type: "heading_2",
                        heading_2: {
                            rich_text: [{ text: { content: theme } }],
                        },
                    },
                    {
                        object: "block",
                        type: "paragraph",
                        paragraph: {
                            rich_text: [{ text: { content: `Tipo: ${type}` } }],
                        },
                    },
                    {
                        object: "block",
                        type: "paragraph",
                        paragraph: {
                            rich_text: [{ text: { content: summary } }],
                        },
                    },
                ],
            });
        } catch (error) {
            console.error(`Failed to create page for ${name}:`, error);
        }
    }
}

seed();
