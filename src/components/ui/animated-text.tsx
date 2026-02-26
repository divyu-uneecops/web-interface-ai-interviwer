"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

type AnimationType =
    | "typewriter"
    | "gradient"
    | "fade-in"
    | "shimmer"
    | "bounce"
    | "glow"
    | "slide-up"
    | "letter-by-letter"
    | "stunning"
    | "rainbow"
    | "glow-intense";

interface AnimatedTextProps {
    text: string;
    animation?: AnimationType;
    className?: string;
    speed?: number;
    delay?: number;
    loop?: boolean;
    gradientColors?: string[];
    fontSize?: string;
    fontWeight?: string;
}

export function AnimatedText({
    text,
    animation = "gradient",
    className,
    speed = 50,
    delay = 0,
    loop = false,
    gradientColors = ["#02563d", "#059669", "#10b981", "#02563d"],
    fontSize = "inherit",
    fontWeight = "inherit",
}: AnimatedTextProps) {
    const [displayText, setDisplayText] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const loopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Reset states when text or animation changes
        setDisplayText("");
        setIsVisible(false);
        setIsComplete(false);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (loopTimeoutRef.current) {
            clearTimeout(loopTimeoutRef.current);
            loopTimeoutRef.current = null;
        }

        if (animation === "typewriter" || animation === "letter-by-letter") {
            timeoutRef.current = setTimeout(() => {
                setIsVisible(true);

                const startTyping = () => {
                    let index = 0;
                    intervalRef.current = setInterval(() => {
                        if (index < text.length) {
                            setDisplayText(text.slice(0, index + 1));
                            index++;
                        } else {
                            setIsComplete(true);
                            if (intervalRef.current) {
                                clearInterval(intervalRef.current);
                                intervalRef.current = null;
                            }
                            // Only loop if loop is true
                            if (loop) {
                                loopTimeoutRef.current = setTimeout(() => {
                                    setDisplayText("");
                                    setIsComplete(false);
                                    startTyping(); // Restart the animation
                                }, 2000);
                            }
                        }
                    }, speed);
                };

                startTyping();
            }, delay);
        } else {
            timeoutRef.current = setTimeout(() => {
                setIsVisible(true);
                setDisplayText(text);
                setIsComplete(true);
            }, delay);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (loopTimeoutRef.current) {
                clearTimeout(loopTimeoutRef.current);
                loopTimeoutRef.current = null;
            }
        };
    }, [text, animation, speed, delay, loop]);

    const getAnimationClasses = () => {
        switch (animation) {
            case "gradient":
                return "animate-gradient-text bg-clip-text text-transparent bg-gradient-to-r";
            case "shimmer":
                return "animate-shimmer bg-clip-text text-transparent bg-gradient-to-r";
            case "fade-in":
                return isVisible ? "animate-fade-in opacity-100" : "opacity-0";
            case "bounce":
                return isVisible ? "animate-bounce" : "opacity-0";
            case "glow":
                return "animate-pulse";
            case "slide-up":
                return isVisible
                    ? "animate-slide-up opacity-100"
                    : "opacity-0 translate-y-4";
            case "stunning":
                return "text-stunning-effect animate-text-glow-intense";
            case "rainbow":
                return "animate-text-rainbow";
            case "glow-intense":
                return "animate-text-glow-intense";
            case "typewriter":
            case "letter-by-letter":
                return "";
            default:
                return "";
        }
    };

    const getGradientStyle = () => {
        if (animation === "gradient" || animation === "shimmer") {
            return {
                backgroundImage: `linear-gradient(to right, ${gradientColors.join(", ")})`,
                backgroundSize: "200% auto",
            };
        }
        return {};
    };

    return (
        <span
            className={cn(
                "inline-block",
                getAnimationClasses(),
                className
            )}
            style={{
                fontSize,
                fontWeight,
                ...getGradientStyle(),
            }}
        >
            {animation === "typewriter" || animation === "letter-by-letter"
                ? displayText
                : text}
            {animation === "typewriter" && !isComplete && (
                <span className="animate-pulse">|</span>
            )}
        </span>
    );
}

/* Animated Text with Multiple Words */
interface AnimatedWordsProps {
    words: string[];
    animation?: AnimationType;
    className?: string;
    staggerDelay?: number;
    speed?: number;
}

export function AnimatedWords({
    words,
    animation = "fade-in",
    className,
    staggerDelay = 100,
    speed = 50,
}: AnimatedWordsProps) {
    return (
        <span className={cn("inline-flex flex-wrap gap-2", className)}>
            {words.map((word, index) => (
                <AnimatedText
                    key={index}
                    text={word}
                    animation={animation}
                    delay={index * staggerDelay}
                    speed={speed}
                />
            ))}
        </span>
    );
}

/* Rotating Text Animation */
interface RotatingTextProps {
    texts: string[];
    className?: string;
    rotationSpeed?: number;
    fontSize?: string;
    fontWeight?: string;
    animation?: AnimationType;
}

export function RotatingText({
    texts,
    className,
    rotationSpeed = 3000,
    fontSize = "inherit",
    fontWeight = "inherit",
    animation = "fade-in",
}: RotatingTextProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % texts.length);
                setIsAnimating(false);
            }, 300); // Half of fade transition
        }, rotationSpeed);

        return () => clearInterval(interval);
    }, [texts.length, rotationSpeed]);

    return (
        <span
            className={cn("inline-block", className, isAnimating && "opacity-0 transition-opacity duration-300")}
            style={{ fontSize, fontWeight }}
        >
            <AnimatedText
                key={currentIndex}
                text={texts[currentIndex]}
                animation={animation}
                speed={30}
                fontSize={fontSize}
                fontWeight={fontWeight}
            />
        </span>
    );
}

