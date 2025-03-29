# Skopje Tourism Guide
AI-powered tourism guide for Skopje, Macedonia.

## Quick Start

### Backend (Spring Boot)
1. Open `/backend/skopje-tourism-guide` in IntelliJ IDEA
2. Run `SkopjeTourismGuideApplication.java`
3. Server runs on http://localhost:8080

### Frontend (React)
1. Open `/frontend` in terminal or VS Code
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Frontend runs on http://localhost:5173


## Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Java Spring Boot

## Custom Styling
- Colors: Sky Blue (#4FC3F7), Light Blue (#8AD4F7), etc. defined in tailwind.config.js
- Fonts: Inter, Poppins, Montserrat

## Project Structure
- Monorepo with `/frontend` and `/backend/skopje-tourism-guide` folders
- Backend API endpoint: http://localhost:8080/api/test
- Frontend API service: `src/services/api.ts`

## Troubleshooting
- CORS issues: Check WebConfig.java and CORS settings
- Database issues: Check application.properties


## Core Features
- Personalized tours based on user preferences
- Place discovery and reviews
- Sentiment analysis
- AI-generated recommendations