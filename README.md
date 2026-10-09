# Personal Expense Manager

The repository is split by client so the API, web PWA, and mobile app can evolve independently:

```text
backend/   FastAPI, SQLAlchemy, PostgreSQL, Alembic
web/       React PWA
mobile/    Mobile client
docs/      Product and engineering documentation
```

The backend and initial web PWA scaffold are implemented. Mobile remains planned.

## Development

Run backend commands from `backend/`.

```bash
cd backend
uv sync
```

Set the database connection through the environment before running migrations. Do not commit credentials or `.env` files:

```bash
export DATABASE_URL='DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:5432/expense_manager_DB'
uv run alembic upgrade head
```

See [`backend/env.example`](backend/env.example) for the expected environment variable.

Run the API:

```bash
uv run uvicorn app.main:app --reload
```

Run Ruff and tests:

```bash
uv run ruff check .
uv run ruff format --check .
uv run pytest
```

Create a migration after changing models:

```bash
uv run alembic revision --autogenerate -m "describe change"
```

## Web frontend

The web client is a React + Vite + TypeScript frontend with an installable PWA
shell.


Start the frontend from `web/`:

```bash
cd web
pnpm install
pnpm dev
```

Open the Vite URL shown in the terminal. The auth UI and API integration will be
added in the next checkpoints.

Run frontend quality checks from `web/`:

```bash
pnpm lint
pnpm format:check
pnpm build
```
