# Calmoro ✨

A minimalist, aesthetic Pomodoro productivity web app designed for calm, distraction-free deep work.

---

## ✨ Features

- ⏱️ **Interactive Circular Timer**:
  - Smooth SVG circular progress ring for visual time tracking.
  - Three distinct modes: **Pomodoro** (Focus), **Short Break**, and **Long Break**.
  - **Quick inline adjustments**: Click directly on the timer to edit duration using a clean slider or manual numeric input.
  - High-precision delta-time interval tracking.

- 📋 **Integrated Task Management**:
  - Create, edit, and complete tasks directly inside the workspace.
  - Estimate and track Pomodoro sessions per task.
  - Link an active task to your current timer session with automatic counter increments.

- 📊 **Calendar & Productivity Analytics**:
  - Visual activity calendar and streak tracking to celebrate consistency.
  - Daily focus time metrics and completed session analytics.

- 🧘 **Zen / Focus Mode**:
  - Fullscreen distraction-free mode keeping only the essential timer visible.

- 🌓 **Cozy Ambient Themes**:
  - Thoughtfully designed Dark and Light aesthetics with cozy ambient artwork.
  - Easy one-click theme switcher with persistent settings.

- ⚙️ **Configurable Settings**:
  - Custom durations for Pomodoro, Short Break, and Long Break.
  - Auto-start options for breaks and focus intervals.
  - Configurable long break intervals and daily session targets.

- 🔒 **Privacy & Offline First**:
  - All tasks, preferences, and productivity statistics are stored safely in your browser via `localStorage`—no login or tracking required.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visualizations**: [Recharts](https://recharts.org/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/calmoro.git
   cd calmoro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` (or the port specified in terminal).

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server with hot module replacement |
| `npm run build` | Compiles TypeScript and creates optimized production bundle in `dist/` |
| `npm run preview` | Locally previews production build |

---

## 📂 Project Structure

```text
calmoro/
├── components/
│   ├── CalendarView.tsx      # Calendar history & productivity analytics
│   ├── CircularTimer.tsx     # SVG circular timer with inline time adjuster
│   ├── SettingsModal.tsx     # Session durations, auto-start & goal settings
│   └── TaskList.tsx          # Task management with Pomodoro session counts
├── src/
│   └── assets/               # Ambient cozy background images & graphics
├── App.tsx                   # Main application container & state management
├── constants.ts              # Default timer settings & inspirational quotes
├── types.ts                  # TypeScript interfaces & enums
├── index.html                # Entry HTML
├── index.tsx                 # React DOM root render
├── package.json              # Project dependencies & scripts
└── vite.config.ts            # Vite configuration
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
