
# Video Sharing Platform - Web Application

A modern video sharing platform built with Next.js, featuring real-time video recording, AI-powered transcription, and team collaboration capabilities.

## 🚀 Features

### Video Management
- Real-time video recording (720p and 1080p support)
- Direct video uploads with drag-and-drop
- Screen and webcam capture
- Video commenting system

### AI Integration
- Automatic video transcription
- AI-powered video summarization using Gemini
- AI chatbot for video-specific Q&A
- Smart title and description generation

### Team Collaboration
- Workspace management
- Folder organization
- Team member invitations
- Activity feed
- Email notifications for video views

### User Experience
- Responsive web interface
- Theme customization
- Rich video embedding
- Custom thumbnail generation

## 🛠️ Tech Stack

### Frontend
- Next.js 15.0
- React 19
- TypeScript
- TailwindCSS
- Radix UI Components
- Socket.io Client

### Database & ORM
- PostgreSQL
- Prisma ORM

### Authentication & Payments
- Clerk Authentication
- Stripe Payment Integration

### Third-party Services
- Voiceflow Knowledge Base
- AWS CloudFront for video streaming
- Wix Integration
- Nodemailer for email notifications

## 📋 Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Clerk account
- Stripe account
- Voiceflow account
- AWS CloudFront distribution

## 🚀 Getting Started

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
bun install
```

3. Set up environment variables
Create a `.env` file with the following configurations:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/auth/callback
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/callback

# Payment (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISH_KEY=your_stripe_publishable_key
STRIPE_CLIENT_SECRET=your_stripe_secret_key
STRIPE_SUBSCRIPTION_PRICE_ID=your_stripe_price_id

# Voiceflow
VOICEFLOW_API_KEY=your_voiceflow_api_key
VOICEFLOW_KNOWLEDGE_BASE_UPLOAD_URL=your_voiceflow_upload_url
VOICEFLOW_KNOWLEDGE_BASE_QUERY_URL=your_voiceflow_query_url

# Application URLs
NEXT_PUBLIC_HOST_URL=your_host_url
NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL=your_cloudfront_url
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_RECORDER_HOST=your_recorder_host

# Email
MAILER_PASSWORD=your_mailer_password
MAILER_EMAIL=your_mailer_email
```

4. Set up the database
```bash
bunx prisma generate
bunx prisma db push
```

5. Run the development server
```bash
bun dev
```

The application will be available at `http://localhost:3000`

## 📦 Build

```bash
bun run build
bun start
```

## 🔒 Security Features

- CORS protection
- Authentication middleware
- Secure socket connections
- Protected API routes
- File upload restrictions

## 🧪 Scripts

- `bun dev` - Start development server with Turbopack
- `bun build` - Build production application
- `bun start` - Start production server
- `bun lint` - Run ESLint

## 📄 License

This project was created for learning purposes, inspired by Web Prodigies https://www.youtube.com/watch?v=3R63m4sTpKo


## 👤 Author

Omkar D