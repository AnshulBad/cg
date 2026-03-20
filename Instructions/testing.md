
# Frontend Pre‑Push Sanity Checklist
1. Verify the app builds without warnings or errors.
2. Confirm the homepage renders properly on desktop and mobile widths.
3. Check console for errors, warnings, or failed network calls.
4. Validate all buttons, links, and inputs respond as expected.
5. Ensure form validations trigger and error messages display correctly.
6. Test at least one success and one failure API flow.
7. Confirm CSS/layout hasn't regressed on key components.
8. Check dark/light mode (if supported) for visual breaks.
9. Validate accessibility basics: focus states + keyboard navigation.
10. Run unit tests & ensure all pass before commit.



# Backend Pre‑Push Sanity Checklist
1. Ensure project builds without errors and dependencies are up to date.
2. Run all unit tests; verify zero failures and acceptable coverage.
3. Validate key API endpoints manually (success + failure paths).
4. Check logs for warnings, exceptions, or suspicious slow operations.
5. Confirm database migrations run cleanly on a fresh environment.
6. Validate configuration files (.env, secrets) are correct and not committed.
7. Test authentication/authorization flows for expected behavior.
8. Verify error handling returns correct status codes + messages.
9. Check service integrations (DB, cache, queues) for connectivity and retries.
10. Review code for SOLID compliance, clean structure, and no commented dead code.
