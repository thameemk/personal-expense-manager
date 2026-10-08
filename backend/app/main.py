from importlib.metadata import version

from fastapi import FastAPI

api_version = version("personal-expense-manager")

app = FastAPI(
    title="Personal Expense Manager API",
    version=api_version,
)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}
