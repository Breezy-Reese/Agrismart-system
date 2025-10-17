# TODO: Fix 404 Error for /api/auth/login

## Steps to Complete
- [x] Update `frontend/vite.config.ts` to add a proxy for `/api` to `http://localhost:5000`
- [x] Update `frontend/src/services/api.js` to set `API_BASE_URL` to `http://localhost:5000/api`
- [x] Restart the frontend development server after changes
- [x] Ensure the backend is running on port 5000
- [x] Test the login functionality
