# Get Ahead Trading Hub - Trading Data Dashboard
## 🌟 Overview
Get Ahead Trading Hub is a comprehensive trading dashboard built with Next.js that allows users, primarily traders that would want to get the most up to date information regarding trades on Fortune 500 companies. **Project still in progress**

## 🛠️ Tech Stack
- Frontend: Next.js 15 (App Router), React, Tailwind CSS
- Backend & Database: Python(ETL Pipeline), Supabase, Github Actions (ETL Pipeline for CI/CD)
- Deployment: Vercel

## 🚀 Installation
1. Clone the repository
```
git clone https://github.com/bryanleesantoso/get-ahead-hub.git
cd get-ahead-hub
```
2. Set up environment variables:
Create a .env.local file under the nextjs-app folder
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_USER=your_supabase_anon_user 
SUPABASE_PASSWORD=your_supabase_password
SUPABASE_HOST=your_supabase_host
SUPABASE_PORT=your_supabase_port_num 
```
Create a .env file under the etl-pipeline folder
```
API_KEY=your_alphavantage_api_key
SUPABASE_USER=your_supabase_anon_user 
SUPABASE_PASSWORD=your_supabase_password
SUPABASE_HOST=your_supabase_host
SUPABASE_PORT=your_supabase_port_num 
DATABASE_URL=your_database_url
```
3. Run the development server:
```
cd nextjs-app
npm run dev
```
4. Open http://localhost:3000 in your browser

### ♾️ ETL-Data Pipeline
Details on the ETL-Data Pipeline implementation can be found under this repo -> [ETL Data Pipeline](https://github.com/bryanleesantoso/etl-pipeline)
#### Main features
1. ETL Pipeline using REST API to fetch data from AlphaVantage API and transporting it into a supabase Postgresql database.
2. Implementation on Github Actions for constant pipelining


### 🙏 Acknowledgements
1. AlphaVantage of free API keys regarding financial information
2. Supabase for backend services
3. Stephen David-Williams for CI/CD ETL Pipeline Idea
