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
    heightClass?: string;
}

const SECTIONS: WalletSection[] = [
    {
        id: "closed",
        badge: "Your money, organized",
        title: "One wallet. Every rupee accounted for.",
        description:
            "Cash in hand, money on cards, bills waiting to be paid — normally that's three different mental tabs open at once. Scroll down and watch what happens when it all lives in one place instead.",
        heightClass: "min-h-screen",
    },
    {
        id: "opening",
        badge: "Step one — connect",
        title: "It all starts by opening up",
        description:
            "Link your bank accounts and cards once. From that moment, every transaction — big or small, planned or impulsive — flows automatically into a single, organized view. No manual entry, no spreadsheets, no five different banking apps to check every morning.",
        actions: [{ label: "See how connecting works", variant: "secondary" }],
        heightClass: "min-h-[120vh]",
    },
    {
        id: "cash",
        badge: "Cash spending",
        title: "Even the cash you spend, tracked",
        description:
            "Cash is the money that usually disappears without a trace — the chai, the auto fare, the quick cash tip. Log it in seconds right after you spend it, and it's categorized instantly alongside everything else, so it stops vanishing from the picture entirely.",
        heightClass: "min-h-screen",
    },
    {
        id: "debit",
        badge: "Debit card",
        title: "Everyday spending, understood",
        description:
            "Every swipe and UPI payment is categorized the moment it happens — groceries, food delivery, subscriptions, transport. Instead of finding out where your salary went at the end of the month, you see it building in real time, day by day.",
        actions: [{ label: "See how categorization works", variant: "secondary" }],
        heightClass: "min-h-[120vh]",
    },
    {
        id: "credit",
        badge: "Credit card",
        title: "Bills and credit, kept in check",
        description:
            "Track credit card spend against your budget in real time, and get an alert before a bill catches you off guard.",
        actions: [
            { label: "Get started free", variant: "primary" },
            { label: "Learn more", variant: "secondary" },
        ],
        heightClass: "min-h-screen",
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
    const showDebit = activeIndex >= 3;
    const showCredit = activeIndex >= 4;

    return (
        <div className={cn("relative w-full max-w-7xl mx-auto py-12 md:py-0 md:flex md:items-start mb-[30vh] md:mb-[40vh]", className)} ref={scrollWrapperRef}>

            {/* Scrollable text sections (Left Side) */}
            <div className="relative z-20 w-full md:w-[50%] lg:w-[60%] order-2 md:order-1">
                {SECTIONS.map((section, index) => (
                    <section
                        key={section.id}
                        ref={(el) => { sectionRefs.current[index] = el; }}
                        className={cn("relative flex flex-col justify-center px-4 md:px-12 backdrop-blur-sm md:backdrop-blur-none bg-paper/50 md:bg-transparent rounded-2xl md:rounded-none my-12 md:my-0 pb-12 md:pb-0", section.heightClass || "min-h-[60vh] md:min-h-screen")}
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
                    {/* Wallet back panel */}
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
                    <div
                        className={cn(
                            "absolute left-4 right-4 h-[110px] rounded-xl shadow-xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] delay-100 border border-white/20",
                            "motion-reduce:transition-opacity motion-reduce:transform-none motion-reduce:!rotate-0",
                            showDebit ? "top-[-15px] opacity-100 rotate-[2deg]" : "top-6 opacity-0 rotate-0"
                        )}
                        style={{ backgroundColor: "var(--card-debit)", transform: "translateZ(20px)" }}
                    />
                    <div
                        className={cn(
                            "absolute left-4 right-4 h-[110px] rounded-xl shadow-xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] delay-200 border border-white/20",
                            "motion-reduce:transition-opacity motion-reduce:transform-none motion-reduce:!rotate-0",
                            showCredit ? "top-[15px] opacity-100 rotate-[-2deg]" : "top-10 opacity-0 rotate-0"
                        )}
                        style={{ backgroundColor: "var(--card-credit)", transform: "translateZ(30px)" }}
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
                        {/* Clasp */}
                        <div className="w-12 h-2.5 rounded-full bg-white/20 border border-white/30 shadow-inner" />
                    </div>
                </div>
            </div>

        </div>
    );
}
