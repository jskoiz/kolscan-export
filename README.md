# Kolscan Export

This project is a web application that displays a leaderboard of Key Opinion Leaders (KOLs) from [kolscan.io](https://kolscan.io). It is built with Next.js and TypeScript, and is designed for deployment on Vercel.

## Features

- Fetches and displays KOL leaderboard data.
- Caches data to minimize external API calls.
- Professional project structure and setup.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/) for data fetching
- [Cheerio](https://cheerio.js.org/) for web scraping

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm, yarn, or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/jskoiz/kolscan-export.git
    cd kolscan-export
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To run the app in development mode, execute the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Deployment

This application is optimized for deployment on the [Vercel Platform](https://vercel.com/).

To deploy, connect your GitHub repository to Vercel and follow the on-screen instructions. Vercel will automatically detect the Next.js framework and configure the build settings.

## Project Structure

-   `src/app/api/leaderboard/route.ts`: API route for fetching and caching leaderboard data.
-   `src/app/page.tsx`: The main page component that displays the leaderboard.
-   `src/app/layout.tsx`: The main layout for the application.
-   `public/`: Static assets.
-   `next.config.ts`: Next.js configuration.
-   `tailwind.config.ts`: Tailwind CSS configuration.
