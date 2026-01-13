import { GraphQLClient, gql } from "graphql-request";
import type { Agent, Feedback, AgentStats, AgentWithDetails } from "@/types/agent";

// Re-export types for convenience
export type { Agent, Feedback, AgentStats, AgentWithDetails };

// Subgraph endpoint for Sepolia
const SUBGRAPH_URL =
    "https://gateway.thegraph.com/api/00a452ad3cd1900273ea62c1bf283f93/subgraphs/id/6wQRC7geo9XYAhckfmfo8kbMRLeWU8KQd3XsJqFKmZLT";
const client = new GraphQLClient(SUBGRAPH_URL);

// GraphQL fragment for agent fields (reduces duplication)
const AGENT_FIELDS = `
  id
  agentId
  chainId
  owner
  operators
  agentURI
  createdAt
  updatedAt
  totalFeedback
  lastActivity
  registrationFile {
    name
    description
    image
    active
    x402support
    supportedTrusts
    mcpEndpoint
    mcpTools
    a2aEndpoint
    a2aSkills
  }
`;

const AGENT_FIELDS_FULL = `
  id
  agentId
  chainId
  owner
  operators
  agentURI
  createdAt
  updatedAt
  totalFeedback
  lastActivity
  registrationFile {
    name
    description
    image
    active
    x402support
    supportedTrusts
    mcpEndpoint
    mcpVersion
    mcpTools
    mcpPrompts
    mcpResources
    a2aEndpoint
    a2aVersion
    a2aSkills
    ens
    did
  }
`;

// Queries
const GET_AGENTS = gql`
  query GetAgents($first: Int!, $skip: Int!, $orderBy: Agent_orderBy!, $orderDirection: OrderDirection!) {
    agents(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      ${AGENT_FIELDS}
    }
  }
`;

const GET_AGENTS_MCP = gql`
  query GetAgentsMCP($first: Int!, $skip: Int!, $orderBy: Agent_orderBy!, $orderDirection: OrderDirection!) {
    agents(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: { registrationFile_: { mcpEndpoint_not: null } }) {
      ${AGENT_FIELDS}
    }
  }
`;

const GET_AGENTS_A2A = gql`
  query GetAgentsA2A($first: Int!, $skip: Int!, $orderBy: Agent_orderBy!, $orderDirection: OrderDirection!) {
    agents(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: { registrationFile_: { a2aEndpoint_not: null } }) {
      ${AGENT_FIELDS}
    }
  }
`;

const SEARCH_AGENTS = gql`
  query SearchAgents($first: Int!, $skip: Int!, $nameContains: String!) {
    agents(where: { registrationFile_: { name_contains_nocase: $nameContains } }, first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      ${AGENT_FIELDS}
    }
  }
`;

const SEARCH_AGENTS_MCP = gql`
  query SearchAgentsMCP($first: Int!, $skip: Int!, $nameContains: String!) {
    agents(where: { registrationFile_: { name_contains_nocase: $nameContains, mcpEndpoint_not: null } }, first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      ${AGENT_FIELDS}
    }
  }
`;

const SEARCH_AGENTS_A2A = gql`
  query SearchAgentsA2A($first: Int!, $skip: Int!, $nameContains: String!) {
    agents(where: { registrationFile_: { name_contains_nocase: $nameContains, a2aEndpoint_not: null } }, first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      ${AGENT_FIELDS}
    }
  }
`;

const GET_AGENT_WITH_FEEDBACK = gql`
  query GetAgentWithFeedback($id: ID!, $feedbackFirst: Int!) {
    agent(id: $id) {
      ${AGENT_FIELDS_FULL}
      feedback(where: { isRevoked: false }, orderBy: createdAt, orderDirection: desc, first: $feedbackFirst) {
        id
        score
        tag1
        tag2
        clientAddress
        createdAt
        feedbackFile {
          text
          capability
          skill
          task
          context
        }
      }
    }
    agentStats(id: $id) {
      totalFeedback
      averageScore
      scoreDistribution
      totalValidations
      completedValidations
      lastActivity
    }
  }
`;

// Handler types
export type OrderBy = "createdAt" | "updatedAt" | "lastActivity" | "totalFeedback";
export type OrderDirection = "asc" | "desc";

interface GetAgentsParams {
    first?: number;
    skip?: number;
    orderBy?: OrderBy;
    orderDirection?: OrderDirection;
    protocol?: string;
}

interface SearchAgentsParams {
    query: string;
    first?: number;
    skip?: number;
    protocol?: string;
}

// Handler functions
export async function getAgents(params: GetAgentsParams = {}): Promise<Agent[]> {
    const { first = 20, skip = 0, orderBy = "createdAt", orderDirection = "desc", protocol } = params;

    let query = GET_AGENTS;
    if (protocol === "mcp") query = GET_AGENTS_MCP;
    else if (protocol === "a2a") query = GET_AGENTS_A2A;

    const response = await client.request<{ agents: Agent[] }>(query, { first, skip, orderBy, orderDirection });
    return response.agents;
}

export async function searchAgents(params: SearchAgentsParams): Promise<Agent[]> {
    const { query, first = 50, skip = 0, protocol } = params;

    let gqlQuery = SEARCH_AGENTS;
    if (protocol === "mcp") gqlQuery = SEARCH_AGENTS_MCP;
    else if (protocol === "a2a") gqlQuery = SEARCH_AGENTS_A2A;

    const response = await client.request<{ agents: Agent[] }>(gqlQuery, { first, skip, nameContains: query });
    return response.agents;
}

export async function getAgentWithFeedback(id: string, feedbackFirst: number = 10): Promise<AgentWithDetails | null> {
    const response = await client.request<{
        agent: (Agent & { feedback: Feedback[] }) | null;
        agentStats: AgentStats | null;
    }>(GET_AGENT_WITH_FEEDBACK, { id, feedbackFirst });

    if (!response.agent) return null;

    return { ...response.agent, stats: response.agentStats };
}
