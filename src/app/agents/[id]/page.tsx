"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Share2,
    Star,
    MessageSquare,
    CheckCircle,
    Clock,
    Copy,
    Calendar,
    RefreshCw,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { AgentWithDetails } from "@/types/agent";
import { truncateAddress, getDisplayName, formatDateTime, formatRelativeTime } from "@/lib/format";

type Tab = "overview" | "metadata";

export default function AgentDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [agent, setAgent] = useState<AgentWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("overview");

    useEffect(() => {
        async function fetchAgent() {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/agents/${encodeURIComponent(id)}`);
                const data = await response.json();
                if (data.success) {
                    setAgent(data.agent);
                } else {
                    setError(data.error || "Failed to load agent");
                }
            } catch {
                setError("Failed to fetch agent details");
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchAgent();
    }, [id]);

    const copyToClipboard = (text: string, label?: string) => {
        navigator.clipboard.writeText(text);
        toast.success(label ? `${label} copied to clipboard` : "Copied to clipboard");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !agent) {
        return (
            <div className="min-h-screen">
                <div className="border-b border-border">
                    <div className="container mx-auto px-6 py-4">
                        <Link
                            href="/agents"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Agents
                        </Link>
                    </div>
                </div>
                <div className="container mx-auto px-6 py-16 text-center">
                    <h1 className="text-2xl font-bold">Agent Not Found</h1>
                    <p className="mt-2 text-muted-foreground">
                        {error || "The agent you're looking for doesn't exist."}
                    </p>
                </div>
            </div>
        );
    }

    const totalFeedback = parseInt(agent.totalFeedback) || 0;
    const totalValidations = agent.stats ? parseInt(agent.stats.totalValidations) || 0 : 0;
    const averageScore = agent.stats ? parseFloat(agent.stats.averageFeedbackValue) || 0 : 0;

    return (
        <div className="min-h-screen">
            {/* Back link */}
            <div className="border-b border-border">
                <div className="container mx-auto px-6 py-4">
                    <Link
                        href="/agents"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Agents
                    </Link>
                </div>
            </div>

            {/* Agent header */}
            <div className="container mx-auto px-6 py-8">
                <div className="flex items-start justify-between">
                    <div className="flex gap-6">
                        <div className="h-24 w-24 overflow-hidden rounded-lg bg-muted">
                            {agent.registrationFile?.image ? (
                                <img
                                    src={agent.registrationFile.image}
                                    alt={getDisplayName(agent)}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-4xl">🤖</div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-3">
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                    Sepolia
                                </Badge>
                                <h1 className="text-2xl font-bold">{getDisplayName(agent)}</h1>
                            </div>
                            <p className="mt-2 max-w-2xl text-muted-foreground">
                                {agent.registrationFile?.description || "No description available."}
                            </p>
                            <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <MessageSquare className="h-4 w-4" />
                                    {totalFeedback} Reviews
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle className="h-4 w-4" />
                                    {totalValidations} Validations
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    Last active {formatRelativeTime(agent.lastActivity)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(window.location.href, "Link")}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                </div>

                {/* Tabs */}
                <div className="mt-8 border-b border-border">
                    <div className="flex gap-8">
                        {(["overview", "metadata"] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-medium capitalize transition-colors ${
                                    activeTab === tab
                                        ? "border-b-2 border-cyan-400 text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab content */}
                <div className="mt-8">
                    {activeTab === "overview" && (
                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="space-y-6 lg:col-span-2">
                                {/* Statistics */}
                                <div className="rounded-lg border border-border p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="text-xl">📊</span>
                                        <h2 className="font-semibold">Statistics Overview</h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        <StatCard
                                            icon={Star}
                                            color="amber"
                                            value={averageScore.toFixed(1)}
                                            label="Average Score"
                                            sublabel="(/100)"
                                        />
                                        <StatCard
                                            icon={MessageSquare}
                                            color="orange"
                                            value={totalFeedback}
                                            label="Total Reviews"
                                        />
                                        <StatCard
                                            icon={CheckCircle}
                                            color="emerald"
                                            value={totalValidations}
                                            label="Total Validations"
                                        />
                                        <StatCard
                                            icon={Clock}
                                            color="cyan"
                                            value={formatDateTime(agent.lastActivity).split(",")[0]}
                                            label="Last Activity"
                                            small
                                        />
                                    </div>
                                </div>

                                {/* Endpoints */}
                                <div className="rounded-lg border border-border p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-xl">🔗</span>
                                        <div>
                                            <h2 className="font-semibold">Endpoints</h2>
                                            <p className="text-sm text-muted-foreground">Agent service endpoints</p>
                                        </div>
                                    </div>
                                    {agent.registrationFile?.mcpEndpoint || agent.registrationFile?.a2aEndpoint ? (
                                        <div className="space-y-3">
                                            {agent.registrationFile.mcpEndpoint && (
                                                <EndpointCard
                                                    type="MCP"
                                                    endpoint={agent.registrationFile.mcpEndpoint}
                                                    onCopy={() =>
                                                        copyToClipboard(
                                                            agent.registrationFile!.mcpEndpoint!,
                                                            "MCP endpoint"
                                                        )
                                                    }
                                                />
                                            )}
                                            {agent.registrationFile.a2aEndpoint && (
                                                <EndpointCard
                                                    type="A2A"
                                                    endpoint={agent.registrationFile.a2aEndpoint}
                                                    onCopy={() =>
                                                        copyToClipboard(
                                                            agent.registrationFile!.a2aEndpoint!,
                                                            "A2A endpoint"
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No endpoints configured.</p>
                                    )}
                                </div>

                                {/* Reviews */}
                                <div className="rounded-lg border border-border p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="font-semibold">Reviews</h2>
                                        {totalFeedback > 0 && (
                                            <span className="text-sm text-muted-foreground">
                                                Showing {agent.feedback.length} of {totalFeedback}
                                            </span>
                                        )}
                                    </div>
                                    {agent.feedback.length > 0 ? (
                                        <div className="space-y-4">
                                            {agent.feedback.map((review) => (
                                                <div key={review.id} className="rounded-lg border border-border p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <span className="font-mono text-muted-foreground">
                                                                    {truncateAddress(review.clientAddress)}
                                                                </span>
                                                                <span className="text-muted-foreground">
                                                                    {formatRelativeTime(review.createdAt)}
                                                                </span>
                                                            </div>
                                                            <div className="mt-2 flex flex-wrap gap-1">
                                                                {review.tag1 && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {review.tag1}
                                                                    </Badge>
                                                                )}
                                                                {review.tag2 && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {review.tag2}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {review.feedbackFile?.text && (
                                                                <p className="mt-2 text-sm">
                                                                    {review.feedbackFile.text}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="rounded-lg bg-emerald-500/20 px-3 py-2 text-center">
                                                            <div className="text-lg font-bold text-emerald-400">
                                                                {review.value}
                                                            </div>
                                                            <div className="text-xs text-emerald-400/70">/100</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No reviews yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div>
                                <div className="rounded-lg border border-border p-6">
                                    <h2 className="font-semibold mb-4">Basic Information</h2>
                                    <div className="space-y-4">
                                        <InfoRow
                                            label="AGENT ID"
                                            value={agent.agentId.split(":")[1] || agent.agentId}
                                            onCopy={() => copyToClipboard(agent.id, "Agent ID")}
                                        />
                                        <InfoRow
                                            label="OWNER"
                                            value={truncateAddress(agent.owner)}
                                            onCopy={() => copyToClipboard(agent.owner, "Owner address")}
                                        />
                                        {agent.agentURI && (
                                            <InfoRow
                                                label="AGENT URI"
                                                value={agent.agentURI}
                                                truncate
                                                onCopy={() => copyToClipboard(agent.agentURI!, "Agent URI")}
                                            />
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">CREATED</span>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                {formatDateTime(agent.createdAt)}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">LAST UPDATED</span>
                                            <div className="flex items-center gap-2 text-sm">
                                                <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                                                {formatRelativeTime(agent.updatedAt)}
                                            </div>
                                        </div>
                                        {agent.registrationFile?.active !== null && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">STATUS</span>
                                                <Badge
                                                    className={
                                                        agent.registrationFile?.active
                                                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                            : "bg-red-500/20 text-red-400 border-red-500/30"
                                                    }
                                                >
                                                    {agent.registrationFile?.active ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>
                                        )}
                                        {agent.registrationFile?.x402Support && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">X402 SUPPORT</span>
                                                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                                    Enabled
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "metadata" && (
                        <div className="rounded-lg border border-border p-6">
                            <div className="mb-4">
                                <h2 className="font-semibold">Offchain Content</h2>
                                <p className="text-sm text-muted-foreground">Parsed offchain metadata JSON</p>
                            </div>
                            <pre className="overflow-x-auto rounded-lg bg-muted/50 p-4 text-sm">
                                <code>{JSON.stringify(agent.registrationFile, null, 2)}</code>
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Color mappings for Tailwind (dynamic classes don't work)
const STAT_COLORS = {
    amber: {
        border: "border-amber-500/30",
        bg: "bg-amber-500/5",
        icon: "text-amber-400",
    },
    orange: {
        border: "border-orange-500/30",
        bg: "bg-orange-500/5",
        icon: "text-orange-400",
    },
    emerald: {
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5",
        icon: "text-emerald-400",
    },
    cyan: {
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/5",
        icon: "text-cyan-400",
    },
} as const;

const ENDPOINT_COLORS = {
    MCP: {
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5",
        badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    A2A: {
        border: "border-blue-500/30",
        bg: "bg-blue-500/5",
        badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
} as const;

// Helper components
function StatCard({
    icon: Icon,
    color,
    value,
    label,
    sublabel,
    small,
}: {
    icon: React.ElementType;
    color: keyof typeof STAT_COLORS;
    value: string | number;
    label: string;
    sublabel?: string;
    small?: boolean;
}) {
    const colors = STAT_COLORS[color];
    return (
        <div className={`rounded-lg border ${colors.border} ${colors.bg} p-4 text-center`}>
            <Icon className={`mx-auto h-6 w-6 ${colors.icon}`} />
            <div className={`mt-2 ${small ? "text-sm" : "text-2xl"} font-bold`}>{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
            {sublabel && <div className="text-xs text-muted-foreground">{sublabel}</div>}
        </div>
    );
}

function EndpointCard({ type, endpoint, onCopy }: { type: "MCP" | "A2A"; endpoint: string; onCopy: () => void }) {
    const colors = ENDPOINT_COLORS[type];
    return (
        <div className={`flex items-center justify-between rounded-lg border ${colors.border} ${colors.bg} p-3`}>
            <div>
                <Badge className={`${colors.badge} mb-1`}>{type}</Badge>
                <p className="text-sm font-mono">{endpoint}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onCopy}>
                <Copy className="h-4 w-4" />
            </Button>
        </div>
    );
}

function InfoRow({
    label,
    value,
    truncate,
    onCopy,
}: {
    label: string;
    value: string;
    truncate?: boolean;
    onCopy: () => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <span className={`font-mono text-sm ${truncate ? "truncate max-w-[120px]" : ""}`}>{value}</span>
                <button onClick={onCopy} className="text-muted-foreground hover:text-foreground">
                    <Copy className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}
