// Agent registration file from IPFS
export interface AgentRegistrationFile {
    name: string | null;
    description: string | null;
    image: string | null;
    active: boolean | null;
    x402Support: boolean | null;
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
    value: string;
    tag1: string | null;
    tag2: string | null;
    clientAddress: string;
    createdAt: string;
    feedbackFile: {
        text: string | null;
        mcpTool: string | null;
        mcpPrompt: string | null;
        mcpResource: string | null;
        a2aSkills: string[];
        a2aContextId: string | null;
        a2aTaskId: string | null;
    } | null;
}

// Agent statistics
export interface AgentStats {
    totalFeedback: string;
    averageFeedbackValue: string;
    averageValidationScore: string;
    totalValidations: string;
    completedValidations: string;
    lastActivity: string;
}

// Agent with all related data (for detail page)
export interface AgentWithDetails extends Agent {
    feedback: Feedback[];
    stats: AgentStats | null;
}
