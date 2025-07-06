# 🎤 WHISPR Voice App

> AI-based Voice-to-Text SaaS MVP using Next.js, OpenAI, Stripe, and Clerk

## 🔗 Live Demo

👉 [https://mvp-voice-app.vercel.app](https://mvp-voice-app.vercel.app)

## 🧠 About the App

**WHISPR** is an MVP web application that allows users to upload voice recordings and receive real-time transcriptions using AI (OpenAI Whisper API). Each user has a personal account with their own audio playlist.

- 🔐 Authentication via [Clerk.dev](https://clerk.dev)
- 📼 Upload audio files (.mp3, .wav, etc.)
- 🧠 Transcription using OpenAI Whisper
- 💾 History of uploaded audio files saved in PostgreSQL
- 💰 2 free transcriptions, then Stripe payment required
- 🔁 Stripe Webhook updates `hasPaid` status after payment

## ✨ Features

- ✅ User sign up/sign in
- ✅ Audio file upload with validation
- ✅ Audio-to-text transcription via AI
- ✅ Personal dashboard with past uploads
- ✅ 2 free transcriptions
- ✅ Stripe one-time payment integration
- ✅ Webhook to unlock further uploads

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, TailwindCSS, ShadCN UI
- **Backend:** API Routes (Next.js App Router)
- **Authentication:** Clerk
- **Payments:** Stripe (Checkout + Webhook)
- **Database:** PostgreSQL + Prisma ORM
- **AI API:** OpenAI Whisper
- **Deployment:** Vercel

## 📁 Project Structure

```
📦 MVP-VOICE-APP
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── MusicStudio.png
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── checkout/
│   │   │   ├── upload/
│   │   │   └── webhook/
│   │   └── dashboard/
│   ├── components/
│   │   ├── ui/
│   │   └── UploadForm.tsx
│   └── lib/
│       └── middleware.ts
├── .env
├── next.config.ts
├── tsconfig.json
└── README.md
```

## 🧪 Local Development

1. **Clone the repository:**

```bash
git clone https://github.com/svitlanahavrylets/your-repo-name.git
cd your-repo-name
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Create `.env` file:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
OPENAI_API_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_BASE_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=
```

4. **Start the development server:**

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## 💳 Stripe (test mode)

- First 2 uploads are free
- After that, prompt user for one-time payment ($20)
- Webhook updates `hasPaid = true` in DB

## 📩 Contact

Created by [Svitlana Havrylets](mailto:svitlana.havrylets@gmail.com)
