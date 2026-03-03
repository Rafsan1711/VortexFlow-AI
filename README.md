# VortexFlow AI

VortexFlow AI is a modern, AI-powered chat application built with React, Firebase, and Google Gemini. It features a sleek, dark-themed UI, real-time chat capabilities, markdown support, code highlighting, and a comprehensive system status page.

## Features

-   **AI Chat Interface**: Interact with Google's Gemini Pro model in a conversational interface.
-   **Real-time Updates**: Chat history and messages are synced in real-time using Firebase Realtime Database.
-   **Markdown Support**: Messages support Markdown rendering, including code blocks with syntax highlighting.
-   **Chat Management**: Create, rename, delete, pin, and duplicate chats.
-   **System Status Page**: A public status page displaying the health of the application and its dependencies (Firebase, Vercel, Gemini API).
-   **Responsive Design**: Fully responsive UI that works seamlessly on desktop and mobile devices.
-   **Settings**: Customize the AI model and other preferences.

## Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **Styling**: Tailwind CSS, Framer Motion
-   **Backend/Database**: Firebase Realtime Database, Firebase Authentication
-   **AI Model**: Google Gemini API (@google/genai)
-   **Icons**: FontAwesome

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/vortexflow-ai.git
    cd vortexflow-ai
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add your Firebase and Gemini API keys:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_DATABASE_URL=your_database_url
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Deployment

The application is optimized for deployment on Vercel. Ensure you configure the environment variables in your Vercel project settings.

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). See the [LICENSE](LICENSE) file for details.
