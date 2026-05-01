# AI Hormone Wellness Coach

This is a Flask-based authentication app with registration, login, session handling, and a dashboard.

## Run locally

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the app:
   ```bash
   python app.py
   ```
3. Open http://127.0.0.1:5000

## Deploy

- Heroku / Render / any WSGI host can use `Procfile`.
- The app supports `PORT`, `SECRET_KEY`, and `DATABASE_URL` environment variables.
- Default database is `sqlite:///instance/hormone_ai.db` if `DATABASE_URL` is not set.
- For PostgreSQL use a URL like `postgresql://user:pass@host:port/dbname`.
