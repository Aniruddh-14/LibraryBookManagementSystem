# Library Book Management System Backend

This is a backend service for a Library Book Management System, built with **TypeScript** and **Express**. It adheres to strict **OOP principles** and follows a layered architecture (Routes -> Controllers -> Services -> Repositories). The system uses **in-memory storage** (no database).

## 🛠 Tech Stack
- **Language**: TypeScript
- **Framework**: Express.js
- **Storage**: In-memory array
- **Architecture**: Layered (Controller-Service-Repository)
- **ID Generation**: uuid

## 📂 Folder Structure
```
src/
├── app.ts            # Express app setup
├── server.ts         # Server entry point
├── controllers/      # Handles HTTP, validation, calls services
├── services/         # Business logic, search, filter, sort
├── repositories/     # Data access (in-memory storage)
├── models/           # TS Interfaces
├── routes/           # API Route definitions
├── middlewares/      # Error handling middleware
└── utils/            # Utilities (ApiError)
```

## 🚀 Installation & Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run in Development Mode**
   ```bash
   npm run dev
   ```

3. **Build & Run**
   ```bash
   npm run build
   npm start
   ```

The server runs on port **3000** by default.

## 📡 API Endpoints

Base URL: `http://localhost:3000`

### 📚 Books

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/books` | Create a new book |
| **GET** | `/books` | Get all books (with search/filter/sort) |
| **GET** | `/books/:id` | Get book by ID |
| **PUT** | `/books/:id` | Update book by ID |
| **DELETE** | `/books/:id` | Soft delete book (mark unavailable) |

### 🔍 Query Parameters (GET /books)

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `search` | string | Search by **title** or **author** |
| `genre` | string | Filter by **genre** |
| `isAvailable` | boolean | Filter by availability (`true`/`false`) |
| `sortBy` | string | Sort by field (e.g., `title`, `publishedYear`) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

## ✅ Features Implemented
- **CRUD Operations**: Create, Read, Update, Soft Delete.
- **Search**: By title or author.
- **Filtering**: By genre and availability.
- **Sorting**: By any field.
- **Pagination**: Metadata included in response.
- **Validation**: Manual input validation in controllers.
- **Error Handling**: Centralized middleware with standardized responses.
- **Clean Architecture**: Strict separation of concerns.
