"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

/* ==========================================
   TILT 3D CARD — Mouse-tracking 3D tilt
   ========================================== */

interface Tilt3DCardProps {
    children: React.ReactNode;
    className?: string;
    tiltMaxX?: number;
    tiltMaxY?: number;
    glare?: boolean;
    scale?: number;
    perspective?: number;
}

export function Tilt3DCard({
    children,
    className,
    tiltMaxX = 10,
    tiltMaxY = 10,
    glare = true,
    scale = 1.02,
    perspective = 800,
}: Tilt3DCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState("");
    const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({});
    const rafRef = useRef<number>(0);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                const card = cardRef.current;
                if (!card) return;
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotateX = (0.5 - y) * tiltMaxX * 2;
                const rotateY = (x - 0.5) * tiltMaxY * 2;

                setTransform(
                    `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
                );

                if (glare) {
                    const glareX = x * 100;
                    const glareY = y * 100;
                    setGlareStyle({
                        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
                        opacity: 1,
                    });
                }
            });
        },
        [tiltMaxX, tiltMaxY, glare, scale, perspective]
    );

    const handleMouseLeave = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setTransform(
            `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
        );
        if (glare) {
            setGlareStyle({ opacity: 0 });
        }
    }, [glare, perspective]);

    return (
        <div
            ref={cardRef}
            className={cn("relative", className)}
            style={{
                transform,
                transition: "transform 0.15s ease-out",
                transformStyle: "preserve-3d",
                willChange: "transform",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {glare && (
                <div
                    className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
                    style={{
                        ...glareStyle,
                        transition: "opacity 0.3s ease",
                    }}
                />
            )}
        </div>
    );
}

/* ==========================================
   3D FLOATING ELEMENT — Continuous 3D float
   ========================================== */

interface Float3DProps {
    children: React.ReactNode;
    className?: string;
    speed?: "slow" | "medium" | "fast";
    depth?: number;
    rotateAmount?: number;
}

export function Float3D({
    children,
    className,
    speed = "medium",
    depth = 30,
    rotateAmount = 10,
}: Float3DProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState("");

    useEffect(() => {
        let animId: number;
        const duration =
            speed === "slow" ? 8000 : speed === "medium" ? 5000 : 3000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = (elapsed % duration) / duration;
            const angle = progress * Math.PI * 2;

            const translateZ = Math.sin(angle) * depth;
            const rotateX = Math.sin(angle * 0.7) * rotateAmount;
            const rotateY = Math.cos(angle * 0.5) * rotateAmount;
            const translateY = Math.sin(angle) * 12;

            setTransform(
                `translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${translateY}px)`
            );
            animId = requestAnimationFrame(animate);
        };

        animId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animId);
    }, [speed, depth, rotateAmount]);

    return (
        <div
            ref={ref}
            className={cn("transform-gpu", className)}
            style={{
                transform,
                transformStyle: "preserve-3d",
                willChange: "transform",
            }}
        >
            {children}
        </div>
    );
}

/* ==========================================
   3D SCENE WRAPPER — Perspective container
   ========================================== */

interface Scene3DProps {
    children: React.ReactNode;
    className?: string;
    perspective?: number;
}

export function Scene3D({
    children,
    className,
    perspective = 1200,
}: Scene3DProps) {
    return (
        <div
            className={cn("relative", className)}
            style={{
                perspective: `${perspective}px`,
                perspectiveOrigin: "50% 50%",
            }}
        >
            {children}
        </div>
    );
}

/* ==========================================
   3D GEOMETRIC SHAPES — Pure CSS 3D objects
   ========================================== */

interface Cube3DProps {
    size?: number;
    className?: string;
    borderColor?: string;
    bgColor?: string;
}

export function Cube3D({
    size = 40,
    className,
    borderColor = "rgba(2, 86, 61, 0.12)",
    bgColor = "rgba(2, 86, 61, 0.03)",
}: Cube3DProps) {
    const half = size / 2;
    const faceStyle: React.CSSProperties = {
        position: "absolute",
        width: size,
        height: size,
        border: `1.5px solid ${borderColor}`,
        background: bgColor,
        backdropFilter: "blur(4px)",
        borderRadius: 4,
    };

    return (
        <div
            className={cn("animate-cube-spin", className)}
            style={{
                width: size,
                height: size,
                transformStyle: "preserve-3d",
                position: "relative",
            }}
        >
            <div style={{ ...faceStyle, transform: `translateZ(${half}px)` }} />
            <div
                style={{
                    ...faceStyle,
                    transform: `rotateY(180deg) translateZ(${half}px)`,
                }}
            />
            <div
                style={{
                    ...faceStyle,
                    transform: `rotateY(90deg) translateZ(${half}px)`,
                }}
            />
            <div
                style={{
                    ...faceStyle,
                    transform: `rotateY(-90deg) translateZ(${half}px)`,
                }}
            />
            <div
                style={{
                    ...faceStyle,
                    transform: `rotateX(90deg) translateZ(${half}px)`,
                }}
            />
            <div
                style={{
                    ...faceStyle,
                    transform: `rotateX(-90deg) translateZ(${half}px)`,
                }}
            />
        </div>
    );
}

/* 3D Ring */
interface Ring3DProps {
    size?: number;
    className?: string;
}

export function Ring3D({ size = 60, className }: Ring3DProps) {
    return (
        <div
            className={cn("animate-float-3d-2", className)}
            style={{
                width: size,
                height: size,
                border: "2px solid rgba(2, 86, 61, 0.1)",
                borderRadius: "50%",
                transformStyle: "preserve-3d",
            }}
        />
    );
}

/* 3D Diamond */
interface Diamond3DProps {
    className?: string;
}

export function Diamond3D({ className }: Diamond3DProps) {
    return (
        <div
            className={cn("animate-float-3d-3", className)}
            style={{ transformStyle: "preserve-3d" }}
        >
            <div
                style={{
                    width: 0,
                    height: 0,
                    borderLeft: "15px solid transparent",
                    borderRight: "15px solid transparent",
                    borderBottom: "20px solid rgba(2, 86, 61, 0.08)",
                }}
            />
            <div
                style={{
                    width: 0,
                    height: 0,
                    borderLeft: "15px solid transparent",
                    borderRight: "15px solid transparent",
                    borderTop: "20px solid rgba(5, 150, 105, 0.06)",
                }}
            />
        </div>
    );
}

/* ==========================================
   3D SCROLL REVEAL — Enhanced scroll animation
   ========================================== */

type Scroll3DVariant =
    | "rotate-in"
    | "flip-left"
    | "flip-right"
    | "rise-3d"
    | "swing-in";

interface Scroll3DRevealProps {
    children: React.ReactNode;
    variant?: Scroll3DVariant;
    delay?: number;
    duration?: number;
    threshold?: number;
    className?: string;
    once?: boolean;
}

export function Scroll3DReveal({
    children,
    variant = "rotate-in",
    delay = 0,
    duration = 800,
    threshold = 0.15,
    className,
    once = true,
}: Scroll3DRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.unobserve(element);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin: "0px 0px -40px 0px" }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold, once]);

    const getInitialTransform = () => {
        switch (variant) {
            case "rotate-in":
                return "perspective(800px) rotateX(15deg) translateY(60px)";
            case "flip-left":
                return "perspective(800px) rotateY(25deg) translateX(-40px)";
            case "flip-right":
                return "perspective(800px) rotateY(-25deg) translateX(40px)";
            case "rise-3d":
                return "perspective(800px) rotateX(10deg) translateY(80px) translateZ(-50px)";
            case "swing-in":
                return "perspective(800px) rotateY(-30deg) rotateX(10deg) translateX(-60px)";
            default:
                return "perspective(800px) rotateX(15deg) translateY(60px)";
        }
    };

    return (
        <div
            ref={ref}
            className={cn(className)}
            style={{
                transform: isVisible ? "none" : getInitialTransform(),
                opacity: isVisible ? 1 : 0,
                transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
            }}
        >
            {children}
        </div>
    );
}

/* ==========================================
   3D STAGGER — Children reveal with 3D effect
   ========================================== */

interface Stagger3DProps {
    children: React.ReactNode;
    stagger?: number;
    variant?: Scroll3DVariant;
    duration?: number;
    threshold?: number;
    className?: string;
}

export function Stagger3D({
    children,
    stagger = 120,
    variant = "rotate-in",
    duration = 700,
    threshold = 0.1,
    className,
}: Stagger3DProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element);
                }
            },
            { threshold, rootMargin: "0px 0px -40px 0px" }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold]);

    const getInitialTransform = () => {
        switch (variant) {
            case "rotate-in":
                return "perspective(800px) rotateX(15deg) translateY(40px)";
            case "flip-left":
                return "perspective(800px) rotateY(20deg) translateX(-30px)";
            case "flip-right":
                return "perspective(800px) rotateY(-20deg) translateX(30px)";
            case "rise-3d":
                return "perspective(800px) rotateX(8deg) translateY(50px) translateZ(-30px)";
            case "swing-in":
                return "perspective(800px) rotateY(-20deg) rotateX(5deg) translateX(-40px)";
            default:
                return "perspective(800px) rotateX(15deg) translateY(40px)";
        }
    };

    return (
        <div ref={ref} className={className}>
            {React.Children.map(children, (child, index) => (
                <div
                    style={{
                        transform: isVisible ? "none" : getInitialTransform(),
                        opacity: isVisible ? 1 : 0,
                        transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${index * stagger}ms, opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${index * stagger}ms`,
                        transformStyle: "preserve-3d",
                        willChange: "transform, opacity",
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}

/* ==========================================
   MOUSE PARALLAX — 3D parallax on mouse move
   ========================================== */

interface MouseParallax3DProps {
    children: React.ReactNode;
    className?: string;
    strength?: number;
}

export function MouseParallax3D({
    children,
    className,
    strength = 20,
}: MouseParallax3DProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({});
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 2;
                const y = (e.clientY / window.innerHeight - 0.5) * 2;
                setStyle({
                    transform: `perspective(1200px) rotateY(${x * strength * 0.3}deg) rotateX(${-y * strength * 0.3}deg)`,
                });
            });
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [strength]);

    return (
        <div
            ref={containerRef}
            className={cn("transform-gpu", className)}
            style={{
                ...style,
                transformStyle: "preserve-3d",
                transition: "transform 0.1s ease-out",
                willChange: "transform",
            }}
        >
            {children}
        </div>
    );
}

