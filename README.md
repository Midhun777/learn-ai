# AI-Assisted Personalized Learning Platform 🚀

A modern, full-stack web application designed to generate personalized learning roadmaps using AI. Built with the MERN stack (MongoDB, Express, React, Node.js) and powered by Google's Gemini API, this platform helps users master new skills with structured paths, resource curation, and progress tracking.

## ✨ Features

- **AI-Powered Roadmaps**: Generate detailed learning paths for any skill using the Gemini API.
- **Personalized Content**: Curated resources, estimated timelines, and hands-on projects tailored to the user's request.
- **Progress Tracking**: Track your learning journey with interactive checkboxes and visual progress bars.
- **Certificate Generation**: Automatically generate downloadable PDF certificates upon roadmap completion.
- **Modern UI/UX**: A clean, responsive interface built with React, Tailwind CSS, and Glassmorphism design elements.
- **Authentication**: Secure user registration and login system.
- **Dashboard**: Centralized hub to manage saved roadmaps and view active progress.

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: Fast, modern frontend framework.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Router**: Client-side routing.
- **Lucide React**: Beautiful & consistent icons.
- **Axios**: HTTP client for API requests.
- **React Markdown**: Rendering AI-generated markdown content.
- **jsPDF & html2canvas**: For generating completion certificates.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building the API.
- **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM).
- **JSON Web Token (JWT)**: Secure authentication.
- **Dotenv**: Environment variable management.

### AI Integration
- **Google Gemini API**: Generative AI for creating varied and deep learning content.

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local instance or Atlas connection string)
- **Google Gemini API Key**

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/learn-ai-platform.git
    cd learn-ai-platform
    ```

2.  **Install Root Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd server
    npm install
    ```

4.  **Install Frontend Dependencies:**
    ```bash
    cd ../client
    npm install
    ```

### Configuration

Create a `.env` file in the `server` directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
```

*(Note: Ensure your MongoDB server is running or provided URI is valid)*

### Running the Application

From the root directory, run the following command to start both the client and server concurrently:

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 📂 Project Structure

```
learn-ai-platform/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages (Dashboard, Roadmap, etc.)
│   │   └── ...
│   └── ...
├── server/                 # Express Backend
│   ├── config/             # DB connection logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── ...
└── package.json            # Root configuration
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the ISC License.
