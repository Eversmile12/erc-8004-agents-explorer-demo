import type { Agent } from "@/types/agent";

// Truncate Ethereum address for display
export function truncateAddress(address: string): string {
    if (!address) return "-";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Get display name for agent (fallback to ID if no name)
export function getDisplayName(agent: Agent): string {
    if (agent.registrationFile?.name && agent.registrationFile.name !== agent.id) {
        return agent.registrationFile.name;
    }
    return `Agent #${agent.agentId.split(":")[1] || agent.agentId}`;
}

// Format Unix timestamp to readable date
export function formatDate(timestamp: string): string {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// Format Unix timestamp with time
export function formatDateTime(timestamp: string): string {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// Format timestamp as relative time (e.g., "5 minutes ago")
export function formatRelativeTime(timestamp: string): string {
    const date = new Date(parseInt(timestamp) * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;
    return formatDate(timestamp);
}

// Get protocols supported by agent
export function getProtocols(agent: Agent): string[] {
    const protocols: string[] = [];
    if (agent.registrationFile?.mcpEndpoint) protocols.push("MCP");
    if (agent.registrationFile?.a2aEndpoint) protocols.push("A2A");
    if (protocols.length === 0) protocols.push("CUSTOM");
    return protocols;
}

// Protocol badge colors
export const PROTOCOL_COLORS: Record<string, string> = {
    CUSTOM: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    A2A: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    MCP: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};
