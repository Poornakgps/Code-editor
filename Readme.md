# Online Code Judge Platform

Another competitive programming platform because why not? Built this to scratch my own itch when existing platforms weren't cutting it for our local contests.

## What's inside

**Languages supported**: C++, Python, JavaScript, Java, Go
**Frontend**: React + Vite (because CRA is dead)
**Backend**: Node.js + Express (keeping it simple)
**Database**: PostgreSQL (because I trust it more than MongoDB for this)
**Code execution**: Docker containers (learned this the hard way after security nightmares)

## Features

- Write code in Monaco Editor (same as VS Code)
- Run/submit solutions with real-time feedback  
- Contest system with timers
- Problem browsing and management
- Everything runs in isolated Docker containers so users can't rm -rf your server

## Getting started

### The easy way

```bash
git clone <this-repo>
cd online-code-judge
chmod +x setup.sh
./setup.sh
```

Wait for Docker to do its thing. Frontend will be at `localhost:3000`, API at `localhost:5001`.

### The manual way

Create `.env`:
```
DB_HOST=postgres
DB_USER=test
DB_PASSWORD=test@1234
DB_NAME=postgres
DB_PORT=5432
```

Then:
```bash
docker-compose up -d
```

## Project structure

```
Frontend/          # React app
├── src/Components/
│   ├── CodeEditor/    # Monaco editor wrapper
│   ├── Pages/         # Problem lists, contests, etc
│   └── Navbar/        # Navigation
Backend/           # Express API
├── Controllers/   # Route handlers
├── ProcessCode/   # Code execution logic
├── Docker/        # Sandbox environment
└── Routes/        # API routes
```

## How code execution works

When someone submits code:
1. Write user code to file in `Backend/Docker/`
2. Spin up isolated Docker container 
3. Container compiles/runs code with time/memory limits
4. Read output from shared volume
5. Compare with expected output
6. Return verdict (AC/WA/TLE/CE/RE)

The `entrypoint.sh` script handles different languages. Added timeout and resource limits because users will definitely try to fork bomb you.

## API endpoints

- `GET /api/problem_list` - All problems
- `POST /api/problem_detail` - Single problem
- `POST /api/run` - Test code with custom input
- `POST /api/submitCode` - Submit for judging
- `POST /api/addproblem` - Add new problem
- `GET /api/getcontestlist` - Contest list

## Development 

Frontend:
```bash
cd Frontend && npm run dev
```

Backend:
```bash  
cd Backend && npm run dev
```

## Database

Two main tables:
- `problems` - problem statements, test cases, limits
- `contest` - contest info and problem arrays

Check `postgres-init/init.sql` for schema.
