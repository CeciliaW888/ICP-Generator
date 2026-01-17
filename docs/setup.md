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
    *Replace `icp-generator-repo` with your desired repository name if different.*

3.  **Create `cloudbuild.yaml` for Docker Image Build**
    To build the Docker image and pass the `API_KEY` securely, create a file named `cloudbuild.yaml` in the root of your project with the following content:
    ```yaml
    steps:
    - name: 'gcr.io/cloud-builders/docker'
      args: ['build', '--build-arg', 'API_KEY=${_API_KEY}', '-t', '[YOUR_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/icp-generator-repo/icp-generator:latest', '.']
    images:
    - '[YOUR_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/icp-generator-repo/icp-generator:latest'
    ```
    *Make sure to replace `[YOUR_REGION]`, `[YOUR_PROJECT_ID]`, and `icp-generator-repo` (if you chose a different name) with your actual values.*

4.  **Update `nginx.conf`**
    Cloud Run expects applications to listen on the port specified by the `PORT` environment variable (default `8080`). Update your `nginx.conf` file to listen on `8080`:
    ```nginx
    server {
        listen 8080; # Changed from 80
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle React Router (SPA)
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Optional: Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, no-transform";
        }
    }
    ```

5.  **Update `Dockerfile`**
    Update your `Dockerfile` to expose port `8080` (this is primarily for documentation/metadata):
    ```dockerfile
    # ... (other Dockerfile content) ...

    # Expose port 8080
    EXPOSE 8080 # Changed from 80

    # Start Nginx
    CMD ["nginx", "-g", "daemon off;"]
    ```

6.  **Build and Push the Docker Image to Artifact Registry**
    Use Cloud Build to build your container image and push it to the Artifact Registry.
    ```bash
    gcloud builds submit --config=cloudbuild.yaml --substitutions=_API_KEY=[YOUR_GEMINI_API_KEY] --project=[YOUR_PROJECT_ID] .
    ```
    *Replace `[YOUR_GEMINI_API_KEY]` with your actual API key.*

7.  **Deploy to Cloud Run**
    Deploy the container image to Cloud Run. The service will be publicly accessible.
    ```bash
    gcloud run deploy icp-generator-app --image=[YOUR_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/icp-generator-repo/icp-generator:latest --platform=managed --region=[YOUR_REGION] --allow-unauthenticated --project=[YOUR_PROJECT_ID]
    ```
    *Replace `icp-generator-app` with your desired Cloud Run service name.*

    After successful deployment, Cloud Run will provide a Service URL where your application is accessible.

### Security Warning: API Key Exposure

**Important:** In this deployment configuration, your Google Gemini API key is embedded directly into the frontend build. This means anyone with access to your deployed application can potentially retrieve and misuse your API key.

For production environments, it is **highly recommended** to implement a secure backend service (e.g., a Cloud Function, another Cloud Run service, or an App Engine Flex instance) that acts as a proxy for your Gemini API calls. This backend service would securely store and use your API key, preventing its exposure to the client.
