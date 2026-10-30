# Cashflow

A self-hosted personal finance dashboard for recording income and expenses,
setting category-based monthly budgets, and reviewing financial trends.

> **Project scope:** Cashflow is built for personal use and simple household
> finance tracking. It is not designed for large organizations, complex business
> processes, or high-scale production use.

The interface is currently presented in Indonesian, while this documentation is
maintained in English for public contributors and users.

## Features

- Dashboard with total balance, current-month summaries, recent transactions,
  and a six-month cash-flow chart.
- Income and expense transaction management with categories.
- Separate income and expense category management.
- Monthly budgets per expense category, including spending progress and
  remaining budget calculations.
- Yearly statistics for income, expenses, category spending, monthly trends,
  and financial insights.
- Filterable reports by period and category, with a print-friendly view.
- Persistent local storage through SQLite.
- Containerized development and production environments.

## Technology Stack

- [Next.js](https://nextjs.org/) 16 with React 19 and TypeScript
- [Tailwind CSS](https://tailwindcss.com/) 4 for styling
- [Prisma](https://www.prisma.io/) 7 with SQLite
- [TanStack Query](https://tanstack.com/query/latest) and TanStack Table
- [React Hook Form](https://react-hook-form.com/) with Zod validation
- [Recharts](https://recharts.org/) for charts
- Docker and Docker Compose for containerized workflows

## Requirements

Choose one of the following environments:

- **Docker:** Docker Engine with the Docker Compose plugin.
- **Local development:** Node.js 22 or newer and one package manager: pnpm
  (recommended), npm, or Yarn.

## Quick Start with Docker

The Docker workflow is the simplest way to start the application. Database
migrations run automatically when the container starts.

### Development

```shell
docker compose -f docker-compose.dev.yml up --build
```

Open [http://localhost:3000](http://localhost:3000).

The development configuration mounts the project directory into the container,
so source changes are reflected through Next.js development mode.

To stop the environment, press `Ctrl+C`. To remove the development container,
run:

```shell
docker compose -f docker-compose.dev.yml down
```

### Production

Build and start the production container in the background:

```shell
docker compose up -d --build
```

Open [http://localhost:3000](http://localhost:3000).

The production database is stored in the named Docker volume
`cashflow_data`. This keeps data available when the application container is
recreated. Do not remove that volume unless you intentionally want to delete
all production data.

View container logs with:

```shell
docker compose logs -f
```

Stop the production environment with:

```shell
docker compose down
```

## Local Development

1. Clone the repository and enter its directory.

    ```shell
    git clone https://github.com/DryanFTH/Cashflow-Website
    cd Cashflow-Website
    ```

2. Install dependencies. This project uses [pnpm](https://pnpm.io/) natively,
   so pnpm is the recommended package manager.

    **pnpm (recommended)**

    ```shell
    pnpm install
    ```

    **npm**

    ```shell
    npm install
    ```

    **Yarn**

    ```shell
    yarn install
    ```

3. Create the local environment file.

    ```shell
    cp .env.example .env
    ```

4. Apply database migrations using your selected package manager.

    **pnpm (recommended)**

    ```shell
    pnpm db:setup
    ```

    **npm**

    ```shell
    npm run db:setup
    ```

    **Yarn**

    ```shell
    yarn db:setup
    ```

5. Start the development server using your selected package manager.

    **pnpm (recommended)**

    ```shell
    pnpm dev
    ```

    **npm**

    ```shell
    npm run dev
    ```

    **Yarn**

    ```shell
    yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable       | Required | Description                           |
| -------------- | :------: | ------------------------------------- |
| `DATABASE_URL` |   Yes    | SQLite connection URL used by Prisma. |

The default local value is defined in `.env.example`:

```env
DATABASE_URL='file:./prisma/dev.db'
```

## Data and Privacy

Cashflow is designed for self-hosted use. Financial records are stored in the
SQLite database configured by `DATABASE_URL`. Before making the application
publicly reachable, configure access controls and establish a backup process
appropriate for your environment.

## Contributing

Contributions are welcome. Before opening a pull request, please ensure the
project passes its checks:

```shell
pnpm check
pnpm build
```

Keep changes focused, include database migrations when modifying the Prisma
schema, and avoid committing personal data or environment files.

## License

Cashflow is released under the **[MIT License](LICENSE)**. You are free to use,
modify, distribute, and reuse the source code in personal or commercial
projects, provided that the required copyright and license notices are kept
intact.

**Important:** The MIT License applies only to the source code in this
repository. Third-party packages and tools used by this project remain subject
to their own licenses.
