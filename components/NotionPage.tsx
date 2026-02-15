"use client";

import { NotionRenderer } from "react-notion-x";
import { useTheme } from "next-themes";
import { ExtendedRecordMap } from "notion-types";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import "react-notion-x/src/styles.css";

// Dynamic imports for heavy components
const Code = dynamic(() =>
    import("react-notion-x/build/third-party/code").then((m) => m.Code)
);
const Equation = dynamic(() =>
    import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
    () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
    {
        ssr: false,
    }
);
const Modal = dynamic(
    () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
    {
        ssr: false,
    }
);

interface NotionPageProps {
    recordMap: ExtendedRecordMap;
    rootPageId?: string;
}

// Strip collection/property data from the recordMap so properties never render
function stripCollectionData(recordMap: ExtendedRecordMap): ExtendedRecordMap {
    const cleaned = { ...recordMap };
    // Remove collection and collection_view data
    cleaned.collection = {};
    cleaned.collection_view = {};
    // Remove collection_query data if present
    if ((cleaned as any).collection_query) {
        (cleaned as any).collection_query = {};
    }
    return cleaned;
}

export function NotionPage({ recordMap, rootPageId }: NotionPageProps) {
    const { theme } = useTheme();
    const cleanedRecordMap = React.useMemo(() => stripCollectionData(recordMap), [recordMap]);

    return (
        <div className="notion-brutalist-wrapper">
            <NotionRenderer
                recordMap={cleanedRecordMap}
                fullPage={false}
                darkMode={theme === "dark"}
                rootPageId={rootPageId}
                showTableOfContents={false}
                disableHeader={true}
                components={{
                    Code,
                    Equation,
                    Pdf,
                    Modal,
                    nextLink: Link,
                }}
                className="!p-0 !max-w-none bg-transparent"
                bodyClassName="!p-0 !max-w-none"
            />
        </div>
    );
}
