# Known Limitations

This file is used for documenting non-goal items and assumptions that may affect deployment or behavior.

Current notes (may be outdated as the project evolves):
- Server CORS configuration is currently permissive by default (`cors()` without explicit origin).
- Client uses relative API calls (`/api`) with Vite dev proxy; `VITE_API_URL` is documented for deployments but may not be used by runtime code.
- Production hardening (logging/observability, CI checks) may be incomplete.

