Server Documentation

Overview
--------
This document explains the backend code structure, naming, responsibilities, and how each piece fits into the MVC (Model-View-Controller) pattern used in this project. It also covers business terminology, how to test routes (Postman examples), and troubleshooting notes.

High-level architecture (MVC)
-----------------------------
Although Node/Express apps don't map 1:1 to MVC like server-rendered frameworks, the project is organized so you can think in MVC terms:

- Models (Data layer)
  - Located in `server/models/`.
  - Defines Mongoose schemas and data validation rules for persisted entities (Users).
  - Example: `User.js` defines fields like `name`, `username`, `email`, `password`, and `role`.

- Views (Presentation layer)
  - In typical API servers, ``Views`` are the JSON responses sent to clients. There are no template views in this API.
  - The frontend project (in `front/`) serves the UI.

- Controllers (Application logic)
  - Located in `server/controllers/`.
  - Controllers receive HTTP requests, validate input, call services, and return JSON responses.
  - Example: `authController.js` handles registration, login, admin-created user creation, and logout.

- Services (Business logic)
  - Located in `server/services/`.
  - Encapsulates domain/business logic and database interactions. Controllers call services to perform actions.
  - Example: `authService.js` contains `createAdmin`, `adminCreateUser`, and `login` functions.

- Routes
  - Located in `server/routes/`.
  - Map HTTP endpoints to controller functions and middleware (authentication/authorization/validation).
  - Example: `routes/auth.js` maps `/api/auth/login`, `/api/auth/admin`, and `/api/auth/users`.

- Middleware
  - Located in `server/middleware/`.
  - Reusable logic executed before controllers: authentication (`auth.js`), request parsing (configured in `index.js`), and validators (`validators/auth.js`).

Key files and their responsibilities
------------------------------------
- `server/index.js`
  - App bootstrap: loads environment, connects to DB, applies global middleware (JSON body parsing, cookie parser, CORS), mounts routes, and starts listening.

- `server/config/database.js`
  - Connects to MongoDB using `mongoose.connect(process.env.MONGODB_URI, ...)`.

- `server/models/User.js`
  - Mongoose schema for `User`. Important fields:
    - `name` (String, required)
    - `username` (String, required, unique, lowercase)
    - `email` (String, required, unique, lowercase)
    - `password` (String, required)
    - `role` (String, enum: 'user', 'trainer', 'admin')
  - `pre('save')` hook hashes the password using bcrypt when it's created or changed.
  - Instance method `comparePassword` compares plaintext password vs. stored hash.

- `server/validators/auth.js`
  - Input validation for routes using `express-validator`. Exports `validateCreateAdmin`, `validateLogin`, and `validateAdminCreateUser` which check required fields and run `handleValidation` to return errors.

- `server/controllers/authController.js`
  - Controller functions for authentication flows:
    - `createAdmin(req, res)` - Validates input and calls `authService.createAdmin`.
    - `login(req, res)` - Validates credentials, calls `authService.login`, and sets cookie.
    - `adminCreateUser(req, res)` - Admin-only endpoint: validates input and calls `authService.adminCreateUser`.
    - `logout(req, res)` - Clears the cookie.
  - It uses `buildCookieOptions()` to set secure cookie options (depends on env vars).

- `server/services/authService.js`
  - Business logic and DB operations for auth-related flows.
  - `createAdmin` - normalizes username and email, checks uniqueness, creates User with role 'admin'.
  - `login` - finds user by email, compares password, and issues JWT token.
  - `adminCreateUser` - admin-only path to create users/trainers, checks unique username/email, creates user with provided role.

- `server/routes/auth.js`
  - Route definitions and middleware wiring.
  - POST `/admin` -> `validateCreateAdmin`, `createAdmin`
  - POST `/login` -> `validateLogin`, `login`
  - POST `/users` -> `authenticate`, `authorize('admin')`, `validateAdminCreateUser`, `adminCreateUser`

- `server/middleware/auth.js`
  - `authenticate(req, res, next)` reads token from `Authorization` header or cookie, verifies JWT, and attaches `req.user = { id, role }`.
  - `authorize(...allowedRoles)` checks `req.user.role` to allow only specific roles (e.g., 'admin').

Business terminology and mapping to code
---------------------------------------
- Admin: a user with `role: 'admin'` who can create other users (regular users or trainers).
- Trainer: a user with `role: 'trainer'` who might have additional permissions (not implemented here).
- User: a standard user with `role: 'user'`.
- Auth token / JWT: signed token containing user id and role. Used for authenticated requests.
- Cookie-based vs Bearer token: the server sets an HTTP-only cookie after login or the client can pass `Authorization: Bearer <token>`.

How a request flows (example: admin creates a user)
--------------------------------------------------
1. Client (Admin UI or Postman) sends POST `/api/auth/users` with body `{ name, username, email, password, role }`.
2. `routes/auth.js` applies middleware: `authenticate` (verifies JWT), `authorize('admin')` (ensures role), validation `validateAdminCreateUser`.
3. `authController.adminCreateUser` runs: `validationResult` checks, it calls `authService.adminCreateUser`.
4. `authService.adminCreateUser` normalizes username/email, checks uniqueness, creates a new `User` document (Mongoose), and returns the new user's public fields.
5. Controller returns 201 with created user data.

How to test using Postman
-------------------------
A. Create admin (only if you don't already have one in DB):
- POST http://localhost:5000/api/auth/admin
- Body (JSON):
  {
    "name": "Admin One",
    "username": "admin1",
    "email": "admin1@example.com",
    "password": "adminpass"
  }
- Expected: 201 and created admin data.

B. Login as admin:
- POST http://localhost:5000/api/auth/login
- Body (JSON): { "email": "admin1@example.com", "password": "adminpass" }
- Expected: 200 and cookie `token` set OR JSON containing token.
- If cookie is set: Postman cookie jar will store it; for other requests enable "Send cookies".
- If token returned in JSON: copy it and use Authorization: Bearer <token> header for next requests.

C. Admin creates a user (requires auth):
- POST http://localhost:5000/api/auth/users
- Headers: either cookie (automatic) or Authorization: Bearer <token>
- Body (JSON):
  {
    "name": "John Doe",
    "username": "johndoe_001",
    "email": "john001@example.com",
    "password": "12345678",
    "role": "user"
  }
- Expected: 201 and created user data; error 409 if email/username taken; 401/403 if auth/role missing/wrong.

Troubleshooting common errors
-----------------------------
- "Path `username` is required": means the `username` field was missing or empty in the created document. Ensure POST body includes a valid username and validation middleware runs.
- "Invalid credentials" on login: check that the email exists and passwords match. Remember password is hashed on save; send plaintext password when logging in.
- Cookie not sent/received: ensure CORS config (`credentials: true`) and client sends credentials. Browser clients must set `fetch(..., { credentials: 'include' })`.

Security notes
--------------
- Do not import plain passwords into DB. Always store bcrypt-hashed passwords.
- Use strong, unique JWT_SECRET in production.
- Cookie options: `secure: true` and `sameSite: 'None'` for cross-site cookies on HTTPS domains.

Next steps I can do for you
---------------------------
- Add an automated Node.js test script that: creates an admin, logs in, creates a user — and reports success/failure.
- Remove any unused files after you point out what you don't need.
- Add role-based permission checks beyond admin/trainer/user if you want fine-grained access control.

If you'd like the automated test script now, say "create the test script" and I'll add it to `server/tests/` and run a local check (requires your MongoDB URL in env).
