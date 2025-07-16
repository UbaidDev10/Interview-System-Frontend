# Interview System Frontend

A modern, responsive frontend for the Interview System, built with React and Vite. This application provides a seamless interface for job applicants, interviewers, and administrators to manage job postings, applications, interviews, and more.

## Features

- User registration and login
- Job listings and detailed job views
- Resume upload and preview
- Application management for users and admins
- Interview scheduling and management
- Real-time interview chat and transcript
- Admin dashboard with statistics and controls
- Responsive UI with reusable components

## Tech Stack

- **Framework:** React
- **Build Tool:** Vite
- **State Management:** React Context, Hooks
- **Styling:** CSS Modules / Custom CSS
- **API Communication:** Fetch/Axios (via `src/api/`)
- **Linting:** ESLint

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm (v8+ recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Interview-System-Frontend.git
   cd Interview-System-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) to view the app.

### Build for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
  api/           # API service modules
  assets/        # Static assets (images, SVGs, etc.)
  components/    # Reusable UI and feature components
    admin/       # Admin-specific components
    ui/          # Generic UI components (buttons, modals, etc.)
    user/        # User-facing components
  context/       # React context providers
  hooks/         # Custom React hooks
  lib/           # Utility libraries
  pages/         # Page-level components (routes)
  utils/         # Utility functions
  index.css      # Global styles
  main.jsx       # App entry point
```
