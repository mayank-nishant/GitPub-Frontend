# Frontend Testing Checklist

1. Install dependencies

```bash
cd frontend
npm install
```

2. Start dev server

```bash
npm run dev
```

Default Vite port is `5173` (visit http://localhost:5173). If port differs, check terminal.

3. Sanity checks

- Open `/` — app should show Navbar and search input at top.
- Search: type repository names or owners into the search box. Dropdown should appear.
  - Use ArrowDown/ArrowUp/Home/End to navigate, Enter to open selected repo.
  - Click outside dropdown to close it.
  - Press `/` anywhere to focus the search input quickly.
  - Screen readers should hear announcements of the number of results as you type.
- Navigate to `Repositories` (Navbar) — list should show skeletons while loading then repo cards.
- Click a repo to open `/repo/:id` and see repo detail (skeleton while loading).
- Open an issue from repo route `/repos/:id/issues` (or `Issues` link) and view issue detail.

4. API checks

- Ensure backend is running on `http://localhost:3000` with required env vars:

  - `MONGODB_URI`
  - `JWT_SECRET_KEY`

- Signup/login flows should store `userId` and `token` in `localStorage`.

5. Accessibility checks

- Search dropdown supports keyboard navigation and announces results.
- Focus styles visible on interactive elements.

6. Notes

- I did not commit changes; review locally and commit when ready.
- If dev server fails to start in this environment, run the commands above locally in your terminal (Git Bash / WSL / PowerShell).
