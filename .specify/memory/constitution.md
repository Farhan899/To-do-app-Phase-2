<!--
SYNC IMPACT REPORT
==================
Version: 1.0.0 → 1.0.0 (Initial constitution creation)
Date: 2025-12-28

Changes:
- Initial constitution created from project specifications
- Added 8 core principles covering architecture, security, code quality, testing, data management, development workflow, observability, and simplicity
- Added Technology Stack section defining strict requirements
- Added Development Workflow section with execution phases
- Added Governance rules with versioning policy

Principles Added:
1. Decoupled Architecture - Frontend/Backend separation with stateless API
2. Security First - JWT authentication and authorization enforcement
3. Code Quality Standards - Type safety, async operations, error handling
4. Test-Driven Development - TDD mandatory for all features
5. Data Integrity - Database schema and migration management
6. Development Workflow - Phased implementation approach
7. Observability - Logging, monitoring, and debugging requirements
8. Simplicity & YAGNI - Start simple, avoid over-engineering

Templates Status:
✅ spec-template.md - Compatible (supports user stories, requirements, success criteria)
✅ plan-template.md - Compatible (supports Constitution Check, technical context)
✅ tasks-template.md - Compatible (supports phased approach, parallel execution)
⚠️  Command files - Manual review recommended for agent-specific guidance

Deferred Items: None
-->

# Neon-FastAPI-Next-Todo Constitution

## Core Principles

### I. Decoupled Architecture

The application MUST maintain strict separation between frontend and backend concerns:

- **Frontend (Next.js)**: Handles UI rendering, user interactions, and authentication token generation via Better Auth
- **Backend (FastAPI)**: Provides stateless REST API with JWT verification and data persistence
- **Communication Protocol**: All requests use REST with JWT bearer tokens in Authorization header
- **No Backend Sessions**: The API is completely stateless; all user context derived from JWT claims

**Rationale**: Decoupled architecture enables independent scaling, technology updates, and parallel development. Stateless API design simplifies horizontal scaling and deployment.

### II. Security First

All security requirements are NON-NEGOTIABLE:

- **Shared Secret**: `BETTER_AUTH_SECRET` MUST be identical in both Next.js and FastAPI environments
- **JWT Verification**: Backend MUST decode and validate every request token using HS256 algorithm
- **User Isolation**: Backend MUST extract `sub` (User ID) from JWT and compare against URL `{user_id}` parameter
- **Authorization Enforcement**: Return 403 Forbidden if token user_id ≠ URL user_id; return 401 Unauthorized if token invalid
- **API Endpoint Structure**: All endpoints MUST use `/api/{user_id}/...` pattern to enforce per-user isolation
- **No Secrets in Code**: All sensitive values (DATABASE_URL, BETTER_AUTH_SECRET) MUST use environment variables

**Rationale**: Multi-user applications require strict user isolation. JWT verification at the API layer ensures no user can access another user's data, even with a valid token.

### III. Code Quality Standards

All code MUST meet these quality requirements:

**Backend (Python/FastAPI)**:
- **Type Hints**: Strict Python type hints required for all functions, parameters, and return values
- **Async Operations**: All database operations MUST be async (async/await pattern)
- **Pydantic Models**: All request/response schemas MUST use Pydantic models for validation
- **Error Handling**: Raise HTTPException with clear detail messages (404 for Not Found, 401/403 for auth errors)
- **Import Organization**: Standard library → Third-party → Local imports with blank line separation

**Frontend (Next.js/TypeScript)**:
- **TypeScript Strict Mode**: No implicit any; all types explicitly defined
- **Component Separation**: Server Components for static content, Client Components ("use client") for interactive UI
- **API Abstraction**: Dedicated API client helper (lib/api.ts) that automatically injects JWT tokens
- **Error Boundaries**: Graceful error handling with user-friendly messages

**Rationale**: Type safety prevents runtime errors and improves maintainability. Consistent patterns reduce cognitive load and enable faster code reviews.

### IV. Test-Driven Development (NON-NEGOTIABLE)

TDD methodology MUST be followed for all feature development:

- **Red Phase**: Write tests that define expected behavior → Tests MUST fail initially
- **Green Phase**: Implement minimal code to make tests pass
- **Refactor Phase**: Improve code quality while keeping tests green
- **Test Categories**:
  - **Unit Tests**: Test individual functions and classes in isolation
  - **Integration Tests**: Test API endpoints with database interactions
  - **Contract Tests**: Verify API request/response schemas match specifications

**Rationale**: TDD ensures code meets requirements before implementation begins, reduces debugging time, and provides living documentation of system behavior.

### V. Data Integrity

Database operations MUST follow these principles:

**Schema (SQLModel)**:
- **Todos Table**: id (UUID/Integer PK), user_id (String, Indexed), title (String), description (String, Optional), is_completed (Boolean, Default: False), created_at (DateTime), updated_at (DateTime)
- **Migrations**: All schema changes MUST use migration scripts (never direct DDL in application code)
- **Indexing**: user_id MUST be indexed for query performance
- **Timestamps**: created_at/updated_at MUST be automatically managed

**Data Operations**:
- **Isolation**: All queries MUST filter by user_id from JWT to prevent cross-user data leakage
- **Transactions**: Multi-step operations MUST use database transactions for atomicity
- **Validation**: SQLModel field validators MUST enforce constraints (e.g., title length, email format)

**Rationale**: Data integrity ensures system reliability and user trust. Automatic timestamp management provides audit trails. Indexing user_id optimizes multi-tenant query performance.

### VI. Development Workflow

Implementation MUST follow this phased approach:

**Phase 1: Database Setup**
- Initialize Neon PostgreSQL project
- Configure DATABASE_URL in environment
- Create SQLModel tables and migrations

**Phase 2: Backend Core**
- Setup FastAPI application with CORS configuration
- Implement JWT verification dependency using python-jose or pyjwt
- Create shared BETTER_AUTH_SECRET environment variable

**Phase 3: Backend CRUD**
- Implement all 6 API endpoints (GET list, POST create, GET detail, PUT update, DELETE, PATCH toggle)
- Add request/response Pydantic models
- Implement user_id authorization checks

**Phase 4: Frontend Setup**
- Initialize Next.js project with App Router
- Configure Better Auth with JWT Plugin
- Setup BETTER_AUTH_SECRET environment variable

**Phase 5: Frontend Integration**
- Build Task Dashboard with Client Components
- Create API client helper with token injection
- Connect UI to FastAPI endpoints
- Implement responsive design with Tailwind CSS

**Rationale**: Phased approach reduces integration risks and enables early testing of each layer before building dependent layers.

### VII. Observability

Monitoring and debugging capabilities are mandatory:

- **Structured Logging**: All errors, authentication failures, and data mutations MUST be logged with structured context (user_id, endpoint, timestamp)
- **Request Tracing**: Include request IDs in logs to trace requests across frontend/backend
- **Error Messages**: User-facing errors MUST be sanitized (no stack traces, SQL errors, or internal details exposed)
- **Developer Errors**: Internal logs MUST include full error context for debugging
- **Performance Metrics**: Log slow queries (>100ms) and API response times

**Rationale**: Observability enables rapid issue diagnosis in production. Structured logs support automated alerting and analysis.

### VIII. Simplicity & YAGNI

Start with the simplest solution that meets requirements:

- **No Premature Optimization**: Optimize only when performance issues are measured
- **No Unused Features**: Build only what the specification requires
- **No Unnecessary Abstractions**: Avoid repository patterns, service layers, or factories unless complexity justifies them
- **Direct Dependencies**: Use well-maintained libraries (FastAPI, SQLModel, Better Auth) rather than custom implementations
- **Mobile-First UI**: Start with responsive mobile design; desktop is an enhancement

**Rationale**: Simplicity reduces maintenance burden, speeds development, and minimizes bugs. YAGNI (You Aren't Gonna Need It) prevents wasted effort on speculative features.

## Technology Stack (Strict)

These technology choices are mandatory and MUST NOT be substituted:

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend Framework | Next.js | 16+ | UI rendering, routing, SSR |
| Frontend Language | TypeScript | Latest | Type safety |
| Frontend Styling | Tailwind CSS | Latest | Responsive design |
| Frontend Auth | Better Auth | Latest | JWT token generation |
| Backend Framework | FastAPI | Latest | Async REST API |
| Backend Language | Python | 3.11+ | Application logic |
| ORM | SQLModel | Latest | Type-safe database models |
| Database | Neon PostgreSQL | Serverless | Data persistence |
| Auth Method | JWT (HS256) | N/A | Stateless authentication |
| Development Tool | Claude Code + Spec-Kit Plus | Latest | AI-assisted development |

**CORS Configuration**: Backend MUST allow requests only from the Next.js frontend origin (configured via environment variable `FRONTEND_URL`).

## Development Workflow

### API Contract (REST)

All endpoints follow the pattern `/api/{user_id}/...` for user isolation:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/{user_id}/tasks | List all tasks for user | Yes |
| POST | /api/{user_id}/tasks | Create new task | Yes |
| GET | /api/{user_id}/tasks/{id} | Get task details | Yes |
| PUT | /api/{user_id}/tasks/{id} | Update task | Yes |
| DELETE | /api/{user_id}/tasks/{id} | Delete task | Yes |
| PATCH | /api/{user_id}/tasks/{id}/complete | Toggle completion | Yes |

**Request/Response Standards**:
- All requests: `Content-Type: application/json`, `Authorization: Bearer <token>`
- Success responses: 200 (OK), 201 (Created), 204 (No Content)
- Error responses: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Server Error)
- Error body format: `{"detail": "Human-readable error message"}`

### Implementation Rules

**Frontend (Next.js)**:
- Use Server Components for static layouts and initial data fetching
- Use Client Components (`"use client"`) for interactive UI (Task Dashboard)
- Create `lib/api.ts` helper that automatically injects JWT from Better Auth session
- Responsive design: Mobile-first with Tailwind CSS breakpoints (sm, md, lg, xl)

**Backend (FastAPI)**:
- All database operations MUST be async (async def, await)
- All request/response bodies MUST use Pydantic models
- All endpoints MUST use JWT verification dependency
- CORS MUST restrict to frontend origin only
- HTTPException MUST include clear detail messages

## Governance

**Constitution Authority**: This constitution supersedes all other development practices, coding standards, and architectural decisions unless explicitly amended.

**Amendment Process**:
1. Proposed changes MUST be documented with rationale and impact analysis
2. Changes MUST be approved before implementation
3. Migration plan required for changes affecting existing code
4. Version MUST be updated following semantic versioning

**Compliance Review**:
- All pull requests MUST verify compliance with security principles (II)
- All new features MUST follow TDD methodology (IV)
- All code MUST pass type checking (III)
- Constitution violations MUST be justified in plan.md Complexity Tracking section

**Versioning Policy**:
- **MAJOR** (X.0.0): Backward-incompatible principle changes, removed requirements
- **MINOR** (0.X.0): New principles added, expanded guidance
- **PATCH** (0.0.X): Clarifications, typo fixes, non-semantic changes

**Runtime Guidance**: See `CLAUDE.md` for agent-specific development instructions, PHR creation, and ADR workflows.

---

**Version**: 1.0.0 | **Ratified**: 2025-12-28 | **Last Amended**: 2025-12-28
