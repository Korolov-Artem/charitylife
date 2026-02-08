# 📝 Modern Blog CMS - Frontend

A robust Content Management System (CMS) interface built with **React** and **TypeScript**. This application allows administrators to draft, format, and publish articles with rich media support, while providing a clean reading experience for users.

> 🚧 **Status:** Work in Progress (Active Development)

## ✨ Key Features

* **🔐 Authentication & Security:**
    * Secure Login/Registration with JWT handling.
    * Role-Based Access Control (RBAC) protecting Admin routes.
    * Automatic token refresh (silent authentication).
* **✍️ Rich Text Editor (Custom Implementation):**
    * Integrated **React-Quill** for content creation.
    * **Custom Image Handler:** Intercepts image drops to upload files to the server immediately (returning a URL) instead of storing heavy Base64 strings in the database.
* **🎨 UI/UX:**
    * Fully responsive design using **Tailwind CSS**.
    * Dynamic image previews and cover image uploads.
* **Rx State Management:**
    * Powered by **Redux Toolkit** and **RTK Query** for efficient data fetching and caching.

## 🛠️ Tech Stack

* **Core:** React, TypeScript, Vite
* **State:** Redux Toolkit, RTK Query
* **Styling:** Tailwind CSS
* **Forms & Editor:** React-Quill, React Hook Form (or custom validation)
* **Routing:** React Router DOM

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/project-frontend.git](https://github.com/yourusername/project-frontend.git)
    cd project-frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root:
    ```env
    VITE_API_URL=http://localhost:3000
    ```

4.  **Run the App**
    ```bash
    npm run dev
    ```

## 🔮 Roadmap / To-Do

* [ ] Add "Edit Article" functionality.
* [ ] Implement Dark Mode toggle.
* [ ] Add public comments section for articles.
* [ ] Improve mobile responsiveness for the dashboard.
* [ ] Add content archive 
