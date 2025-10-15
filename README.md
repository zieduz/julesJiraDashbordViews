# 📊 Application Jira Performance & Forecast Dashboard

This project is a web application connected to the Jira API to analyze, visualize, and forecast performance indicators for a software project or team.

This initial version includes a complete project structure with a FastAPI backend and a React frontend, using mock data for demonstration purposes.

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine.

### Installation & Launch

1.  **Clone the repository** (or download the source code).

2.  **Environment Variables**:
    This project doesn't require a `.env` file for the initial mock data version, but you would create a `backend/.env` file for a real Jira connection with variables like:
    ```
    JIRA_SERVER=https://your-domain.atlassian.net
    JIRA_USERNAME=your-email@example.com
    JIRA_API_TOKEN=your_api_token
    ```

3.  **Build and run the application with Docker Compose**:
    From the root of the project, run the following command:
    ```bash
    docker-compose up --build
    ```
    This command will:
    - Build the Docker images for the backend and frontend services.
    - Start the containers.
    - Install all necessary dependencies within the containers.

4.  **Access the application**:
    - **Frontend (React Dashboard)**: Open your browser and go to `http://localhost:5173`
    - **Backend (FastAPI API)**: The API is accessible at `http://localhost:8000`. You can explore the interactive documentation (Swagger UI) at `http://localhost:8000/docs`.

---

## 🛠️ Project Structure

The project is organized as a monorepo with two main directories:

-   `backend/`: Contains the FastAPI application.
    -   `main.py`: The main application file with API endpoints and mock data generation.
    -   `requirements.txt`: Python dependencies.
    -   `Dockerfile`: Docker configuration for the backend.
-   `frontend/`: Contains the React application.
    -   `src/App.jsx`: The main dashboard component.
    -   `package.json`: Frontend dependencies.
    -   `Dockerfile.dev`: Docker configuration for frontend development.
-   `docker-compose.yml`: Orchestrates the backend and frontend services.
-   `README.md`: This file.

---

## 🧩 Tech Stack

| Layer      | Technology                               |
| ---------- | ---------------------------------------- |
| **Frontend** | React + Vite + TailwindCSS + Recharts    |
| **Backend**  | FastAPI (Python)                         |
| **CI/CD**    | Docker + Docker Compose                  |

---

## 🧠 Development Logic

-   **Mock Data**: The backend (`backend/main.py`) generates a realistic dataset of 500 Jira tickets over a 90-day history for 3 projects and 5 developers.
-   **API Endpoints**:
    -   `GET /api/tickets`: Returns the list of all tickets.
    -   `GET /api/metrics`: Provides aggregated data like tickets created/resolved per day.
    -   `GET /api/forecast`: Calculates a simple velocity forecast based on a 4-week moving average.
-   **Dashboard**: The React frontend (`frontend/src/App.jsx`) fetches data from these endpoints and displays it using KPI cards and interactive charts.
