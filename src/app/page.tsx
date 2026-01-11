"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  MessageSquare,
  Video,
  Phone,
  Sparkles,
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  FileText,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import { Header } from "@/components/header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-[143px] pb-20 px-8">
        <div className="container mx-auto max-w-[1376px]">
          <div className="flex items-center justify-between gap-12">
            <div className="max-w-[702px] space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[rgba(2,86,61,0.1)] border border-[rgba(2,86,61,0.2)]">
                <Zap className="w-3 h-3 text-[#02563d]" />
                <span className="text-xs font-medium text-[#02563d]">
                  AI-Powered Interview Platform
                </span>
              </div>

              <h1 className="text-[48px] font-bold leading-[48px] bg-linear-to-r from-[#0f172b] via-[#02563d] to-[#034d35] bg-clip-text text-transparent">
                Automate Interviews with AI Intelligence
              </h1>

              <p className="text-base text-[#404040] leading-6">
                Conduct structured, unbiased interviews at scale using advanced
                AI. Screen candidates 24/7 with text, voice, or video interviews
                powered by natural language understanding.
              </p>

              <div className="flex items-center gap-4">
                <Button variant="default" className="px-4 py-2 text-sm" asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
                <Button
                  variant="secondary"
                  className="px-4 py-2 text-sm"
                  asChild
                >
                  <Link href="/trial">
                    Start free trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <p className="text-sm text-[#737373]">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>

            <div className="relative w-[566.5px] h-[473px] shrink-0">
              <div className="absolute inset-0 rounded-2xl overflow-hidden border-4 border-[rgba(2,86,61,0.1)] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=500&fit=crop"
                  alt="AI Interview Platform"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[rgba(2,86,61,0.2)] to-transparent" />
              </div>
              <div className="absolute bottom-[-34px] left-[26px] bg-white border-2 border-[rgba(2,86,61,0.1)] rounded-[14px] px-[18px] py-[18px] shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#02563d] rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-normal text-neutral-950">
                      10,000+
                    </div>
                    <div className="text-sm text-[#45556c]">
                      Interviews Conducted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-8 mt-20">
            <div className="flex flex-col items-center text-center">
              <div className="text-[30px] font-bold text-[#02563d] mb-1">
                10,000+
              </div>
              <div className="text-sm font-medium text-[#45556c]">
                Interviews Conducted
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-[30px] font-bold text-[#02563d] mb-1">
                87%
              </div>
              <div className="text-sm font-medium text-[#45556c]">
                Time Saved
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-[30px] font-bold text-[#02563d] mb-1">
                500+
              </div>
              <div className="text-sm font-medium text-[#45556c]">
                Companies Trust Us
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-[30px] font-bold text-[#02563d] mb-1">
                4.9/5
              </div>
              <div className="text-sm font-medium text-[#45556c]">
                Customer Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Modal Interviews Section */}
      <section className="bg-white py-16 px-8">
        <div className="container mx-auto max-w-[1376px] flex items-center gap-12">
          <div className="relative w-[566.5px] h-[241px] shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=250&fit=crop"
                alt="Live Interview"
                width={566}
                height={241}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -top-[34px] left-[26px] bg-white border-2 border-[rgba(2,86,61,0.1)] rounded-[14px] px-[18px] py-[18px] shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#00c950] rounded-full opacity-75"></div>
                <span className="text-sm text-neutral-950">
                  Live Interview in Progress
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[rgba(2,86,61,0.1)] border border-[rgba(2,86,61,0.2)]">
              <span className="text-xs font-medium text-[#02563d]">
                Multi-Modal Flexibility
              </span>
            </div>

            <h2 className="text-[36px] font-bold leading-[40px] text-[#02563d]">
              Interviews That Adapt to Your Candidates
            </h2>

            <p className="text-base text-[#404040]">
              Unlike traditional video-only platforms, InterviewAI lets
              candidates choose their comfort zone: text chat, voice call, or
              video interview. Reduce anxiety, eliminate bias, and get authentic
              responses.
            </p>

            <div className="space-y-4">
              <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-[rgba(2,86,61,0.1)] rounded-[10px] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#02563d]" />
                </div>
                <div>
                  <h3 className="text-base font-normal text-neutral-950 mb-1">
                    Text Chat
                  </h3>
                  <p className="text-sm text-[#45556c]">
                    Perfect for thoughtful, written responses
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-[rgba(2,86,61,0.1)] rounded-[10px] flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5 text-[#02563d]" />
                </div>
                <div>
                  <h3 className="text-base font-normal text-neutral-950 mb-1">
                    Video Interview
                  </h3>
                  <p className="text-sm text-[#45556c]">
                    Traditional face-to-face experience
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-[rgba(2,86,61,0.1)] rounded-[10px] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#02563d]" />
                </div>
                <div>
                  <h3 className="text-base font-normal text-neutral-950 mb-1">
                    Voice Call
                  </h3>
                  <p className="text-sm text-[#45556c]">
                    Natural conversation without video pressure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section id="features" className="py-16 px-8">
        <div className="container mx-auto max-w-[1376px]">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[rgba(2,86,61,0.1)] border border-[rgba(2,86,61,0.2)]">
              <span className="text-xs font-medium text-[#02563d]">
                Core Capabilities
              </span>
            </div>
            <h2 className="text-[36px] font-bold text-[#02563d]">
              Everything you Need to Scale Hiring
            </h2>
            <p className="text-lg text-[#45556c]">
              From screening to scoring, our AI interviewer handles the entire
              interview lifecycle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-[rgba(0,0,0,0.1)] rounded-[14px] p-6">
              <div className="w-12 h-12 bg-[rgba(2,86,61,0.1)] rounded-[10px] flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-[#02563d]" />
              </div>
              <h3 className="text-lg font-normal text-neutral-950 mb-2">
                Multi-Modal Interviews
              </h3>
              <p className="text-base text-[#45556c]">
                Conduct interviews via text, voice, or video. AI adapts to
                candidate preferences.
              </p>
            </div>

            <div className="bg-white border-2 border-[rgba(0,0,0,0.1)] rounded-[14px] p-6">
              <div className="w-12 h-12 bg-[#d0fae5] rounded-[10px] flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-[#02563d]" />
              </div>
              <h3 className="text-lg font-normal text-neutral-950 mb-2">
                Adaptive AI Questioning
              </h3>
              <p className="text-base text-[#45556c]">
                Dynamic follow-up questions based on candidate responses and
                competency frameworks.
              </p>
            </div>

            <div className="bg-white border-2 border-[rgba(0,0,0,0.1)] rounded-[14px] p-6">
              <div className="w-12 h-12 bg-[#cbfbf1] rounded-[10px] flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-[#02563d]" />
              </div>
              <h3 className="text-lg font-normal text-neutral-950 mb-2">
                Real-Time Scoring
              </h3>
              <p className="text-base text-[#45556c]">
                Instant evaluation across technical skills, behavioral traits,
                and culture fit.
              </p>
            </div>

            <div className="bg-white border-2 border-[rgba(0,0,0,0.1)] rounded-[14px] p-6">
              <div className="w-12 h-12 bg-green-100 rounded-[10px] flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-[#02563d]" />
              </div>
              <h3 className="text-lg font-normal text-neutral-950 mb-2">
                Natural Conversations
              </h3>
              <p className="text-base text-[#45556c]">
                GPT-4 powered conversations that feel human, not robotic.
              </p>
            </div>

            <div className="bg-white border-2 border-[rgba(0,0,0,0.1)] rounded-[14px] p-6">
              <div className="w-12 h-12 bg-[#cefafe] rounded-[10px] flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-[#02563d]" />
              </div>
              <h3 className="text-lg font-normal text-neutral-950 mb-2">
                Bias Mitigation
              </h3>
              <p className="text-base text-[#45556c]">
                GDPR compliant with built-in fairness algorithms and audit
                trails.
              </p>
            </div>

            <div className="bg-white border-2 border-[rgba(0,0,0,0.1)] rounded-[14px] p-6">
              <div className="w-12 h-12 bg-[#ecfcca] rounded-[10px] flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-[#02563d]" />
              </div>
              <h3 className="text-lg font-normal text-neutral-950 mb-2">
                Instant Insights
              </h3>
              <p className="text-base text-[#45556c]">
                Comprehensive scorecards with improvement recommendations for
                candidates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 24/7 Availability Section */}
      <section className="bg-white py-16 px-8">
        <div className="container mx-auto max-w-[1376px] flex items-center justify-between gap-12">
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[rgba(2,86,61,0.1)] border border-[rgba(2,86,61,0.2)]">
              <span className="text-xs font-medium text-[#02563d]">
                24/7 Availability
              </span>
            </div>

            <h2 className="text-[36px] font-bold leading-[40px] text-[#02563d]">
              Interviews Anytime, Anywhere
            </h2>

            <p className="text-lg text-[#45556c] max-w-[560px]">
              Candidates complete interviews at their convenience, across any
              timezone. No more scheduling conflicts or time zone headaches.
              Your AI interviewer never sleeps.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border-2 border-[rgba(2,86,61,0.1)] rounded-[10px] px-[18px] py-[18px]">
                <div className="text-[30px] font-normal text-[#02563d] mb-2">
                  24/7
                </div>
                <div className="text-sm text-[#45556c]">
                  Interview Availability
                </div>
              </div>
              <div className="bg-white border-2 border-[rgba(2,86,61,0.1)] rounded-[10px] px-[18px] py-[18px]">
                <div className="text-[30px] font-normal text-[#02563d] mb-2">
                  150+
                </div>
                <div className="text-sm text-[#45556c]">
                  Countries Supported
                </div>
              </div>
              <div className="bg-white border-2 border-[rgba(2,86,61,0.1)] rounded-[10px] px-[18px] py-[18px]">
                <div className="text-[30px] font-normal text-[#02563d] mb-2">
                  50+
                </div>
                <div className="text-sm text-[#45556c]">
                  Languages (Coming Soon)
                </div>
              </div>
              <div className="bg-white border-2 border-[rgba(2,86,61,0.1)] rounded-[10px] px-[18px] py-[18px]">
                <div className="text-[30px] font-normal text-[#02563d] mb-2">
                  100%
                </div>
                <div className="text-sm text-[#45556c]">Mobile Responsive</div>
              </div>
            </div>
          </div>

          <div className="relative w-[566.5px] h-[378px] shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=380&fit=crop"
                alt="24/7 Interviews"
                width={566}
                height={378}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-8">
        <div className="container mx-auto max-w-[1376px]">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[rgba(2,86,61,0.1)] border border-[rgba(2,86,61,0.2)]">
              <span className="text-xs font-medium text-[#02563d]">
                Simple Process
              </span>
            </div>
            <h2 className="text-[36px] font-bold text-[#02563d]">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#02563d] rounded-full flex items-center justify-center mb-3">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm text-[#02563d] mb-3">Step 01</div>
              <h3 className="text-base text-neutral-950 mb-2">
                Create Interview
              </h3>
              <p className="text-sm text-[#45556c]">
                Choose template or build custom interview with AI assistance
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#02563d] rounded-full flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm text-[#02563d] mb-3">Step 02</div>
              <h3 className="text-base text-neutral-950 mb-2">
                Invite Candidates
              </h3>
              <p className="text-sm text-[#45556c]">
                Send interview links via email or integrate with your ATS
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#02563d] rounded-full flex items-center justify-center mb-3">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm text-[#02563d] mb-3">Step 03</div>
              <h3 className="text-base text-neutral-950 mb-2">
                AI Conducts Interview
              </h3>
              <p className="text-sm text-[#45556c]">
                Candidates complete interviews at their convenience, 24/7
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#02563d] rounded-full flex items-center justify-center mb-3">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm text-[#02563d] mb-3">Step 04</div>
              <h3 className="text-base text-neutral-950 mb-2">
                Review & Decide
              </h3>
              <p className="text-sm text-[#45556c]">
                Get instant scorecards, insights, and shortlist recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beyond Traditional Section */}
      <section className="py-16 px-8 bg-slate-50">
        <div className="container mx-auto max-w-[1376px]">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[rgba(2,86,61,0.1)] border border-[rgba(2,86,61,0.2)]">
              <span className="text-xs font-medium text-[#02563d]">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-[36px] font-bold text-[#02563d]">
              Beyond Traditional Video Interviews
            </h2>
            <p className="text-lg text-[#45556c]">
              vs. HireVue, Paradox, Talview, and others
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1192px] mx-auto">
            {[
              {
                title: "True Conversational AI",
                description:
                  "Not pre-recorded questions. Real-time adaptive conversations powered by GPT-4, not rigid scripts.",
              },
              {
                title: "Multi-Modal Flexibility",
                description:
                  "Candidates choose text, voice, or video. Others force video-only, creating anxiety and bias.",
              },
              {
                title: "Transparent Scoring",
                description:
                  "Explainable AI with detailed rubrics. No black-box algorithms or hidden criteria.",
              },
              {
                title: "Built-in Compliance",
                description:
                  "GDPR, EEOC, and accessibility compliant from day one. Audit trails for every decision.",
              },
              {
                title: "Developer-First Platform",
                description:
                  "REST APIs, webhooks, and SDKs. Seamless integration with any ATS or HR system.",
              },
              {
                title: "Ethical AI Framework",
                description:
                  "Bias detection, fairness metrics, and diverse training data. Not just a checkbox feature.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-6 h-6 bg-[#02563d] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-950 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-base text-[#45556c]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-8">
        <div className="container mx-auto max-w-[1376px]">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[rgba(2,86,61,0.1)] border border-[rgba(2,86,61,0.2)]">
              <span className="text-xs font-medium text-[#02563d]">
                Pricing
              </span>
            </div>
            <h2 className="text-[36px] font-bold text-[#02563d]">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-[#45556c]">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
            {/* Starter Plan */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6">
              <h3 className="text-xl text-neutral-950 mb-4">Starter</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-[36px] font-normal text-neutral-950">
                  $99
                </span>
                <span className="text-base text-[#45556c]">/month</span>
              </div>
              <p className="text-base text-[#45556c] mb-6">
                Perfect for small teams
              </p>
              <Button variant="social" className="w-full mb-6">
                Start Free Trial
              </Button>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    50 interviews/month
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    Text & Voice interviews
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    Basic templates
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    Email support
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    7-day data retention
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-white border-2 border-[#02563d] rounded-[14px] p-6 relative">
              <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 bg-[#02563d] px-2 py-1 rounded-lg">
                <span className="text-xs font-medium text-white">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl text-neutral-950 mb-4">Professional</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-[36px] font-normal text-neutral-950">
                  $299
                </span>
                <span className="text-base text-[#45556c]">/month</span>
              </div>
              <p className="text-base text-[#45556c] mb-6">
                For growing companies
              </p>
              <Button variant="default" className="w-full mb-6">
                Start Free Trial
              </Button>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    200 interviews/month
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    Text, Voice & Video
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    Custom templates
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    Priority support
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    90-day data retention
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    ATS integration
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    Advanced analytics
                  </span>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6">
              <h3 className="text-xl text-neutral-950 mb-4">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-[36px] font-normal text-neutral-950">
                  Custom
                </span>
              </div>
              <p className="text-base text-[#45556c] mb-6">
                For large organizations
              </p>
              <Button variant="social" className="w-full mb-6">
                Contact Sales
              </Button>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    Unlimited interviews
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    All interview modes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    Dedicated support
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    Unlimited retention
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">SSO & SAML</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    Custom integrations
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    SLA guarantee
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d]" />
                  <span className="text-sm text-neutral-950">
                    White-label option
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-linear-to-b from-[#02563d] to-[#034d35]">
        <div className="container mx-auto max-w-[900px] text-center">
          <h2 className="text-[36px] font-bold text-white mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of companies using AI to hire better, faster, and
            fairer.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="secondary" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button
              variant="ghost"
              className="bg-transparent border border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/trial">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-[#f5f5f5]">
        <div className="container mx-auto max-w-[1376px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo />
              <p className="text-sm text-[#737373] mt-4">
                Intelligent interviews for the modern workplace.
              </p>
            </div>

            <div>
              <h4 className="text-base font-normal text-[#0a0a0a] mb-4">
                Product
              </h4>
              <div className="space-y-2">
                <Link
                  href="#features"
                  className="block text-sm text-[#737373] hover:text-[#02563d]"
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="block text-sm text-[#737373] hover:text-[#02563d]"
                >
                  Pricing
                </Link>
                <Link
                  href="#"
                  className="block text-sm text-[#737373] hover:text-[#02563d]"
                >
                  Security
                </Link>
                <Link
                  href="#"
                  className="block text-sm text-[#737373] hover:text-[#02563d]"
                >
                  Integrations
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-base font-normal text-[#0a0a0a] mb-4">
                Resources
              </h4>
              <div className="space-y-2">
                <Link
                  href="#"
                  className="block text-sm text-[#737373] hover:text-[#02563d]"
                >
                  Documentation
                </Link>
                <Link
                  href="#"
                  className="block text-sm text-[#737373] hover:text-[#02563d]"
                >
                  API Reference
                </Link>
                <Link
                  href="#product-spec"
                  className="block text-sm text-[#737373] hover:text-[#02563d]"
                >
                  Product Spec
                </Link>
                <Link
                  href="#product-flow"
                  className="block text-sm text-[#737373] hover:text-[#02563d]"
                >
                  Product Flow
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-base font-normal text-[#0a0a0a] mb-4">
                Company
              </h4>
              <div className="space-y-2">
                <Link
                  href="#"
                  className="block text-sm text-[#737373] hover:text-[#02563d]"
                >
                  About Us
                </Link>
                <Link
                  href="#"
                  className="block text-sm text-[#737373] hover:text-[#02563d]"
                >
                  Careers
                </Link>
                <Link
                  href="#"
                  className="block text-sm text-[#737373] hover:text-[#02563d]"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="block text-sm text-[#737373] hover:text-[#02563d]"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e5e5e5] pt-6">
            <p className="text-sm text-[#737373] text-center">
              © 2025 InterviewAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
