# APM JSON Server

This repository packages [`json-server`](https://github.com/typicode/json-server) with a small Express wrapper so it can be
easily deployed (for example to Vercel). In addition to the appointment data exposed by the JSON router, the server now
provides a very small login demonstration that verifies incoming passwords using an MD5 hash.

> **Note:** MD5 is not suitable for production password storage or verification. It is used here solely because the
> exercise explicitly requests it.

## Available data

`db.json` ships with two collections:

- `apm`: appointment slots that remain available through the standard JSON Server router.
- `users`: contains demo credentials with pre-computed MD5 password hashes used by the login endpoint.

## Login endpoint

`POST /login`

Request body:

```json
{
  "username": "demo",
  "password": "123"
}
```

Response on success:

```json
{
  "message": "Login successful"
}
```

The handler looks up the requested user in `db.json`, hashes the submitted password with MD5, and compares it against the
stored hash. A `401` response is returned when the credentials do not match, and a `400` response is returned when either
field is missing.

Because the server uses the JSON Router for other resources, you can still access the appointment data at `/apm` or via
the `/api` namespace that Vercel expects (for example, `GET /api/apm`).

## Running locally

```bash
pnpm install
pnpm start
```

The server listens on port `3000` by default.
