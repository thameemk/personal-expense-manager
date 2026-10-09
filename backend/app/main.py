from importlib.metadata import version

from fastapi import FastAPI

from app.api.users import router as users_router

api_version = version("personal-expense-manager")

app = FastAPI(
    title="Personal Expense Manager API",
    version=api_version,
)
app.include_router(users_router)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}
