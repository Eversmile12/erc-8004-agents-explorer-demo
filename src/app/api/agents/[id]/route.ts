import { NextRequest, NextResponse } from "next/server";
import { getAgentWithFeedback } from "@/lib/subgraph.handler";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: rawId } = await params;
    const id = decodeURIComponent(rawId);

    try {
        const agent = await getAgentWithFeedback(id, 10);

        if (!agent) {
            return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, agent });
    } catch (error) {
        console.error("[Agent Detail API] Error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
