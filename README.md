# InsightOCR

InsightOCR is a full-stack document-intelligence app that converts images to text and serves them through a secure REST API.

## 🔍 Features

- **Backend (NestJS)**
  - Tesseract OCR for text extraction  
  - PDF generation  
  - JWT-protected REST endpoints  

- **Frontend (Next.js)**
  - App Router  
  - NextAuth.js (credentials + JWT)  
  - Tailwind CSS for styling  

## 🎯 Prerequisites

- **Node.js**  
- **npm**  
- **PostgreSQL** running (or set a `DATABASE_URL`)

## 💾 Local Setup

1. **Clone the repository**  
   ```bash
   git clone https://github.com/Braganca1/InsightOCR.git
   cd InsightOCR

2. **Backend**
    ```bash
    cd backend
    cp .env.example .env
    # Edit .env: set DATABASE_URL, HF_API_TOKEN & NEXTAUTH_SECRET
    npm install
    npx prisma generate
    npm run start:dev


3. **Frontend**
    ```bash
    cd ../frontend
    cp .env.local.example .env.local
    # Edit .env.local: set DATABASE_URL, NEXT_PUBLIC_BACKEND_URL, NEXTAUTH_URL & NEXTAUTH_SECRET
    npm install
    npm run dev