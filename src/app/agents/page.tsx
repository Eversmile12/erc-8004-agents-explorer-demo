"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Filter, ExternalLink, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/types/agent";
import { truncateAddress, getDisplayName, formatDate, getProtocols, PROTOCOL_COLORS } from "@/lib/format";

export default function AgentsPage() {
    return (
        <Suspense fallback={<AgentsLoading />}>
            <AgentsContent />
        </Suspense>
    );
}

function AgentsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        </div>
    );
}

function AgentsContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [sortBy, setSortBy] = useState("createdAt:desc");
    const [protocolFilter, setProtocolFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [perPage, setPerPage] = useState("12");

    const fetchAgents = async (page: number = 1, query?: string) => {
        setIsLoading(true);
        const searchTerm = query !== undefined ? query : searchQuery;
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: perPage,
                sort: sortBy,
            });
            if (searchTerm) params.set("q", searchTerm);
            if (protocolFilter !== "all") params.set("protocol", protocolFilter);

            const response = await fetch(`/api/agents?${params}`);
            const data = await response.json();

            if (data.success) {
                setAgents(data.items);
                setHasMore(data.hasMore);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error("Failed to fetch agents:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents(1, searchQuery);
    }, [sortBy, perPage, protocolFilter, initialQuery]);

    const handleSearch = () => fetchAgents(1);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Agent Registry</h1>
                <p className="mt-2 text-muted-foreground">
                    Discover and explore autonomous agents on the ERC-8004 registry
                </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by agent name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="createdAt:desc">Newest</SelectItem>
                            <SelectItem value="updatedAt:desc">Last Updated</SelectItem>
                            <SelectItem value="lastActivity:desc">Most Active</SelectItem>
                            <SelectItem value="totalFeedback:desc">Most Feedback</SelectItem>
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64" align="end">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Chain</label>
                                    <Select defaultValue="sepolia">
                                        <SelectTrigger className="mt-1.5 w-full">
                                            <SelectValue placeholder="All Chains" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sepolia">Sepolia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Protocol</label>
                                    <Select value={protocolFilter} onValueChange={setProtocolFilter}>
                                        <SelectTrigger className="mt-1.5 w-full">
                                            <SelectValue placeholder="All Protocols" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Protocols</SelectItem>
                                            <SelectItem value="mcp">MCP</SelectItem>
                                            <SelectItem value="a2a">A2A</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[300px]">Name</TableHead>
                            <TableHead>Chain</TableHead>
                            <TableHead>Protocol</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead className="text-center">X402</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : agents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                    No agents found
                                </TableCell>
                            </TableRow>
                        ) : (
                            agents.map((agent) => (
                                <TableRow key={agent.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted overflow-hidden">
                                                {agent.registrationFile?.image ? (
                                                    <img
                                                        src={agent.registrationFile.image}
                                                        alt={getDisplayName(agent)}
                                                        className="h-8 w-8 rounded-md object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">🤖</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="font-medium truncate block max-w-[200px]">
                                                    {getDisplayName(agent)}
                                                </span>
                                                {agent.registrationFile?.description && (
                                                    <span className="text-xs text-muted-foreground truncate block max-w-[200px]">
                                                        {agent.registrationFile.description}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                        >
                                            Sepolia
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {getProtocols(agent).map((protocol) => (
                                                <Badge
                                                    key={protocol}
                                                    variant="outline"
                                                    className={PROTOCOL_COLORS[protocol]}
                                                >
                                                    {protocol}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-sm text-muted-foreground">
                                            {truncateAddress(agent.owner)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {agent.registrationFile?.x402support ? (
                                            <span className="text-emerald-400">✓</span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {formatDate(agent.createdAt)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link
                                            href={`/agents/${agent.id}`}
                                            className="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300"
                                        >
                                            View
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Showing {agents.length} agents</span>
                    <span className="text-border">|</span>
                    <span>Per page:</span>
                    <Select value={perPage} onValueChange={setPerPage}>
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                            <SelectItem value="48">48</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => fetchAgents(currentPage - 1)}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>
                    <span className="px-3 text-sm text-muted-foreground">Page {currentPage}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!hasMore}
                        onClick={() => fetchAgents(currentPage + 1)}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
