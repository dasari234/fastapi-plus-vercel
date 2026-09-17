from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # target your local environment file if applicable
        env_file=".env",
        env_file_encoding="utf-8",
        # Ignores empty env strings and uses the code-defined defaults below instead
        env_ignore_empty=True,
        # Safely ignores extra environment variables you aren't tracking
        extra="ignore",
    )

    PROJECT_NAME: str = "Vercel + FastAPI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"


# Initialize the settings
settings = Settings()
