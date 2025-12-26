# CineMagic - Movie Management System

This is a Next.js application built with Firebase Studio that provides a complete system for managing a movie collection. It's called CineMagic.

## About The Project

CineMagic is a full-stack application that allows users to perform CRUD (Create, Read, Update, Delete) operations on a movie database. It features a modern, responsive user interface and leverages AI to enhance movie posters.

This project is built using the Next.js App Router, Server Components, and Server Actions, which provides a robust and performant architecture where the "frontend" and "backend" are part of a single, cohesive system.

### Core Features

- **Add, View, Edit, and Delete Movies**: Full CRUD functionality for your movie library.
- **Search**: Instantly find movies by title.
- **AI Poster Enhancement**: Use generative AI to create enhanced versions of your movie posters based on the movie's description.
- **Modern UI/UX**: A visually appealing and easy-to-use interface built with ShadCN UI and Tailwind CSS.

## Getting Started

Follow these steps to get the development environment running.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation & Running the App

1.  **Install dependencies:**
    Open your terminal in the project root and run:
    ```bash
    npm install
    ```

2.  **Set up Environment Variables:**
    This project uses Google's Generative AI. You'll need an API key from Google AI Studio.

    Create a file named `.env` in the root of the project and add your API key:
    ```
    GOOGLE_API_KEY="YOUR_API_KEY_HERE"
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This single command starts the entire Next.js application.

4.  Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Architecture Overview

Instead of a separate Node.js/Express backend, this Next.js application uses a modern, integrated approach:

-   **Server Actions**: All backend logic, such as adding, updating, or deleting movies, is handled by Server Actions. These are functions that run securely on the server and can be called directly from our React components. This eliminates the need to create and manage separate API endpoints.
-   **Server Components**: Most pages and components are rendered on the server, which improves performance and reduces the amount of JavaScript sent to the client.
-   **Data**: For this demonstration, movie data is stored in-memory on the server (`src/lib/data.ts`). In a production application, you would replace this with a connection to a real database like MongoDB, PostgreSQL, or Firestore.
-   **No Postman Needed**: Because we use Server Actions instead of traditional REST APIs, there are no API endpoints to test with tools like Postman. All data operations are handled through the application's UI.
