# Java E-Commerce — Separated Architecture

```
java-ecommerce/
├── backend/          ← Spring Boot REST API (Java 21, PostgreSQL)
├── frontend/         ← React Admin Dashboard (Vite, Nginx)
├── docker-compose.yml
└── .env.example
```

## Tech Stack

| Layer    | Tech                              |
|----------|-----------------------------------|
| Backend  | Java 21, Spring Boot 3.3, JPA, Flyway |
| Database | PostgreSQL 16                     |
| Frontend | React 18, Vite, Nginx             |

## Quick Start (Docker)

```bash
cp .env.example .env
docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000       |
| Backend  | http://localhost:8080       |
| API Docs | http://localhost:8080/api/products |
| Health   | http://localhost:8080/actuator/health |

## Local Development (Without Docker)

### Backend
```bash
cd backend
# Start PostgreSQL separately (or use Docker: docker compose up postgres -d)
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
cp .env.example .env       # set VITE_API_URL=http://localhost:8080
npm install
npm run dev                # runs at http://localhost:5173
```

## API Endpoints

| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | /api/products         | List products (search, page, size) |
| GET    | /api/products/{id}    | Get single product    |
| POST   | /api/products         | Create product        |
| PUT    | /api/products/{id}    | Update product        |
| DELETE | /api/products/{id}    | Soft-delete product   |

## Frontend Features

- 📊 Dashboard with stats (total products, categories, low stock, avg price)
- 📦 Product listing with search and pagination
- ➕ Add / ✏️ Edit / 🗑️ Delete products via modals
- 🔔 Toast notifications for all actions
- 📱 Responsive dark admin theme
