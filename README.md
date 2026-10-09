# Daymark

Daymark is a personal productivity workspace for keeping the day visible and manageable. It brings tasks, habits, schedule items, and focus planning into one calm dashboard, with a lightweight interface that stays out of the way.

Built by **YoichiDev-tech** as a frontend product concept. The included tasks, clients, schedule entries, and habit streaks are sample data for demonstration.

## What’s inside

- Daily dashboard with task and schedule views
- Task and project organization with priority and completion states
- Habit tracking and streak indicators
- Workspace and focus-setting controls
- Light/dark theme preference
- Search and navigation UI
- Browser-backed state for selected preferences and app data

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Lucide React
- Oxlint

## Get started

**Requirements:** Node.js compatible with the installed Vite version and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Preview the production build |

## Project structure

```text
src/
├── components/   # Dashboard and workspace UI
├── lib/          # Browser storage helpers
├── types/        # Shared TypeScript models
├── App.tsx       # App state and main application shell
├── App.css       # Component and layout styles
└── main.tsx      # React entry point
```

## Current scope

Daymark is currently a frontend prototype. It uses example content and browser-local persistence; it is not connected to a remote account system or shared team database. Treat the sample client names and schedule entries as placeholders, not real records.

## Design intent

Daymark favors a clear daily overview over a crowded project-management interface. Tasks, habits, and scheduled work are grouped so it is easier to decide what deserves attention next.

## License

No license has been declared for this repository yet. Contact the repository owner before reusing or redistributing the code.
