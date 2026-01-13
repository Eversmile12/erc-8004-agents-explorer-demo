// Agent registration file from IPFS
export interface AgentRegistrationFile {
    name: string | null;
    description: string | null;
    image: string | null;
    active: boolean | null;
    x402support: boolean | null;
    supportedTrusts: string[];
    mcpEndpoint: string | null;
    mcpVersion: string | null;
    mcpTools: string[];
    mcpPrompts: string[];
    mcpResources: string[];
    a2aEndpoint: string | null;
    a2aVersion: string | null;
    a2aSkills: string[];
    ens: string | null;
    did: string | null;
}

// Core agent entity from subgraph
export interface Agent {
    id: string;
    agentId: string;
    chainId: string;
    owner: string;
    operators: string[];
    agentURI: string | null;
    createdAt: string;
    updatedAt: string;
    totalFeedback: string;
    lastActivity: string;
    registrationFile: AgentRegistrationFile | null;
}

// Feedback from users
export interface Feedback {
    id: string;
    score: number;
    tag1: string | null;
    tag2: string | null;
    clientAddress: string;
    createdAt: string;
    isRevoked: boolean;
    feedbackFile: {
        text: string | null;
        capability: string | null;
        skill: string | null;
        task: string | null;
        context: string | null;
    } | null;
    responses: {
        responder: string;
        responseUri: string | null;
        createdAt: string;
    }[];
}

// Agent statistics
export interface AgentStats {
    totalFeedback: string;
    averageScore: string;
    scoreDistribution: number[];
    totalValidations: string;
    completedValidations: string;
    lastActivity: string;
}

// Agent with all related data (for detail page)
export interface AgentWithDetails extends Agent {
    feedback: Feedback[];
    stats: AgentStats | null;
}
