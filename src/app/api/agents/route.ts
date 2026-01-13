import { NextRequest, NextResponse } from "next/server";
import { getAgents, searchAgents, OrderBy, OrderDirection } from "@/lib/subgraph.handler";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "12", 10);
    const query = searchParams.get("q") || undefined;
    const sort = searchParams.get("sort") || "createdAt:desc";
    const protocol = searchParams.get("protocol") || undefined;

    const [orderBy, orderDirection] = sort.split(":") as [OrderBy, OrderDirection];
    const skip = (page - 1) * pageSize;

    try {
        if (query) {
            const results = await searchAgents({ query, first: pageSize, skip, protocol });
            return NextResponse.json({
                success: true,
                items: results,
                page,
                pageSize,
                hasMore: results.length === pageSize,
            });
        }

        const agents = await getAgents({ first: pageSize, skip, orderBy, orderDirection, protocol });
        return NextResponse.json({
            success: true,
            items: agents,
            page,
            pageSize,
            hasMore: agents.length === pageSize,
        });
    } catch (error) {
        console.error("[Agents API] Error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Unknown error", items: [] },
            { status: 500 }
        );
    }
}
