
# Professional Deployment Guide for Rafsy's AI Portfolio

This guide provides a comprehensive, step-by-step process for deploying your AI-powered Next.js portfolio to a production environment. The recommended architecture involves deploying the **Next.js frontend to Vercel** and the **Genkit AI backend to Firebase App Hosting**.

## 1. Prerequisites

Before you begin, ensure you have the following accounts and tools set up:
- **Node.js:** Make sure you have Node.js (v20 or later) installed on your machine.
- **Git & GitHub:** Your project code should be in a Git repository and pushed to a remote repository on GitHub.
- **Vercel Account:** Sign up for a free account at [vercel.com](https://vercel.com).
- **Google Cloud / Firebase Account:** You will need a Google Cloud account to use Firebase services and obtain your Gemini API key.

---

## 2. Environment Variable Configuration

Your application requires an API key for Google's Gemini model to power its AI features.

1.  **Obtain API Key:** Go to the [Google AI Studio](https://aistudio.google.com/) and create an API key.
2.  **Create Production Environment File:** In the root of your project, create a new file named `.env.production.local`. **This file should NOT be committed to Git.**
3.  **Add Key to File:** Add your API key to the file like this:
    ```.env.production.local
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```
4.  **Add Key to Hosting Provider:** Both Vercel and Firebase will require you to add this environment variable directly in their respective dashboards. This is the most secure way to handle secrets in production.
    -   In Vercel, go to your Project > Settings > Environment Variables.
    -   In Firebase App Hosting, you will configure this during the setup process.

---

## 3. Backend Deployment: Genkit on Firebase App Hosting

Your `src/ai/` directory contains Genkit flows that act as your serverless backend. Firebase App Hosting is the ideal platform for this, and your `apphosting.yaml` is already configured for it.

1.  **Install Firebase CLI:**
    ```bash
    npm install -g firebase-tools
    ```
2.  **Login to Firebase:**
    ```bash
    firebase login
    ```
3.  **Initialize Firebase in Your Project:**
    Run `firebase init` in your project root and select "App Hosting". Follow the prompts to connect it to your Google Cloud/Firebase project.
4.  **Deploy the Backend:**
    App Hosting uses your `package.json`'s `start` script. The script is already configured to run Genkit. Deployment is handled by connecting your GitHub repository to your App Hosting backend in the Firebase console. Follow the official Firebase App Hosting documentation for the most up-to-date instructions on setting up the GitHub connection.

---

## 4. Frontend Deployment: Next.js on Vercel

Vercel is the creator of Next.js and provides the most seamless deployment experience.

1.  **Import Project on Vercel:**
    - Log in to your Vercel account.
    - Click "Add New... > Project".
    - Select your GitHub repository containing this project.
2.  **Configure the Project:**
    - Vercel will automatically detect that it is a Next.js project and configure the build settings correctly.
    - **Crucially**, navigate to the "Environment Variables" section in the project settings.
    - Add a new environment variable with the name `GEMINI_API_KEY` and paste the API key you obtained in Step 2.
3.  **Deploy:**
    - Click the "Deploy" button. Vercel will automatically pull your code, build the application, and deploy it to its global CDN.

After deployment, Vercel will provide you with a production URL. Your `main` branch will be your production branch, and any pushes to it will automatically trigger a new production deployment.
