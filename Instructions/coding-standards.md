----------------------------------
1. GENERAL CODING PRINCIPLES
----------------------------------
• Follow SOLID, DRY, KISS, YAGNI.
• Write readable code that explains itself.
• Use consistent naming conventions across the repo.
• Avoid hardcoding values; use config/env files.
• Write unit tests for every module/function.
• Log meaningfully; avoid console.log in production.
• Handle all errors with proper fallbacks.
• Ensure code is linted and formatted before commit.

----------------------------------
2. JAVASCRIPT STANDARDS (Frontend & Shared)
----------------------------------
• Use ES6+ features: let/const, arrow functions, modules.
• Prefer const for immutability unless reassignment is needed.
• Use template literals over string concatenation.
• Avoid var completely.
• Enforce strict equality (===).
• Avoid deep nesting; extract functions early.
• Keep components/functions small and single-purpose.
• Use meaningful async/await instead of raw Promises.
• Validate all user inputs before using them.
• Follow a consistent folder structure for components/modules.

----------------------------------
3. NODE.JS BACKEND STANDARDS
----------------------------------
• Use module-based folder structure: controllers, services, routes, utils.
• Never block the event loop with heavy computation.
• Use async/await; wrap all awaits with try/catch.
• Validate API request payloads with a schema (Joi/Zod/Yup).
• Use environment variables for secrets; never commit them.
• Return proper HTTP status codes and structured JSON responses.
• Implement centralized error handling & logging.
• Keep controllers thin; move business logic to services.
• Avoid callback hell; break into reusable functions.
• Write integration tests for critical APIs.

----------------------------------
4. PYTHON CODING STANDARDS
----------------------------------
• Follow PEP8: 4-space indentation, 79-character lines.
• Use snake_case for variables/functions; PascalCase for classes.
• Write docstrings for modules, classes, functions.
• Avoid global variables; use constants in ALL_CAPS when needed.
• Prefer list comprehensions over loops when clean/readable.
• Use venv/virtualenv for dependencies.
• Use logging module instead of print().
• Type-hint all function parameters and return values.
• Use context managers (with statements) for file/DB handling.
• Maintain clean folder structure: core, services, routes, utils.

----------------------------------
5. TESTING STANDARDS
----------------------------------
• Follow test pyramid: more unit tests than integration tests.
• Each test should be independent and atomic.
• Mock external services (DB, cache, APIs).
• Use descriptive test names and Arrange-Act-Assert pattern.
• Ensure minimum acceptable coverage level set by project.

----------------------------------
6. GIT & REVIEW STANDARDS
----------------------------------
• Write meaningful commit messages (imperative tone).
• No commented code or unused imports before pushing.
• PR must contain: description, test evidence, and impact.
• Code should pass lint/format checks automatically.
• Review others' code with empathy and clarity.

----------------------------------
7. SECURITY STANDARDS
----------------------------------
• Never log secrets or PII.
• Sanitize and validate all inputs on backend.
• Escape output on frontend to prevent XSS.
• Use HTTPS-only cookies and proper JWT handling.
• Regularly update dependencies and check vulnerabilities.

----------------------------------
8. PERFORMANCE STANDARDS
----------------------------------
• Avoid unnecessary loops and heavy computations.
• Cache expensive operations where appropriate.
• Optimize DB queries; avoid N+1 patterns.
• Use pagination for large payload APIs.