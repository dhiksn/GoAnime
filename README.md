# GoAnime Wrapper

REST API wrapper built with Node.js (Express) that proxies Samehadaku anime endpoints.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **HTTP Client**: Axios

## Setup

```bash
npm install
node app.js
```

Server runs on `http://localhost:3000` by default.

## Environment Variables

Create a `.env` file:

```
PORT=3000
BASE_URL=https://www.sankavollerei.com
REQUEST_TIMEOUT=10000
```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/home` | Home page data |
| GET | `/api/recent?page=` | Recently aired episodes |
| GET | `/api/search?q=&page=` | Search anime by title |
| GET | `/api/ongoing?page=` | Ongoing anime list |
| GET | `/api/completed?page=&order=` | Completed anime list |
| GET | `/api/popular?page=` | Popular anime list |
| GET | `/api/movies?page=` | Anime movies list |
| GET | `/api/list` | Full anime list |
| GET | `/api/schedule` | Airing schedule |
| GET | `/api/genres` | All genres |
| GET | `/api/genre/:genre?page=` | Anime by genre |
| GET | `/api/batch?page=` | Batch download list |
| GET | `/api/anime/:slug` | Anime detail |
| GET | `/api/episode/:slug` | Episode detail |
| GET | `/api/batch/:slug` | Batch detail |
| GET | `/api/server/:id` | Streaming server data |

## Response Format

All responses follow this structure:

```json
{
  "status": true,
  "message": "Success",
  "data": { ... }
}
```

Error responses:

```json
{
  "status": false,
  "message": "Error description",
  "data": null
}
```

## Example Requests

```bash
# Home
curl http://localhost:3000/api/home

# Recent - page 2
curl http://localhost:3000/api/recent?page=2

# Search
curl "http://localhost:3000/api/search?q=naruto&page=1"

# Anime detail
curl http://localhost:3000/api/anime/one-piece

# Episode detail
curl http://localhost:3000/api/episode/one-piece-episode-1000

# Genre
curl "http://localhost:3000/api/genre/action?page=1"

# Completed with order
curl "http://localhost:3000/api/completed?page=1&order=latest"
```

## Project Structure

```
├── app.js                          # Entry point
├── .env                            # Environment config
├── package.json
└── server/
    ├── routes/
    │   └── apiRoutes.js            # Route definitions
    ├── controllers/
    │   └── apiController.js        # Request handlers & validation
    ├── services/
    │   └── apiService.js           # Axios HTTP calls
    └── utils/
        └── logger.js               # Simple console logger
```

