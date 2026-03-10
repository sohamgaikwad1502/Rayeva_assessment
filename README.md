# Rayeva AI Backend

**AI-powered backend modules for a sustainability-focused commerce platform.**

Rayeva automates business workflows using AI — from product cataloging to B2B procurement — for eco-friendly products like compostable packaging, recycled goods, and biodegradable materials.

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Modules Overview](#modules-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [API Documentation](#api-documentation)
- [Prompt Design](#prompt-design)
- [Data Flow](#data-flow)
- [Database Models](#database-models)
- [Logging](#logging)
- [Architecture-Only Modules](#architecture-only-modules)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client / API Consumer                    │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP
┌──────────────────────────────▼──────────────────────────────────┐
│                        Express.js API Layer                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Routes → Validation (Joi) → Controllers                │    │
│  └───────────────────────────┬─────────────────────────────┘    │
└──────────────────────────────┼──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    Business Logic Services                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Orchestrates AI calls, validates output, handles DB     │   │
│  └─────────────┬──────────────────────────┬─────────────────┘   │
└────────────────┼──────────────────────────┼─────────────────────┘
                 │                          │
    ┌────────────▼────────────┐  ┌──────────▼──────────┐
    │    AI Services Layer    │  │   MongoDB (Mongoose) │
    │  ┌──────────────────┐   │  │  ┌────────────────┐  │
    │  │  OpenAI API Call  │   │  │  │ ProductMetadata│  │
    │  │  Prompt Building  │   │  │  │ B2BProposal    │  │
    │  │  Output Parsing   │   │  │  │ AIInteraction  │  │
    │  └──────────────────┘   │  │  │ Log            │  │
    └─────────────────────────┘  │  └────────────────┘  │
                                 └──────────────────────┘
```

### Key Architecture Rule

**AI services NEVER directly interact with the database.** The flow is:

```
API → Business Logic → AI Service → Structured Output → Business Logic → Database
```

---

## Modules Overview

| # | Module | Status | Description |
|---|--------|--------|-------------|
| 1 | **AI Auto-Category & Tag Generator** | ✅ Implemented | Auto-categorize products, generate SEO tags & sustainability filters |
| 2 | **AI B2B Proposal Generator** | ✅ Implemented | Generate sustainable procurement proposals for companies |
| 3 | **AI Impact Reporting Generator** | 📐 Architecture | Estimate sustainability impact per order |
| 4 | **AI WhatsApp Support Bot** | 📐 Architecture | Automate customer support via WhatsApp |

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| AI | OpenAI API (GPT-4o-mini) |
| Validation | Joi |
| Logging | Winston |
| Environment | dotenv |
| Security | Helmet, CORS |

---

## Project Structure

```
src/
├── api/
│   ├── controllers/
│   │   ├── categoryGeneratorController.js   # Module 1 controller
│   │   ├── b2bProposalController.js         # Module 2 controller
│   │   ├── impactReportController.js        # Module 3 (architecture)
│   │   └── supportBotController.js          # Module 4 (architecture)
│   └── routes/
│       ├── categoryGeneratorRoutes.js
│       ├── b2bProposalRoutes.js
│       ├── impactReportRoutes.js
│       └── supportBotRoutes.js
├── services/
│   ├── ai_services/
│   │   ├── BaseAIService.js                 # Shared OpenAI wrapper
│   │   ├── CategoryGeneratorAIService.js    # Module 1 AI logic
│   │   └── B2BProposalAIService.js          # Module 2 AI logic
│   └── business_logic/
│       ├── CategoryGeneratorService.js      # Module 1 orchestration
│       └── B2BProposalService.js            # Module 2 orchestration
├── models/
│   └── database_models/
│       ├── ProductMetadata.js               # Module 1 schema
│       ├── B2BProposal.js                   # Module 2 schema
│       ├── AIInteractionLog.js              # Shared logging schema
│       ├── ImpactReport.js                  # Module 3 schema
│       └── ConversationLog.js               # Module 4 schema
├── prompts/
│   └── prompt_templates/
│       ├── categoryGeneratorPrompt.js       # Module 1 prompts
│       ├── b2bProposalPrompt.js             # Module 2 prompts
│       ├── impactReportPrompt.js            # Module 3 prompts
│       └── supportBotPrompt.js              # Module 4 prompts
├── utils/
│   ├── logger.js                            # Winston logger
│   ├── validators/
│   │   └── index.js                         # Joi schemas + middleware
│   └── error_handlers/
│       ├── AppError.js                      # Custom error classes
│       ├── errorHandler.js                  # Global error middleware
│       └── index.js
├── config/
│   ├── environment/
│   │   └── index.js                         # Config loader
│   └── database.js                          # MongoDB connection
├── logs/
│   └── ai_logs/                             # AI interaction logs
└── app.js                                   # Express app entry point
```

---

## Setup & Installation

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally (or a MongoDB Atlas URI)
- OpenAI API key

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd rayeva_Assessment

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your OpenAI API key and MongoDB URI

# 4. Start the server
npm start

# Or with auto-reload (development)
npm run dev
```

The server starts at `http://localhost:3000`.

---

## API Documentation

### Health Check

```
GET /health
```

### API Index

```
GET /api
```

---

### Module 1: AI Auto-Category & Tag Generator

#### Generate Product Metadata

```
POST /ai/category-generator
Content-Type: application/json

{
  "product_name": "Compostable Food Container",
  "description": "Eco friendly container made from plant fiber",
  "material": "Plant fiber",
  "usage": "Food packaging",
  "brand": "EcoPack"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "product_id": "uuid",
    "product_name": "Compostable Food Container",
    "primary_category": "Packaging",
    "sub_category": "Compostable Food Containers",
    "seo_tags": [
      "eco friendly packaging",
      "compostable containers",
      "plastic free packaging",
      "sustainable packaging",
      "biodegradable packaging"
    ],
    "sustainability_filters": [
      "compostable",
      "plastic-free",
      "biodegradable"
    ],
    "created_at": "2026-03-11T..."
  }
}
```

#### List Products

```
GET /ai/category-generator/products?page=1&limit=20&category=Packaging
```

#### Get Product by ID

```
GET /ai/category-generator/products/:id
```

---

### Module 2: AI B2B Proposal Generator

#### Generate Proposal

```
POST /ai/b2b-proposal
Content-Type: application/json

{
  "company_name": "GreenCafe",
  "industry": "Food Service",
  "budget": 5000,
  "sustainability_goals": "Reduce plastic waste in packaging",
  "required_products": ["food packaging", "cutlery", "carry bags"]
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "proposal_id": "uuid",
    "company_name": "GreenCafe",
    "industry": "Food Service",
    "budget": 5000,
    "recommended_products": [
      "compostable containers",
      "bamboo cutlery",
      "recycled paper bags"
    ],
    "budget_allocation": {
      "containers": 2500,
      "cutlery": 1500,
      "bags": 1000
    },
    "cost_breakdown": {
      "containers_unit_cost": 0.25,
      "cutlery_unit_cost": 0.10,
      "bags_unit_cost": 0.05
    },
    "impact_summary": "This proposal helps reduce plastic waste while promoting sustainable sourcing.",
    "created_at": "2026-03-11T..."
  }
}
```

#### List Proposals

```
GET /ai/b2b-proposal/proposals?page=1&limit=20&company=GreenCafe
```

#### Get Proposal by ID

```
GET /ai/b2b-proposal/proposals/:id
```

---

### Module 3: AI Impact Report (Architecture Only)

```
POST /ai/impact-report     → Returns 501 with architecture documentation
GET  /ai/impact-report/:id → Returns 501 with architecture documentation
```

### Module 4: AI WhatsApp Support Bot (Architecture Only)

```
POST /ai/support-bot                   → Returns 501 with architecture documentation
GET  /ai/support-bot/conversations/:id → Returns 501 with architecture documentation
```

---

## Prompt Design

### Philosophy

Each module uses a **two-part prompt structure**:

1. **System Prompt** — Defines the AI's role, rules, valid enumerations, and exact JSON output format
2. **User Prompt** — Injects the specific business data for the request

### Category Generator (Module 1)

- System prompt constrains primary categories to 6 valid options
- Sustainability filters constrained to 7 valid values
- SEO tags must be lowercase, 5–10 items
- Output validation post-AI ensures conformance (falls back to defaults if AI deviates)

### B2B Proposal Generator (Module 2)

- System prompt includes Rayeva's full product catalog context
- Budget allocation must sum to total budget (validated post-AI with 5% tolerance)
- Unit costs must be realistic numbers
- Impact summary must be actionable and compelling

### Common Patterns

- `response_format: { type: 'json_object' }` enforces JSON output from OpenAI
- `temperature: 0.4` balances creativity with consistency
- Post-AI validation catches and corrects any schema deviations
- All prompts and responses are logged to `AIInteractionLog`

---

## Data Flow

```
Client Request
     │
     ▼
Express Route (validation middleware)
     │
     ▼
Controller (thin layer, delegates to service)
     │
     ▼
Business Logic Service
     │
     ├──► AI Service (builds prompt → calls OpenAI → parses JSON)
     │       │
     │       ▼
     │    Structured AI Output (validated)
     │
     ├──► Save AI Interaction Log (prompt + response + status)
     │
     ├──► Save Domain Record (ProductMetadata / B2BProposal)
     │
     ▼
Response to Client
```

---

## Database Models

### ProductMetadata (Module 1)

| Field | Type | Description |
|-------|------|-------------|
| product_id | String (UUID) | Unique identifier |
| product_name | String | Input product name |
| primary_category | Enum | One of 6 categories |
| sub_category | String | AI-generated sub-category |
| seo_tags | [String] | 5–10 SEO keywords |
| sustainability_filters | [String] | Validated filter tags |
| created_at | Date | Auto-generated |

### B2BProposal (Module 2)

| Field | Type | Description |
|-------|------|-------------|
| proposal_id | String (UUID) | Unique identifier |
| company_name | String | Client company |
| budget | Number | Total budget |
| recommended_products | [String] | AI-suggested products |
| budget_allocation | Object | Budget per category |
| cost_breakdown | Object | Unit costs per category |
| impact_summary | String | Sustainability impact statement |
| created_at | Date | Auto-generated |

### AIInteractionLog (Shared)

| Field | Type | Description |
|-------|------|-------------|
| timestamp | Date | When the interaction occurred |
| module_name | Enum | Which module triggered it |
| prompt | String | Full prompt sent to AI |
| response | String | Raw AI response |
| status | Enum | success / error / pending |
| error | String | Error message if failed |
| latency_ms | Number | Response time in ms |

---

## Logging

The system uses **Winston** for structured logging:

- **Console** — Colorized output for development
- **app.log** — All application logs
- **error.log** — Errors only
- **ai_logs/ai_interactions.log** — AI-specific interactions

All AI interactions are also persisted to the `AIInteractionLog` MongoDB collection for audit and debugging.

---

## Architecture-Only Modules

### Module 3: Impact Reporting Generator

**Purpose:** Generate sustainability impact reports per order.

**Designed flow:**
1. Receive order data (products, quantities, materials)
2. AI estimates plastic saved using baselines (30g/container, 15g/bag, etc.)
3. Calculate carbon emissions avoided (2.5kg CO₂ per 1kg plastic saved)
4. Generate human-readable impact statement
5. Save `ImpactReport` to database

**Database model:** `ImpactReport` (report_id, order_id, plastic_saved_kg, carbon_avoided_kg, impact_statement)

### Module 4: WhatsApp Support Bot

**Purpose:** Automate customer support via WhatsApp.

**Designed flow:**
1. Receive customer message via WhatsApp webhook
2. AI classifies intent (order_status, return_policy, complaint, etc.)
3. AI generates contextual response using embedded policy knowledge
4. High-priority issues (refund, damage) auto-escalate to human agents
5. Full conversation history stored in `ConversationLog`

**Integration options:** WhatsApp Business API, Twilio API, Meta Cloud API

**Database model:** `ConversationLog` (conversation_id, user_phone, messages[], intent, escalated)

---

## Error Handling

- **Joi validation** catches malformed requests (400)
- **Custom error classes** (ValidationError, AIServiceError, NotFoundError, DatabaseError)
- **Global error handler** middleware catches all unhandled errors
- **AI output validation** post-processes AI responses to ensure schema conformance
- Errors are logged with full context (path, method, stack trace in development)

---

## License

ISC
