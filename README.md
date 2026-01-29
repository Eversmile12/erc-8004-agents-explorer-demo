# ERC-8004 Scanner Demo

[ERC-8004 Spec](https://8004.org) · [Registration Guide](https://github.com/erc-8004/best-practices/blob/main/Registration.md) · [Reputation Guide](https://github.com/erc-8004/best-practices/blob/main/Reputation.md) · [Agent0 SDK](https://sdk.ag0.xyz/)

---

A demo application for exploring autonomous AI agents registered on the ERC-8004 protocol. Built as a learning resource for developers wanting to integrate with the ERC-8004 agent registry.

## What is ERC-8004?

[ERC-8004](https://8004.org) is a standard for registering autonomous AI agents on Ethereum. It provides:

- **On-chain registry** - Agents are registered with their metadata URI, owner, and operators
- **Off-chain metadata** - Agent capabilities, endpoints (MCP, A2A), and configuration stored on IPFS
- **Feedback system** - Users can leave feedback and ratings for agents
- **Protocol support** - Native support for MCP (Model Context Protocol) and A2A (Agent-to-Agent) endpoints

## Features

- 🔍 **Browse agents** - Paginated list with sorting and filtering
- 🔎 **Search** - Find agents by name
- 📋 **Agent details** - View full metadata, endpoints, statistics, and reviews
- 🏷️ **Protocol filtering** - Filter by MCP or A2A support
- 🌙 **Dark/Light mode** - Theme toggle

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 15** - App Router, Server Components
- **React 19** - Client components where needed
- **TypeScript** - Full type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **graphql-request** - Subgraph queries
- **The Graph** - Indexed blockchain data

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page with search
│   ├── agents/
│   │   ├── page.tsx          # Agent list with filters
│   │   └── [id]/page.tsx     # Agent detail page
│   └── api/
│       └── agents/
│           ├── route.ts      # List/search agents API
│           └── [id]/route.ts # Single agent API
├── components/
│   ├── ui/                   # shadcn components
│   ├── navbar.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── subgraph.handler.ts   # GraphQL queries & handlers
│   ├── format.ts             # Display formatters
│   └── utils.ts              # Tailwind utilities
└── types/
    └── agent.ts              # TypeScript interfaces
```

## Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  Next.js    │────▶│  The Graph  │
│  (React UI) │◀────│  API Routes │◀────│  Subgraph   │
└─────────────┘     └─────────────┘     └─────────────┘
```

1. UI components fetch from Next.js API routes
2. API routes call `subgraph.handler.ts` functions
3. Handler executes GraphQL queries against The Graph
4. Data flows back through the chain

## Key Files

| File | Purpose |
|------|---------|
| `lib/subgraph.handler.ts` | All GraphQL queries and data fetching |
| `types/agent.ts` | TypeScript interfaces matching subgraph schema |
| `lib/format.ts` | Address truncation, date formatting, protocol detection |

## Subgraph

This demo uses the ERC-8004 subgraph deployed on The Graph:

```
https://gateway.thegraph.com/api/{API_KEY}/subgraphs/id/6wQRC7geo9XYAhckfmfo8kbMRLeWU8KQd3XsJqFKmZLT
```

Currently indexing **Sepolia testnet**.

## Resources

Learn how to build and register on-chain agents:

| Resource | Description |
|----------|-------------|
| [ERC-8004 Spec](https://github.com/erc-8004/best-practices/blob/main/src/ERC8004SPEC.md) | Reference specification |
| [Registration Guide](https://github.com/erc-8004/best-practices/blob/main/Registration.md) | How to register agents with proper metadata |
| [Reputation Guide](https://github.com/erc-8004/best-practices/blob/main/Reputation.md) | Feedback system and reputation signals |
| [Agent0 SDK](https://sdk.ag0.xyz/) | SDK for building ERC-8004 agents |

## License

MIT
