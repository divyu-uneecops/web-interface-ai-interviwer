"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  AnimateOnScroll,
  AnimateStagger,
  AnimatedCounter,
} from "@/components/ui/animate-on-scroll";
import {
  AnimatedText,
  AnimatedWords,
  RotatingText,
} from "@/components/ui/animated-text";
import {
  Tilt3DCard,
  Float3D,
  Scene3D,
  Cube3D,
  Ring3D,
  Diamond3D,
  Scroll3DReveal,
  Stagger3D,
  MouseParallax3D,
} from "@/components/ui/animate-3d";
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
import AIInterviewSession from "@/components/ai-interview-session";

export default function HomePage() {
  // Scroll to top on page load/reload to ensure first page is shown
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#f7fef9] to-[#ecfdf5] overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* ============ HERO SECTION ============ */}
      <section className="relative pt-30 pb-32 px-8 hero-mesh-bg overflow-x-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden perspective-container">
          {/* Dot grid */}
          <div className="absolute inset-0 hero-dot-grid opacity-40" />

          {/* Floating gradient orbs */}
          <div className="hero-orb absolute -top-32 -right-32 w-[400px] h-[400px] bg-[rgba(2,86,61,0.06)] animate-orb-glow" />
          <div
            className="hero-orb absolute bottom-0 -left-20 w-[300px] h-[300px] bg-[rgba(5,150,105,0.04)] animate-orb-glow"
            style={{ animationDelay: "2s" }}
          />

          {/* 3D Floating geometric shapes */}
          <div className="absolute top-[140px] right-[120px]" style={{ perspective: "600px" }}>
            <Cube3D size={35} className="opacity-60" />
          </div>

          <div className="absolute top-[280px] left-[60px]" style={{ perspective: "600px" }}>
            <Ring3D size={50} className="opacity-50" />
          </div>

          <div className="absolute bottom-[80px] right-[250px]" style={{ perspective: "600px" }}>
            <Diamond3D className="opacity-50" />
          </div>

          <div className="absolute top-[400px] right-[40px]" style={{ perspective: "600px" }}>
            <Cube3D size={25} className="opacity-40" borderColor="rgba(5,150,105,0.15)" bgColor="rgba(5,150,105,0.04)" />
          </div>

          <div className="absolute bottom-[150px] left-[200px]" style={{ perspective: "600px" }}>
            <Ring3D size={35} className="opacity-40" />
          </div>

          {/* Small floating dots */}
          <Float3D className="absolute top-[200px] right-[60px]" speed="slow" depth={20} rotateAmount={5}>
            <div className="w-3 h-3 rounded-full bg-[#02563d]/10" />
          </Float3D>
          <Float3D className="absolute top-[300px] left-[80px]" speed="medium" depth={15} rotateAmount={8}>
            <div className="w-2 h-2 rounded-full bg-[#059669]/15" />
          </Float3D>
          <Float3D className="absolute bottom-[100px] right-[200px]" speed="fast" depth={25} rotateAmount={12}>
            <div className="w-4 h-4 rounded-full bg-[#02563d]/8" />
          </Float3D>

          {/* Decorative rotating shapes */}
          <div
            className="absolute top-[180px] left-[45%] w-16 h-16 border border-[#02563d]/[0.06] rounded-xl animate-slow-spin"
            style={{ animationDuration: "25s" }}
          />
        </div>

        <div className="container mx-auto max-w-[1376px] relative z-10">
          <div className="flex items-center justify-between gap-12">
            {/* Left content */}
            <div className="max-w-[702px] space-y-5">
              <AnimateOnScroll variant="fade-up" delay={100} duration={700}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(2,86,61,0.08)] border border-[rgba(2,86,61,0.15)] animate-badge-glow">
                  <Zap className="w-3.5 h-3.5 text-[#02563d]" />
                  <span className="text-xs font-semibold text-[#02563d] tracking-wide uppercase">
                    AI-Powered Interview Platform
                  </span>
                </div>
              </AnimateOnScroll>

              <Scroll3DReveal variant="rise-3d" delay={200} duration={900}>
                <h1 className="text-[52px] font-bold leading-[56px]">
                  <span className="text-[#1a1a2e]">Automate</span>{" "}
                  <span className="text-[#02563d]">Interviews</span>
                  <br />
                  <span className="text-[#02563d]">with AI Intelligence</span>
                </h1>
              </Scroll3DReveal>

              <Scroll3DReveal variant="flip-left" delay={350} duration={800}>
                <p className="text-sm text-[#404040] leading-7 max-w-[600px]">
                  Run secure, unbiased interviews at scale with enterprise-grade AI.
                  Enable 24/7 video interviews with{" "}
                  <span className="font-semibold text-[#02563d]">real-time proctoring, scoring</span> and{" "}
                  <span className="font-semibold text-[#02563d]">intelligent anti-cheating</span>{" "}
                  technology.
                </p>
              </Scroll3DReveal>

              <Scroll3DReveal variant="rise-3d" delay={500} duration={700}>
                <div className="flex items-center gap-4 pt-2">
                  <Button
                    variant="default"
                    className="px-6 py-2.5 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(2,86,61,0.25)] hover:scale-105 active:translate-y-0 active:scale-100 group"
                    asChild
                  >
                    <Link href="/signup">
                      Get Started Free
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="secondary"
                    className="px-6 py-2.5 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:scale-105 active:translate-y-0 active:scale-100"
                    asChild
                  >
                    <Link href="/trial">Start free trial</Link>
                  </Button>
                </div>
              </Scroll3DReveal>

              <AnimateOnScroll variant="blur-in" delay={650} duration={700}>
                <div className="flex items-center gap-6 pt-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#02563d]" />
                    <span className="text-sm text-[#737373]">No credit card</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#02563d]" />
                    <span className="text-sm text-[#737373]">14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#02563d]" />
                    <span className="text-sm text-[#737373]">Cancel anytime</span>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Right hero component — AI Interview Session */}
            <Scroll3DReveal variant="flip-right" delay={300} duration={900}>
              <div
                className="relative w-[566.5px] h-[473px] shrink-0 overflow-visible rounded-2xl">
                <div className="h-full w-full">
                  <AIInterviewSession />
                </div>
              </div>
            </Scroll3DReveal>
          </div>

          {/* Stats Grid — 3D stagger */}
          <Stagger3D
            className="grid grid-cols-4 gap-8 mt-24"
            stagger={180}
            variant="rotate-in"
            duration={800}
          >
            <div className="flex flex-col items-center text-center group">
              <div className="text-[32px] font-bold text-[#02563d] mb-1 transition-transform duration-300 group-hover:scale-110 text-3d">
                <AnimatedCounter end={10000} suffix="+" />
              </div>
              <span className="stat-underline w-8 mb-2" />
              <div className="text-sm font-medium text-[#45556c]">
                Interviews Conducted
              </div>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="text-[32px] font-bold text-[#02563d] mb-1 transition-transform duration-300 group-hover:scale-110 text-3d">
                <AnimatedCounter end={87} suffix="%" />
              </div>
              <span className="stat-underline w-8 mb-2" />
              <div className="text-sm font-medium text-[#45556c]">
                Time Saved
              </div>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="text-[32px] font-bold text-[#02563d] mb-1 transition-transform duration-300 group-hover:scale-110 text-3d">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <span className="stat-underline w-8 mb-2" />
              <div className="text-sm font-medium text-[#45556c]">
                Companies Trust Us
              </div>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="text-[32px] font-bold text-[#02563d] mb-1 transition-transform duration-300 group-hover:scale-110 text-3d">
                <AnimatedCounter end={4} suffix=".9/5" />
              </div>
              <span className="stat-underline w-8 mb-2" />
              <div className="text-sm font-medium text-[#45556c]">
                Customer Rating
              </div>
            </div>
          </Stagger3D>
        </div>
      </section>

      {/* ============ MULTI-MODAL INTERVIEWS ============ */}
      <section className="bg-gradient-to-b from-[#fafafa] via-[#f7fef9] to-[#f0fdf4] py-20 px-8">
        <div className="container mx-auto max-w-[1376px] flex items-center gap-24">
          {/* Left image — 3D tilt with Enhanced Effects */}
          <Scene3D perspective={1000} className="relative w-[400px] h-[300px] shrink-0">
            <Scroll3DReveal variant="flip-left" duration={900}>
              <Tilt3DCard tiltMaxX={2} tiltMaxY={2} scale={1.01} className="w-full h-[300px]">
                <div className="rounded-2xl overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] hero-image-container group relative">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,86,61,0.2)] via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Image with enhanced hover */}
                  <img
                    src="/AI_InterviewImagess.png"
                    alt="Live Interview"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full rounded-2xl transition-all duration-700 group-hover:scale-[1.02] group-hover:brightness-105"
                  />

                  {/* Shine sweep on hover */}
                  <div className="absolute inset-0 hero-shine-sweep z-20 pointer-events-none" />
                </div>
                <div className="absolute -top-8 left-6">
                  <div className="bg-white rounded-lg px-4 py-2.5 shadow-md border border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        Live Interview in Progress
                      </span>
                    </div>
                  </div>
                </div>
              </Tilt3DCard>
            </Scroll3DReveal>
          </Scene3D>

          {/* Right content */}
          <div className="flex-1 space-y-5">
            <AnimateOnScroll variant="fade-up" delay={100}>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[rgba(2,86,61,0.08)] border border-[rgba(2,86,61,0.15)]">
                <span className="text-xs font-semibold text-[#02563d] tracking-wide uppercase">
                  Multi-Modal Flexibility
                </span>
              </div>
            </AnimateOnScroll>

            <Scroll3DReveal variant="rise-3d" delay={200} duration={800}>
              <h2 className="text-[38px] font-bold leading-[42px] text-[#02563d] text-3d">
                <AnimatedText
                  text="Interviews That Adapt to Your Candidates"
                  animation="typewriter"
                  speed={70}
                  delay={200}
                  loop={true}
                  fontSize="38px"
                  fontWeight="bold"
                  className="inline-block"
                />
              </h2>
            </Scroll3DReveal>

            <Scroll3DReveal variant="flip-left" delay={300} duration={700}>
              <p className="text-base text-[#404040] leading-6 max-w-[520px]">
                Unlike traditional video-only platforms, InterviewAI lets
                candidates choose their comfort zone. Reduce anxiety, eliminate
                bias, and get authentic responses.
              </p>
            </Scroll3DReveal>

            <Stagger3D
              className="space-y-3 pt-2"
              stagger={150}
              variant="swing-in"
              duration={700}
            >
              <Tilt3DCard tiltMaxX={6} tiltMaxY={6} scale={1.01} glare={false} className="bg-white border border-[rgba(0,0,0,0.08)] rounded-xl p-4 flex items-start gap-4 hover-glow cursor-default card-3d-hover">
                <div className="w-11 h-11 bg-gradient-to-br from-[rgba(2,86,61,0.12)] to-[rgba(5,150,105,0.08)] rounded-xl flex items-center justify-center shrink-0 icon-3d">
                  <MessageSquare className="w-5 h-5 text-[#02563d]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-950 mb-0.5">
                    <AnimatedText
                      text="Real-time transcription"
                      animation="fade-in"
                      delay={0}
                      className="inline-block"
                    />
                  </h3>
                  <p className="text-sm text-[#45556c]">
                    <AnimatedText
                      text="Perfect for thoughtful, written responses"
                      animation="fade-in"
                      delay={150}
                      className="inline-block"
                    />
                  </p>
                </div>
              </Tilt3DCard>

              <Tilt3DCard tiltMaxX={6} tiltMaxY={6} scale={1.01} glare={false} className="bg-white border border-[rgba(0,0,0,0.08)] rounded-xl p-4 flex items-start gap-4 hover-glow cursor-default card-3d-hover">
                <div className="w-11 h-11 bg-gradient-to-br from-[rgba(2,86,61,0.12)] to-[rgba(5,150,105,0.08)] rounded-xl flex items-center justify-center shrink-0 icon-3d">
                  <Video className="w-5 h-5 text-[#02563d]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-950 mb-0.5">
                    <AnimatedText
                      text="Video Interview"
                      animation="fade-in"
                      delay={0}
                      className="inline-block"
                    />
                  </h3>
                  <p className="text-sm text-[#45556c]">
                    <AnimatedText
                      text="Traditional face-to-face experience"
                      animation="fade-in"
                      delay={150}
                      className="inline-block"
                    />
                  </p>
                </div>
              </Tilt3DCard>

              <Tilt3DCard tiltMaxX={6} tiltMaxY={6} scale={1.01} glare={false} className="bg-white border border-[rgba(0,0,0,0.08)] rounded-xl p-4 flex items-start gap-4 hover-glow cursor-default card-3d-hover">
                <div className="w-11 h-11 bg-gradient-to-br from-[rgba(2,86,61,0.12)] to-[rgba(5,150,105,0.08)] rounded-xl flex items-center justify-center shrink-0 icon-3d">
                  <Phone className="w-5 h-5 text-[#02563d]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-950 mb-0.5">
                    <AnimatedText
                      text="Voice Call"
                      animation="fade-in"
                      delay={0}
                      className="inline-block"
                    />
                  </h3>
                  <p className="text-sm text-[#45556c]">
                    <AnimatedText
                      text="Natural conversation without video pressure"
                      animation="fade-in"
                      delay={150}
                      className="inline-block"
                    />
                  </p>
                </div>
              </Tilt3DCard>
            </Stagger3D>
          </div>
        </div>
      </section>

      {/* ============ CORE CAPABILITIES ============ */}
      <section id="features" className="py-20 px-8 bg-gradient-to-b from-[#fafffe] to-white relative">
        {/* Subtle top line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(2,86,61,0.1)] to-transparent" />

        {/* 3D decorative shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: "800px" }}>
          <div className="absolute top-[60px] right-[80px]">
            <Cube3D size={28} className="opacity-30" />
          </div>
          <div className="absolute bottom-[100px] left-[60px]">
            <Ring3D size={40} className="opacity-25" />
          </div>
        </div>

        <div className="container mx-auto max-w-[1376px]">
          <Scroll3DReveal variant="rotate-in" className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[rgba(2,86,61,0.08)] border border-[rgba(2,86,61,0.15)]">
              <span className="text-xs font-semibold text-[#02563d] tracking-wide uppercase">
                Core Capabilities
              </span>
            </div>
            <h2 className="text-[38px] font-bold text-[#02563d] text-3d">
              <AnimatedText
                text="Everything you Need to Scale Hiring"
                animation="typewriter"
                speed={70}
                delay={400}
                loop={true}
                fontSize="38px"
                fontWeight="bold"
                className="inline-block"
              />
            </h2>
            <p className="text-lg text-[#45556c] max-w-[600px] mx-auto">
              From screening to scoring, our AI interviewer handles the entire
              interview lifecycle
            </p>
          </Scroll3DReveal>

          <Stagger3D
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            stagger={120}
            variant="rise-3d"
            duration={750}
          >
            {[
              {
                icon: <MessageSquare className="w-6 h-6 text-[#02563d]" />,
                bg: "bg-[rgba(2,86,61,0.1)]",
                title: "Multi-Modal Interviews",
                desc: "Conduct interviews via text, voice, or video. AI adapts to candidate preferences.",
              },
              {
                icon: <Sparkles className="w-6 h-6 text-[#02563d]" />,
                bg: "bg-[#d0fae5]",
                title: "Adaptive AI Questioning",
                desc: "Dynamic follow-up questions based on candidate responses and competency frameworks.",
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-[#02563d]" />,
                bg: "bg-[#cbfbf1]",
                title: "Real-Time Scoring",
                desc: "Instant evaluation across technical skills, behavioral traits, and culture fit.",
              },
              {
                icon: <Users className="w-6 h-6 text-[#02563d]" />,
                bg: "bg-green-100",
                title: "Natural Conversations",
                desc: "GPT-4 powered conversations that feel human, not robotic.",
              },
              {
                icon: <Shield className="w-6 h-6 text-[#02563d]" />,
                bg: "bg-[#cefafe]",
                title: "Bias Mitigation",
                desc: "GDPR compliant with built-in fairness algorithms and audit trails.",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-[#02563d]" />,
                bg: "bg-[#ecfcca]",
                title: "Instant Insights",
                desc: "Comprehensive scorecards with improvement recommendations for candidates.",
              },
            ].map((card, i) => (
              <Tilt3DCard
                key={i}
                tiltMaxX={8}
                tiltMaxY={8}
                scale={1.02}
                className="bg-white border-2 border-[rgba(0,0,0,0.06)] rounded-2xl p-6 hover-lift card-3d-hover"
              >
                <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-5 icon-3d`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-950 mb-2">
                  <AnimatedText
                    text={card.title}
                    animation="slide-up"
                    delay={i * 100}
                    className="inline-block"
                  />
                </h3>
                <p className="text-base text-[#45556c] leading-6">
                  <AnimatedText
                    text={card.desc}
                    animation="fade-in"
                    delay={i * 100 + 200}
                    className="inline-block"
                  />
                </p>
              </Tilt3DCard>
            ))}
          </Stagger3D>
        </div>
      </section>

      {/* ============ 24/7 AVAILABILITY ============ */}
      <section className="bg-gradient-to-b from-[#f0fdf4] via-[#fafafa] to-[#f7fef9] py-20 px-8">
        <div className="container mx-auto max-w-[1376px] flex items-center justify-between gap-16">
          <div className="flex-1 space-y-5">
            <AnimateOnScroll variant="fade-up" delay={0}>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[rgba(2,86,61,0.08)] border border-[rgba(2,86,61,0.15)]">
                <span className="text-xs font-semibold text-[#02563d] tracking-wide uppercase">
                  24/7 Availability
                </span>
              </div>
            </AnimateOnScroll>

            <Scroll3DReveal variant="rise-3d" delay={100} duration={800}>
              <h2 className="text-[38px] font-bold leading-[42px] text-[#02563d] text-3d">
                <AnimatedText
                  text="Interviews Anytime, Anywhere"
                  animation="typewriter"
                  speed={70}
                  delay={200}
                  loop={true}
                  fontSize="38px"
                  fontWeight="bold"
                  className="inline-block"
                />
              </h2>
            </Scroll3DReveal>

            <Scroll3DReveal variant="flip-left" delay={200} duration={700}>
              <p className="text-lg text-[#45556c] max-w-[560px]">
                Candidates complete interviews at their convenience, across any
                timezone. No more scheduling conflicts or time zone headaches.
                Your AI interviewer never sleeps.
              </p>
            </Scroll3DReveal>

            <Stagger3D
              className="grid grid-cols-2 gap-4 pt-2"
              stagger={140}
              variant="rotate-in"
              duration={700}
            >
              <Tilt3DCard tiltMaxX={8} tiltMaxY={8} scale={1.02} glare={false} className="bg-white border-2 border-[rgba(2,86,61,0.08)] rounded-xl px-5 py-4 hover-glow cursor-default card-3d-hover">
                <div className="text-[30px] font-bold text-[#02563d] mb-1 text-3d">
                  24/7
                </div>
                <div className="text-sm text-[#45556c]">
                  Interview Availability
                </div>
              </Tilt3DCard>
              <Tilt3DCard tiltMaxX={8} tiltMaxY={8} scale={1.02} glare={false} className="bg-white border-2 border-[rgba(2,86,61,0.08)] rounded-xl px-5 py-4 hover-glow cursor-default card-3d-hover">
                <div className="text-[30px] font-bold text-[#02563d] mb-1 text-3d">
                  <AnimatedCounter end={150} suffix="+" />
                </div>
                <div className="text-sm text-[#45556c]">
                  Countries Supported
                </div>
              </Tilt3DCard>
              <Tilt3DCard tiltMaxX={8} tiltMaxY={8} scale={1.02} glare={false} className="bg-white border-2 border-[rgba(2,86,61,0.08)] rounded-xl px-5 py-4 hover-glow cursor-default card-3d-hover">
                <div className="text-[30px] font-bold text-[#02563d] mb-1 text-3d">
                  <AnimatedCounter end={50} suffix="+" />
                </div>
                <div className="text-sm text-[#45556c]">
                  Languages (Coming Soon)
                </div>
              </Tilt3DCard>
              <Tilt3DCard tiltMaxX={8} tiltMaxY={8} scale={1.02} glare={false} className="bg-white border-2 border-[rgba(2,86,61,0.08)] rounded-xl px-5 py-4 hover-glow cursor-default card-3d-hover">
                <div className="text-[30px] font-bold text-[#02563d] mb-1 text-3d">
                  <AnimatedCounter end={100} suffix="%" />
                </div>
                <div className="text-sm text-[#45556c]">Mobile Responsive</div>
              </Tilt3DCard>
            </Stagger3D>
          </div>

          <Scene3D perspective={1000} className="relative w-[566.5px] h-[378px] shrink-0">
            <Scroll3DReveal variant="flip-right" delay={200} duration={900}>
              <Tilt3DCard tiltMaxX={12} tiltMaxY={12} scale={1.03} className="w-full h-[378px]">
                <div className="rounded-2xl overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] hero-image-container group relative">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(2,86,61,0.15)] via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Image with enhanced hover */}
                  <img
                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=380&fit=crop"
                    alt="24/7 Interviews"
                    width={566}
                    height={378}
                    className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  />

                  {/* Shine sweep on hover */}
                  <div className="absolute inset-0 hero-shine-sweep z-20 pointer-events-none" />
                </div>
              </Tilt3DCard>
            </Scroll3DReveal>
          </Scene3D>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-20 px-8 bg-gradient-to-b from-white to-[#fafffe] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(2,86,61,0.1)] to-transparent" />

        {/* 3D decorative shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: "800px" }}>
          <div className="absolute top-[40px] left-[100px]">
            <Diamond3D className="opacity-25" />
          </div>
          <div className="absolute bottom-[60px] right-[120px]">
            <Cube3D size={30} className="opacity-20" />
          </div>
        </div>

        <div className="container mx-auto max-w-[1376px]">
          <Scroll3DReveal variant="rotate-in" className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[rgba(2,86,61,0.08)] border border-[rgba(2,86,61,0.15)]">
              <span className="text-xs font-semibold text-[#02563d] tracking-wide uppercase">
                Simple Process
              </span>
            </div>
            <h2 className="text-[38px] font-bold text-[#02563d] text-3d">
              <AnimatedText
                text="How It Works"
                animation="typewriter"
                speed={70}
                delay={400}
                loop={true}
                fontSize="38px"
                fontWeight="bold"
                className="inline-block"
              />
            </h2>
            <p className="text-lg text-[#45556c]">
              Get started in 4 simple steps
            </p>
          </Scroll3DReveal>

          <Stagger3D
            className="grid grid-cols-1 md:grid-cols-4 gap-0"
            stagger={200}
            variant="rise-3d"
            duration={800}
          >
            {[
              {
                icon: <FileText className="w-7 h-7 text-white" />,
                step: "01",
                title: "Create Interview",
                desc: "Choose template or build custom interview with AI assistance",
              },
              {
                icon: <Users className="w-7 h-7 text-white" />,
                step: "02",
                title: "Invite Candidates",
                desc: "Send interview links via email or integrate with your ATS",
              },
              {
                icon: <MessageSquare className="w-7 h-7 text-white" />,
                step: "03",
                title: "AI Conducts Interview",
                desc: "Candidates complete interviews at their convenience, 24/7",
              },
              {
                icon: <UserCheck className="w-7 h-7 text-white" />,
                step: "04",
                title: "Review & Decide",
                desc: "Get instant scorecards, insights, and shortlist recommendations",
              },
            ].map((item, i) => (
              <div key={i} className={`flex flex-col items-center text-center px-6 step-3d ${i < 3 ? 'step-connector' : ''}`}>
                <div className="w-16 h-16 bg-gradient-to-br from-[#02563d] to-[#059669] rounded-full flex items-center justify-center mb-4 step-circle shadow-[0_4px_16px_rgba(2,86,61,0.3)]">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-[#02563d] mb-2 tracking-widest uppercase">
                  Step {item.step}
                </div>
                <h3 className="text-base font-semibold text-neutral-950 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#45556c] max-w-[200px]">
                  {item.desc}
                </p>
              </div>
            ))}
          </Stagger3D>
        </div>
      </section>

      {/* ============ BEYOND TRADITIONAL ============ */}
      <section className="py-20 px-8 bg-gradient-to-br from-[#f7fef9] via-[#f0fdf4] to-[#ecfdf5] relative">
        {/* 3D decorative shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: "800px" }}>
          <div className="absolute top-[80px] right-[60px]">
            <Ring3D size={45} className="opacity-20" />
          </div>
          <div className="absolute bottom-[60px] left-[80px]">
            <Diamond3D className="opacity-20" />
          </div>
        </div>

        <div className="container mx-auto max-w-[1376px]">
          <Scroll3DReveal variant="rotate-in" className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[rgba(2,86,61,0.08)] border border-[rgba(2,86,61,0.15)]">
              <span className="text-xs font-semibold text-[#02563d] tracking-wide uppercase">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-[38px] font-bold text-[#02563d] text-3d">
              <AnimatedText
                text="Beyond Traditional Video Interviews"
                animation="typewriter"
                speed={70}
                delay={200}
                loop={true}
                fontSize="38px"
                fontWeight="bold"
                className="inline-block"
              />
            </h2>
            <p className="text-lg text-[#45556c]">
              vs. HireVue, Paradox, Talview, and others
            </p>
          </Scroll3DReveal>

          <Stagger3D
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[1100px] mx-auto"
            stagger={100}
            variant="swing-in"
            duration={700}
          >
            {[
              {
                title: "True Conversational AI",
                description: "Not pre-recorded questions. Real-time adaptive conversations powered by GPT-4, not rigid scripts.",
              },
              {
                title: "Multi-Modal Flexibility",
                description: "Candidates choose text, voice, or video. Others force video-only, creating anxiety and bias.",
              },
              {
                title: "Transparent Scoring",
                description: "Explainable AI with detailed rubrics. No black-box algorithms or hidden criteria.",
              },
              {
                title: "Built-in Compliance",
                description: "GDPR, EEOC, and accessibility compliant from day one. Audit trails for every decision.",
              },
              {
                title: "Developer-First Platform",
                description: "REST APIs, webhooks, and SDKs. Seamless integration with any ATS or HR system.",
              },
              {
                title: "Ethical AI Framework",
                description: "Bias detection, fairness metrics, and diverse training data. Not just a checkbox feature.",
              },
            ].map((item, index) => (
              <Tilt3DCard
                key={index}
                tiltMaxX={5}
                tiltMaxY={5}
                scale={1.01}
                glare={false}
                className="flex gap-4 p-5 rounded-xl why-item cursor-default"
              >
                <div className="w-7 h-7 bg-gradient-to-br from-[#02563d] to-[#059669] rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm why-check icon-3d">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-950 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-base text-[#45556c] leading-6">{item.description}</p>
                </div>
              </Tilt3DCard>
            ))}
          </Stagger3D>
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
              <AnimatedText
                text="Simple, Transparent Pricing"
                animation="typewriter"
                speed={70}
                delay={200}
                loop={true}
                fontSize="36px"
                fontWeight="bold"
                className="inline-block"
              />
            </h2>
            <p className="text-lg text-[#45556c]">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
            {/* Starter Plan */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 transition-all duration-300 hover:bg-[#02563d] hover:border-[#02563d] group cursor-pointer">
              <h3 className="text-xl text-neutral-950 mb-4 group-hover:text-white transition-colors duration-300">Starter</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-[36px] font-normal text-neutral-950 group-hover:text-white transition-colors duration-300">
                  $99
                </span>
                <span className="text-base text-[#45556c] group-hover:text-white/90 transition-colors duration-300">/month</span>
              </div>
              <p className="text-base text-[#45556c] mb-6 group-hover:text-white/90 transition-colors duration-300">
                Perfect for small teams
              </p>
              <Button variant="social" className="w-full mb-6 group-hover:bg-white group-hover:text-slate-700 group-hover:border-slate-200">
                Start Free Trial
              </Button>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    50 interviews/month
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    Text & Voice interviews
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    Basic templates
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    Email support
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    7-day data retention
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-white border-2 border-[#02563d] rounded-[14px] p-6 relative transition-all duration-300 hover:bg-[#02563d] group cursor-pointer">
              <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 bg-[#02563d] group-hover:bg-white px-2 py-1 rounded-lg transition-colors duration-300">
                <span className="text-xs font-medium text-white group-hover:text-[#02563d] transition-colors duration-300">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl text-neutral-950 mb-4 group-hover:text-white transition-colors duration-300">Professional</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-[36px] font-normal text-neutral-950 group-hover:text-white transition-colors duration-300">
                  $299
                </span>
                <span className="text-base text-[#45556c] group-hover:text-white/90 transition-colors duration-300">/month</span>
              </div>
              <p className="text-base text-[#45556c] mb-6 group-hover:text-white/90 transition-colors duration-300">
                For growing companies
              </p>
              <Button variant="default" className="w-full mb-7 h-12 text-base group-hover:bg-[#02563d] group-hover:text-white border border-white">
                Start Free Trial
              </Button>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    200 interviews/month
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    Text, Voice & Video
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    Custom templates
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    Priority support
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    90-day data retention
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    ATS integration
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    Advanced analytics
                  </span>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 transition-all duration-300 hover:bg-[#02563d] hover:border-[#02563d] group cursor-pointer">
              <h3 className="text-xl text-neutral-950 mb-4 group-hover:text-white transition-colors duration-300">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-[36px] font-normal text-neutral-950 group-hover:text-white transition-colors duration-300">
                  Custom
                </span>
              </div>
              <p className="text-base text-[#45556c] mb-6 group-hover:text-white/90 transition-colors duration-300">
                For large organizations
              </p>
              <Button variant="social" className="w-full mb-6 group-hover:bg-white group-hover:text-slate-700 group-hover:border-slate-200">
                Contact Sales
              </Button>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    Unlimited interviews
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    All interview modes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    Dedicated support
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    Unlimited retention
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">SSO & SAML</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    Custom integrations
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
                    SLA guarantee
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#02563d] group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-neutral-950 group-hover:text-white transition-colors duration-300">
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
            <Button
              variant="secondary"
              className="transition-transform duration-300 hover:-translate-y-1"
              asChild
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button
              variant="ghost"
              className="bg-transparent border border-white text-white hover:bg-white/10 hover:text-white transition-transform duration-300 hover:-translate-y-1"
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
              <p className="text-sm text-[#737373] mt-4 leading-6">
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
