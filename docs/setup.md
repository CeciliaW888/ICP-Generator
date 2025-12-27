# Developer Setup Guide

## Prerequisites
- Node.js (v18 or higher recommended)
- A Google Cloud Project with Gemini API enabled.

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd blackwoods-icp-generator
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

## Environment Configuration

To use the real AI capabilities, you need an API Key.

1. Create a `.env` file in the root directory.
2. Add your Google Gemini API Key:
   ```env
   API_KEY=your_actual_api_key_here
   ```

> **Note:** If you do not provide an API Key, the app will automatically run in **Demo Mode**, serving mock data for "Mining", "Construction", and "Manufacturing".

## Running the App

1. **Start Development Server**
   ```bash
   npm run dev
   ```
2. Open your browser to `http://localhost:5173`.

## Building for Production

1. **Build Command**
   ```bash
   npm run build
   ```
2. **Preview Build**
   ```bash
   npm run preview
   ```

## Troubleshooting

- **"ReferenceError: process is not defined":** This is handled in `vite.config.ts` via the `define` property, which polyfills `process.env` for the browser environment.
- **Service Worker errors:** Ensure you are testing on `localhost` or `https`. Service Workers do not work on insecure `http` (except localhost).
