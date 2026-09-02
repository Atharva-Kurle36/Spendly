"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

type SectionId = "closed" | "opening" | "cash" | "debit" | "credit";

interface WalletSection {
    id: SectionId;
    badge: string;
    title: string;
    description: string;
    actions?: { label: string; variant: "primary" | "secondary"; onClick?: () => void }[];
}

const SECTIONS: WalletSection[] = [
    {
        id: "closed",
        badge: "Your money, organized",
        title: "One wallet. Every rupee accounted for.",
        description:
            "Scroll down and watch your wallet come to life — the same way this app brings your scattered spending into one clear view.",
    },
    {
        id: "opening",
        badge: "Step one",
        title: "It all starts by opening up",
        description:
            "Connect your accounts once. From there, every transaction flows into a single, organized view — no more digging through five different apps.",
    },
    {
        id: "cash",
        badge: "Cash spending",
        title: "Even the cash you spend, tracked",
        description:
            "Log a cash expense in seconds and it's categorized instantly — so the money you can't see moving is still money you can see adding up.",
        actions: [
            { label: "Get started free", variant: "primary" }
        ],
    }
];

export default function WalletScrollReveal({ className }: { className?: string }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const rafId = useRef<number>(undefined);
    const scrollWrapperRef = useRef<HTMLDivElement>(null);

    const updateActiveSection = useCallback(() => {
        const viewportCenter = window.innerHeight / 2;
        let closestIndex = 0;
        let minDistance = Infinity;

        sectionRefs.current.forEach((ref, index) => {
            if (!ref) return;
            const rect = ref.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const distance = Math.abs(center - viewportCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        setActiveIndex(closestIndex);
    }, []);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                rafId.current = requestAnimationFrame(() => {
                    updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        updateActiveSection();
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [updateActiveSection]);

    const isOpen = activeIndex >= 1;
    const showCash = activeIndex >= 2;

    return (
        <div className={cn("relative w-full max-w-7xl mx-auto py-12 md:py-0 md:flex md:items-start", className)} ref={scrollWrapperRef}>

            {/* Scrollable text sections (Left Side) */}
            <div className="relative z-20 w-full md:w-[50%] lg:w-[60%] order-2 md:order-1">
                {SECTIONS.map((section, index) => (
                    <section
                        key={section.id}
                        ref={(el) => { sectionRefs.current[index] = el; }}
                        className="relative min-h-[60vh] md:min-h-screen flex flex-col justify-center px-4 md:px-12 backdrop-blur-sm md:backdrop-blur-none bg-paper/50 md:bg-transparent rounded-2xl md:rounded-none my-12 md:my-0 pb-12 md:pb-0"
                    >
                        <p className="text-sm font-bold text-[--accent] mb-3 tracking-wider uppercase">{section.badge}</p>
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight text-ink">{section.title}</h2>
                        <p className="text-base md:text-lg text-ink/70 leading-relaxed mb-6 font-medium">{section.description}</p>
                        {section.actions && (
                            <div className="flex flex-wrap gap-3 pointer-events-auto">
                                {section.actions.map((action) => (
                                    <button
                                        key={action.label}
                                        onClick={action.onClick}
                                        className={cn(
                                            "px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm",
                                            action.variant === "primary"
                                                ? "text-white hover:shadow-lg"
                                                : "border-2 border-ink/10 text-ink hover:bg-ink/5"
                                        )}
                                        style={action.variant === "primary" ? { backgroundColor: "var(--accent)" } : {}}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>
                ))}
            </div>

            {/* STICKY VISUAL CONTAINER (Right Side) */}
            <div className="w-full md:w-[50%] lg:w-[40%] order-1 md:order-2 sticky top-24 md:top-[40vh] h-[250px] md:h-auto z-10 flex justify-center items-start pointer-events-none perspective-[1500px]">
                <div
                    className="relative w-[280px] h-[190px] transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] drop-shadow-2xl"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: isOpen ? "rotateX(25deg) rotateY(-20deg) rotateZ(5deg)" : "rotateX(15deg) rotateY(-5deg) rotateZ(2deg)"
                    }}
                >
                    {/* Wallet back panel (with 3D thickness) */}
                    <div
                        className="absolute inset-0 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        style={{ backgroundColor: "var(--wallet-body)", transform: "translateZ(-2px)" }}
                    />

                    {/* Cards stack */}
                    <div
                        className={cn(
                            "absolute left-4 right-4 h-[110px] rounded-xl shadow-xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border border-white/20",
                            "motion-reduce:transition-opacity motion-reduce:transform-none motion-reduce:!rotate-0",
                            showCash ? "top-[-45px] opacity-100 rotate-[-4deg]" : "top-2 opacity-0 rotate-0"
                        )}
                        style={{ backgroundColor: "var(--card-cash)", transform: "translateZ(10px)" }}
                    />

                    {/* Wallet front flap */}
                    <div
                        className={cn(
                            "absolute inset-0 rounded-2xl shadow-2xl origin-bottom transition-all duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] border border-white/10 flex items-end justify-center pb-2",
                            "motion-reduce:transition-opacity motion-reduce:transform-none"
                        )}
                        style={{
                            backgroundColor: "var(--wallet-flap)",
                            transform: isOpen ? "translateZ(40px) rotateX(-125deg)" : "translateZ(40px) rotateX(0deg)",
                            opacity: isOpen ? 0.95 : 1
                        }}
                    >
                        {/* Small metallic wallet clasp/button */}
                        <div className="w-12 h-2.5 rounded-full bg-white/20 border border-white/30 shadow-inner" />
                    </div>
                </div>
            </div>

        </div>
    );
}
