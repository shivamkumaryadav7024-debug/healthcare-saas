# HealthHub - B2B Healthcare SaaS Platform

A comprehensive React + TypeScript frontend application for managing healthcare services with patient management, analytics, and notifications.

## 🌟 Features

### Core Features
-  **Authentication**: Firebase-based login/signup with persistent sessions
-  **Dashboard**: Home page with key metrics and recent patients
-  **Patient Management**: 
  - Grid/List view toggle for patient data display
  - Detailed patient information view
  - Search and filter functionality
  - Responsive card-based and table layouts
-  **Analytics**: 
  - Revenue tracking and metrics
  - Gender distribution and trends
  - Department performance analysis
  - Monthly appointment trends
-  **Notifications**:
  - Service Worker integration
  - Push notifications support
  - Toast-like notification center
  - Multiple notification types (success, error, warning, info)

### Bonus Features
-  Clean folder structure for scalability
-  Responsive UI design (mobile, tablet, desktop)
-  Redux state management with Redux Toolkit
-  Protected routes and authentication
-  Reusable components
-  Mobile-first approach with Tailwind CSS
-  Offline support via Service Worker

##  Tech Stack

- **React** 18.3.1 - UI Framework
- **TypeScript** 5.3.3 - Type Safety
- **Redux Toolkit** 1.9.7 - State Management
- **React Router** 6.20.0 - Routing
- **Firebase** 10.7.0 - Authentication
- **Tailwind CSS** 3.4.1 - Styling
- **Vite** 5.0.8 - Build Tool

##  Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server (opens http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── store/         # Redux store
├── utils/         # Utility functions
└── main.tsx       # Entry file
```

## 🛠️ Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State Management
- **React Router** - Navigation
- **Firebase** - Authentication

## 📝 Features (To Build)

- Login functionality
- Dashboard
- Patient Management
- Analytics Page
- Notifications
- Responsive UI

## 🚀 Development

The development server runs on `http://localhost:5173`. Hot module replacement (HMR) is enabled automatically.

## 📦 Build

```bash
npm run build
```

Output is in the `dist/` folder.

## 📄 License

MIT
