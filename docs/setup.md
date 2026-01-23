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

## Deployment to Google Cloud Run

This guide outlines how to deploy the ICP Generator application to Google Cloud Run. This assumes you have the `gcloud` CLI installed and authenticated.

### Prerequisites

*   A Google Cloud Project with Billing Enabled.
*   The following Google Cloud APIs enabled:
    *   Cloud Run API (`run.googleapis.com`)
    *   Artifact Registry API (`artifactregistry.googleapis.com`)
    *   Cloud Build API (`cloudbuild.googleapis.com`)
*   Your Google Gemini API Key.

### Steps

### Steps

1.  **Enable Google Cloud Services**
    Ensure the necessary APIs are enabled for your project.
    ```bash
    gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --project=[YOUR_PROJECT_ID]
    ```

2.  **Create an Artifact Registry Repository**
    This repository will store your Docker container image.
    ```bash
    gcloud artifacts repositories create icp-generator-repo --repository-format=docker --location=[YOUR_REGION] --project=[YOUR_PROJECT_ID]
    ```

3.  **Create `cloudbuild.yaml`**
    Create `cloudbuild.yaml` in the root directory. **CRITICAL:** Ensure the `push` step is present to avoid deploying old images.
    ```yaml
    steps:
    - name: 'gcr.io/cloud-builders/docker'
      args: [ 'build', '-t', 'gcr.io/[YOUR_PROJECT_ID]/icp-generator-repo/icp-generator', '--build-arg', 'VITE_API_KEY=$_VITE_API_KEY', '.' ]
    - name: 'gcr.io/cloud-builders/docker'
      args: [ 'push', 'gcr.io/[YOUR_PROJECT_ID]/icp-generator-repo/icp-generator' ]
    - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
      entrypoint: gcloud
      args:
      - 'run'
      - 'deploy'
      - 'customer-profile-app'
      - '--image'
      - 'gcr.io/[YOUR_PROJECT_ID]/icp-generator-repo/icp-generator'
      - '--region'
      - 'us-west1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
    images:
    - 'gcr.io/[YOUR_PROJECT_ID]/icp-generator-repo/icp-generator'
    substitutions:
      _VITE_API_KEY: ''
    ```

4.  **Local Verification (Highly Recommended)**
    Before deploying, create a temporary script `verify-local-api.js` to ensure your API Key works with the Google Gen AI SDK.
    ```javascript
    import { GoogleGenAI } from "@google/genai";
    const ai = new GoogleGenAI({ apiKey: "YOUR_KEY" });
    // ... run a simple generation test
    ```

5.  **Cache Busting (Important)**
    If updating the app logic or API key, bump the `CACHE_NAME` version in `public/service-worker.js` (e.g., `v1` -> `v2`) to force clients to update.

6.  **Deploy to Cloud Run**
    Run the build command. Use this syntax to safely pass the API Key:
    ```bash
    gcloud builds submit --config cloudbuild.yaml --substitutions=_VITE_API_KEY=your_actual_api_key_here .
    ```
    *Note: Do not use quotes around the key in the substitution flag if running from PowerShell, or ensure they are escaped correctly.*

    After successful deployment, Cloud Run will provide a Service URL (e.g., `https://customer-profile-app-....a.run.app`).

### Security Warning: API Key Exposure

**Important:** In this deployment configuration, your Google Gemini API key is embedded directly into the frontend build. This means anyone with access to your deployed application can potentially retrieve and misuse your API key.

For production environments, it is **highly recommended** to implement a secure backend service (e.g., a Cloud Function, another Cloud Run service, or an App Engine Flex instance) that acts as a proxy for your Gemini API calls. This backend service would securely store and use your API key, preventing its exposure to the client.
