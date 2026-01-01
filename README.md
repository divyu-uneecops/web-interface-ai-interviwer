# AI Interview Platform - Web Interface

A comprehensive AI-powered interview management platform built with Next.js. This application enables recruiters and hiring managers to create, manage, and conduct AI-powered interviews at scale with support for text, voice, and video interview modes.

## 🎯 Overview

This platform provides a complete solution for automated candidate screening and interviewing. It features a modern landing page, full authentication system, comprehensive dashboard, job management, interview creation wizard, and AI interviewer management capabilities.

## ✨ Key Features

### 🏠 Landing Page

- Modern, responsive marketing site
- Feature showcase (multi-modal interviews, AI capabilities)
- Pricing tiers (Starter, Professional, Enterprise)
- How it works section
- Competitive advantages

### 🔐 Authentication

- User registration with phone number
- OTP-based verification
- Login system
- Password reset flow
- Secure session management

### 📊 Dashboard

- Real-time statistics (Active Jobs, Applicants, Interviews, Scores)
- Active jobs overview with metrics
- Recent interviews list with status tracking
- Quick navigation to key features

### 💼 Job Management

- Create and manage job postings
- Job details: title, industry, level, type, experience requirements
- Skills management
- Job status tracking (active, draft, closed)
- Round management per job
- Applicant tracking

### 🎤 Interview Creation

- **Multi-step wizard** for creating interviews:
  1. Choose interview source (new job or existing job)
  2. Job selection/creation
  3. Round details configuration
  4. Questions setup (AI-generated, custom, or hybrid)
  5. Instructions and settings
- Support for multiple interview modes (text, voice, video)
- Customizable interview parameters
- Interview link generation and sharing

### 🤖 AI Interviewer Management

- Create and configure AI interviewers
- Customize interviewer personality and behavior
- Assign interviewers to specific rounds
- Interviewer profile management

### 👥 User & Role Management

- Role-based access control
- User management interface
- Permission management

## 🚀 Technology Stack

### Core Framework

- **Next.js 16.0.7** - React framework with App Router
- **React 19.2.1** - UI library
- **TypeScript 5** - Type-safe development

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - Dialog, Dropdown Menu, Select, Checkbox, Radio Group, Slider, Tabs
- **shadcn/ui** - Pre-built component library (New York style)
- **Lucide React** - Icon library
- **class-variance-authority** - Component variants
- **tailwind-merge** - Tailwind class merging utility

### Forms & State Management

- **Formik 2.4.9** - Form state management
- React Hooks for local state

### API & Data Fetching

- **Axios 1.13.2** - HTTP client
- Custom service layer for API abstraction
- Request/response interceptors for authentication

### Notifications

- **Sonner 2.0.7** - Toast notifications

### Development Tools

- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **Next.js ESLint Config** - Next.js-specific linting rules

## 📁 Project Structure

```
web-interface-ai-interviwer/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── dashboard/                # Dashboard routes
│   │   │   ├── page.tsx              # Main dashboard
│   │   │   ├── layout.tsx            # Dashboard layout (sidebar + header)
│   │   │   ├── jobs/                 # Job management
│   │   │   │   ├── page.tsx          # Jobs list
│   │   │   │   └── [id]/             # Job detail page
│   │   │   ├── interviewers/         # Interviewer management
│   │   │   └── role-management/      # User role management
│   │   ├── login/                    # Login page
│   │   ├── signup/                   # Signup page
│   │   ├── verification/             # OTP verification
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                    # React components
│   │   ├── auth/                     # Authentication components
│   │   │   ├── components/           # Login, Signup, Verification
│   │   │   ├── types/                # Auth type definitions
│   │   │   └── utils/                # Auth utilities
│   │   │
│   │   ├── dashboard/                # Dashboard components
│   │   │   ├── create-interview/     # Interview creation wizard
│   │   │   │   ├── components/       # Step components
│   │   │   │   ├── hooks/            # Custom hooks
│   │   │   │   ├── constants.ts      # Constants
│   │   │   │   ├── types.ts          # Type definitions
│   │   │   │   └── utils.ts          # Utilities
│   │   │   ├── job/                  # Job management components
│   │   │   │   ├── components/       # Job list, create modal, stats
│   │   │   │   ├── interfaces/       # Job interfaces
│   │   │   │   ├── services/         # Job API services
│   │   │   │   ├── types/            # Job types
│   │   │   │   └── utils/            # Job utilities
│   │   │   ├── create-interviewer-modal.tsx
│   │   │   ├── create-round-modal.tsx
│   │   │   ├── edit-job-modal.tsx
│   │   │   ├── invite-modal.tsx
│   │   │   ├── sidebar.tsx           # Dashboard sidebar
│   │   │   └── header.tsx            # Dashboard header
│   │   │
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...                   # Other UI components
│   │   │
│   │   ├── shared/                   # Shared components
│   │   │   └── components/           # Data table, etc.
│   │   │
│   │   ├── header.tsx                # Landing page header
│   │   ├── logo.tsx                  # Logo component
│   │   └── stats-panel.tsx           # Statistics panel
│   │
│   ├── services/                     # API services
│   │   ├── axios.service.ts          # Axios instance & interceptors
│   │   ├── auth.service.ts           # Authentication API
│   │   └── server-interface.service.ts  # Generic API service
│   │
│   └── lib/                          # Utilities & constants
│       ├── constant.ts               # API endpoints & constants
│       └── utils.ts                  # Helper functions
│
├── public/                            # Static assets
│   ├── *.svg                         # Icons and images
│   └── *.jpg                         # Image assets
│
├── components.json                   # shadcn/ui configuration
├── next.config.ts                   # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── postcss.config.mjs                # PostCSS configuration
├── eslint.config.mjs                # ESLint configuration
└── package.json                      # Dependencies
```

## 🎨 Design System

### Colors

```css
Primary Green: #02563d
Primary Dark: #034d35
Success Green: #00a63e / #008236
Text Primary: #0a0a0a
Text Secondary: #404040 / #45556c
Text Tertiary: #737373 / #62748e
Background: #fafafa
Border: rgba(0,0,0,0.1)
```

### Typography

- **Primary Font**: Inter (Google Fonts)
- **Secondary Font**: Public Sans (Google Fonts)
- Responsive text sizing with Tailwind utilities
- Font weights: 400, 500, 600, 700

### Component Library

- Built on **shadcn/ui** (New York style)
- Uses **Radix UI** primitives for accessibility
- Consistent spacing and border radius
- Responsive breakpoints

## 🔌 API Integration

### Base Configuration

- **Base URL**: `https://api.hrone.studio/api`
- Authentication via Bearer tokens
- Custom headers: `x-org-id`, `x-app-id`
- Request/response interceptors for token management

### API Endpoints

#### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/resend-otp` - Resend OTP
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/verify-forgot-password-otp` - Verify reset OTP
- `POST /auth/reset-password` - Reset password

#### Job Management

- `POST /v2/forminstances` - Create job opening
- `POST /objects/{objectId}/views/{viewId}/records` - List jobs
- `GET /objects/{objectId}/records/{id}` - Get job details
- `DELETE /objects/{objectId}/records/{id}` - Delete job

## 🚦 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- Backend API access (configure in `src/services/axios.service.ts`)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd web-interface-ai-interviwer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file (if needed):

   ```env
   NEXT_PUBLIC_API_URL=https://api.hrone.studio/api
   ```

4. **Update API configuration**
   Edit `src/services/axios.service.ts` to configure:

   - Base URL
   - Organization ID (`x-org-id`)
   - Application ID (`x-app-id`)
   - Authentication token (or implement dynamic token retrieval)

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Development Guidelines

1. **Component Structure**

   - Use TypeScript for all components
   - Follow the existing folder structure
   - Separate concerns: components, hooks, services, types

2. **Styling**

   - Use Tailwind CSS utility classes
   - Follow the design system colors
   - Maintain responsive design (mobile-first)

3. **State Management**

   - Use React hooks for local state
   - Formik for form state
   - Custom hooks for reusable logic

4. **API Calls**

   - Use the service layer (`server-interface.service.ts`)
   - Handle errors appropriately
   - Show user-friendly notifications (Sonner)

5. **Type Safety**
   - Define interfaces/types for all data structures
   - Use TypeScript strictly
   - Avoid `any` types where possible

## 📱 Responsive Design

The application is fully responsive with Tailwind breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

## 🔒 Security Considerations

- Authentication tokens stored securely
- API interceptors for automatic token injection
- Protected routes (dashboard requires authentication)
- Input validation on forms
- Secure password reset flow

## 🎯 Key Features Deep Dive

### Interview Creation Wizard

The interview creation process is a 5-step wizard:

1. **Step 1: Interview Source**

   - Choose between creating a new job or using an existing job

2. **Step 2: Job Selection/Creation**

   - Select existing job or create new job with details
   - Configure job requirements and skills

3. **Step 3: Round Details**

   - Configure round name, type, objective
   - Set duration, language, interviewer
   - Define round-specific skills

4. **Step 4: Questions**

   - Choose question type: AI-generated, custom, or hybrid
   - Configure number of questions
   - Add custom questions if needed

5. **Step 5: Instructions & Settings**
   - Set interview instructions
   - Configure options: skip questions, reminders, recording, transcription, feedback

### Job Management

- **Create Jobs**: Full job posting with all details
- **Edit Jobs**: Update job information
- **View Jobs**: Detailed job view with rounds and applicants
- **Delete Jobs**: Remove job postings
- **Job Stats**: Track applicants, interviews, and hires

### Dashboard Analytics

- **Active Jobs**: Overview of all active job postings
- **Total Applicants**: Track candidate applications
- **Interviews Done**: Monitor interview completion
- **Average Score**: Performance metrics across interviews

## 🚀 Deployment

### Recommended: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- **Netlify**
- **AWS Amplify**
- **Railway**
- **DigitalOcean App Platform**
- **Docker** (with custom Dockerfile)

### Build Configuration

Ensure the following environment variables are set in production:

- API base URL
- Organization ID
- Application ID
- Any other required API credentials

## 📝 Notes

- The application uses a hardcoded authentication token in development (see `axios.service.ts`)
- In production, implement dynamic token retrieval from secure storage
- All API endpoints are configured in `src/lib/constant.ts`
- The project uses Next.js App Router (not Pages Router)
- All components are client-side by default (use `"use client"` directive)

## 🔧 Future Enhancements

- [ ] Implement proper authentication state management
- [ ] Add real-time interview status updates
- [ ] Integrate video/voice interview capabilities
- [ ] Add analytics and reporting dashboard
- [ ] Implement ATS integrations
- [ ] Add bulk operations for jobs and interviews
- [ ] Enhance mobile experience
- [ ] Add dark mode support
- [ ] Implement internationalization (i18n)
- [ ] Add comprehensive error boundaries
- [ ] Implement caching strategies
- [ ] Add unit and integration tests

## 📄 License

[Add your license information here]

## 👥 Contributing

[Add contributing guidelines here]

---

**Built with ❤️ using Next.js 16, React 19, TypeScript, and Tailwind CSS**
