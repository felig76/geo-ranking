# Geo Ranking

Geo Ranking is an educational and playful project that lets users explore and compare countries through interactive rankings ("Top 10" style) based on real-world indicators (population, GDP, internet usage, etc.). The data is fetched from the [World Bank API](https://data.worldbank.org/) and stored locally for performance and consistency.

## Features

- Interactive ranking games (Top 10) by country indicators.
- Uses the World Bank API for up-to-date global data.
- Local MongoDB database for caching and consistent queries.
- Modular backend with scripts to fetch, process, and store indicators.
- React + Vite frontend for fast and modern UI.
- Designed to scale with more indicators and game types.

## Tech Stack

- **Frontend:** Vite + React + TailwindCSS
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose ODM)
- **APIs:** World Bank Data API

## Project Structure

```
geo-ranking/
├── backend/
│   ├── config/        # DB connection and environment setup
│   ├── models/        # Mongoose schemas (e.g., Game, Country)
│   ├── scripts/       # Data fetching & seeding scripts
│   └── server.js      # Express server entrypoint
├── frontend/
│   ├── src/           # React components and pages
│   ├── public/        # Static assets
│   └── vite.config.js # Frontend build config
└── README.md          # Project documentation
```

## Setup

### Prerequisites

- Node.js (>=18)
- MongoDB (local or remote, e.g., Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/felig76/geo-ranking.git
cd geo-ranking

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file inside `backend/` with:

```
MONGO_URI=mongodb://localhost:27017/geo-ranking
PORT=5000
```

### Running the Project

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:5173/`.

## Data Fetching & Seeding

To fetch World Bank indicators and populate the database:

```bash
cd backend/scripts
node createGames.js
```

This will:

- Query the World Bank API.
- Filter and normalize valid country data.
- Save the top results in MongoDB as `Game` documents.

## Roadmap

-

## Contributing

Pull requests are welcome! Please follow the structure and add documentation when extending functionality.

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

**Note:** This README is designed to scale as the project grows. Future sections (API docs, deployment, screenshots, etc.) can be added below without breaking the structure.

