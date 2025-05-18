# Paggo OCR

A full-stack document-intelligence app:
- **NestJS** backend for OCR (Tesseract) + PDF generation + JWT-protected REST API  
- **Next.js 13** frontend with App Router, NextAuth (credentials + JWT), Tailwind CSS  

---

## 🚀 Live Demo

👉 https://your-vercel-app.vercel.app

---

## 🎯 Prerequisites

- **Node.js** ≥ 18  
- **pnpm** (or npm/yarn)  
- **PostgreSQL** running (or set `DATABASE_URL`)  

---

## 💾 Local Setup

1. **Clone & Install**  
   ```bash
   git clone https://github.com/your-username/paggo-ocr.git
   cd paggo-ocr

2. **Backend** 

cd backend
cp .env.example .env
# Edit .env:
# DATABASE_URL=postgres://user:pass@localhost:5432/yourdb
# NEXTAUTH_SECRET=some-long-secret
pnpm install
npx prisma generate
pnpm run start:dev

3. **Frontend**

cd ../frontend
cp .env.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=same-secret-as-backend
pnpm install
pnpm run dev
