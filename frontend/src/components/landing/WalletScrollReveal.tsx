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
        heightClass: "min-h-[120vh]",
    },
    {
        id: "cash",
        badge: "Cash spending",
        title: "Even the cash you spend, tracked",
        description:
            "Cash is the money that usually disappears without a trace — the chai, the auto fare, the quick cash tip. Log it in seconds right after you spend it, and it's categorized instantly alongside everything else, so it stops vanishing from the picture entirely.",
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
    const showDebit = activeIndex >= 2;
    const showCredit = activeIndex >= 3;
    const showCash = activeIndex >= 4;

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
                    className="relative w-[280px] h-[190px] transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] drop-shadow-[0_40px_40px_rgba(0,0,0,0.5)]"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: isOpen ? "rotateX(25deg) rotateY(-20deg) rotateZ(5deg)" : "rotateX(15deg) rotateY(-5deg) rotateZ(2deg)"
                    }}
                >
                    {/* Wallet back panel (Matte Black Leather styling) */}
                    <div
                        className="absolute inset-0 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-[#ffffff10]"
                        style={{
                            background: "linear-gradient(135deg, #1c1c1c 0%, #0a0a0a 100%)",
                            boxShadow: "inset 0 0 0 1px #000, inset 0 0 0 3px #1a1a1a, 0 30px 60px rgba(0,0,0,0.6)",
                            transform: "translateZ(-2px)"
                        }}
                    />

                    {/* Cards stack */}

                    {/* Debit Card (Lowest Layer) */}
                    <div
                        className={cn(
                            "absolute left-4 right-4 h-[110px] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border border-[#ffffff20] p-3 flex flex-col justify-between overflow-hidden",
                            "motion-reduce:transition-opacity motion-reduce:transform-none motion-reduce:!rotate-0",
                            showDebit ? "top-[-60px] rotate-[-4deg]" : "top-[75px] rotate-0"
                        )}
                        style={{
                            background: "linear-gradient(120deg, #1e293b 0%, #0f172a 100%)",
                            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.4)",
                            transform: "translateZ(10px)"
                        }}
                    >
                        {/* Wavy light reflection */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-xl translate-x-10 -translate-y-10" />

                        <div className="flex justify-between items-start relative z-10">
                            <span className="text-white/90 font-bold text-[11px] tracking-widest flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-blue-400 opacity-80" /> SPENDLY
                            </span>
                            <span className="text-white/50 font-medium text-[9px] uppercase tracking-widest">Debit</span>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                            {/* Gold Chip */}
                            <div className="w-8 h-6 rounded-md bg-gradient-to-br from-[#dfc37f] to-[#aa8022] border border-[#ffdf73]/50 shadow-sm flex flex-col justify-evenly px-1 relative overflow-hidden">
                                <div className="absolute left-2 right-2 top-0 bottom-0 border-x border-black/10"></div>
                                <div className="h-[1px] w-full bg-black/20"></div>
                                <div className="h-[1px] w-full bg-black/20"></div>
                            </div>
                            {/* Contactless */}
                            <svg className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M5.5 16A8.5 8.5 0 0 1 5.5 8" />
                                <path d="M9 18a11 11 0 0 1 0-12" />
                                <path d="M12.5 20a13.5 13.5 0 0 1 0-16" />
                                <path d="M16 22a16 16 0 0 1 0-20" />
                            </svg>
                        </div>
                    </div>

                    {/* Credit Card (Middle Layer) */}
                    <div
                        className={cn(
                            "absolute left-4 right-4 h-[110px] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border border-[#ffffff30] p-3 flex flex-col justify-between overflow-hidden",
                            "motion-reduce:transition-opacity motion-reduce:transform-none motion-reduce:!rotate-0",
                            showCredit ? "top-[-30px] rotate-[2deg]" : "top-[75px] rotate-0"
                        )}
                        style={{
                            background: "radial-gradient(circle at 100% 0%, #612231 0%, #1a080d 100%)",
                            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.3)",
                            transform: "translateZ(20px)"
                        }}
                    >
                        {/* Premium Geometric Pattern */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,1) 10px, rgba(255,255,255,1) 11px)" }}></div>
                        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-white/20 opacity-40"></div>

                        <div className="flex justify-end relative z-10">
                            <span className="text-white/60 font-medium text-[9px] uppercase tracking-widest">Credit</span>
                        </div>
                        <div className="flex items-center gap-2 relative z-10">
                            {/* Silver Chip */}
                            <div className="w-8 h-6 rounded-md bg-gradient-to-br from-[#e0e0e0] to-[#888888] border border-white/40 shadow-sm flex flex-col justify-evenly px-1 relative overflow-hidden">
                                <div className="absolute inset-x-2 top-0 bottom-0 border-x border-black/10"></div>
                                <div className="h-[1px] w-full bg-black/20"></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-end relative z-10">
                            <span className="text-white/50 font-mono text-[11px] tracking-[0.15em]">**** 9283</span>
                            <span className="text-white/90 font-bold italic text-sm tracking-tighter">NYXA</span>
                        </div>
                    </div>

                    {/* Cash Stack (Highest Layer) */}
                    <div
                        className={cn(
                            "absolute left-4 right-4 h-[110px] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border border-[#ffffff15] overflow-visible",
                            "motion-reduce:transition-opacity motion-reduce:transform-none motion-reduce:!rotate-0",
                            showCash ? "top-[10px] rotate-[-2deg]" : "top-[75px] rotate-0"
                        )}
                        style={{
                            transform: "translateZ(30px)"
                        }}
                    >
                        {/* Bottom fake cash layer */}
                        <div className="absolute inset-0 top-1 bg-[#b8ab87] rounded-xl shadow-inner border border-[#fff]/10 translate-y-[3px] rotate-[1deg]" />
                        {/* Middle fake cash layer */}
                        <div className="absolute inset-0 top-1 bg-[#c5baa1] rounded-xl shadow-inner border border-[#fff]/20 translate-y-[1px] -rotate-[0.5deg]" />

                        {/* Top primary note */}
                        <div className="absolute inset-0 top-0 rounded-xl bg-gradient-to-br from-[#e8dec7] to-[#cac0a3] shadow-sm overflow-hidden" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)" }}>
                            {/* Engraved bill border */}
                            <div className="absolute inset-x-2 top-2 bottom-2 border border-[#818063]/60 rounded-md">
                                <div className="absolute inset-1 border border-[#818063]/30 rounded"></div>
                                {/* Corner art pieces */}
                                <div className="absolute top-0 left-0 w-6 h-6 border-r border-b border-[#818063]/40 rounded-br-full" />
                                <div className="absolute top-0 right-0 w-6 h-6 border-l border-b border-[#818063]/40 rounded-bl-full" />
                                <div className="absolute bottom-0 left-0 w-6 h-6 border-r border-t border-[#818063]/40 rounded-tr-full" />
                                <div className="absolute bottom-0 right-0 w-6 h-6 border-l border-t border-[#818063]/40 rounded-tl-full" />

                                {/* Center Watermark */}
                                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-[#818063]/20 flex items-center justify-center bg-[#818063]/5">
                                    <div className="w-12 h-12 rounded-full border border-[#818063]/10 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full border border-[#818063]/5" />
                                    </div>
                                </div>
                            </div>

                            {/* Paper Note Binder/Wrap Band */}
                            <div className="absolute left-[50%] -translate-x-1/2 top-0 bottom-0 w-10 bg-gradient-to-r from-[#e3e2cf] via-[#f5f4e6] to-[#d6d5c3] shadow-[0_0_15px_rgba(0,0,0,0.5)] border-x border-[#c2bda7] flex justify-center items-center rounded-sm">
                                <div className="w-full flex justify-center uppercase font-mono text-[9px] font-bold text-[#867f67] leading-none tracking-tight">₹1K</div>
                            </div>
                        </div>
                    </div>

                    {/* Inner Pocket (Hides the cards when they are retracted) */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-[115px] rounded-b-2xl rounded-t-lg border border-[#ffffff10] border-b-0 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]"
                        style={{
                            background: "linear-gradient(180deg, #1f1f1f 0%, #0a0a0a 100%)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 0 1px #000, 0 -10px 20px rgba(0,0,0,0.5)",
                            transform: "translateZ(35px)"
                        }}
                    >
                        {/* Pocket Stitching */}
                        <div className="absolute inset-1.5 border-b-0 border border-dashed border-[#ffffff0a] rounded-t-md pointer-events-none" />
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-black/40 to-transparent rounded-t-lg" />
                    </div>

                    {/* Wallet front flap Container (3D for front and back faces) */}
                    <div
                        className={cn(
                            "absolute inset-0 origin-bottom transition-all duration-[1100ms] ease-[cubic-bezier(0.34,1.1,0.64,1)]",
                            "motion-reduce:transition-opacity motion-reduce:transform-none"
                        )}
                        style={{
                            transformStyle: "preserve-3d",
                            transform: isOpen ? "translateZ(40px) rotateX(-125deg)" : "translateZ(40px) rotateX(0deg)",
                            opacity: isOpen ? 0.98 : 1
                        }}
                    >
                        {/* Flap Front Face (Outside) */}
                        <div
                            className="absolute inset-0 rounded-2xl shadow-2xl flex flex-col items-center pb-2 pt-8 overflow-hidden [backface-visibility:hidden]"
                            style={{
                                background: "linear-gradient(180deg, #282828 0%, #151515 100%)",
                                boxShadow: "inset 0 0 0 1px #000, inset 0 0 0 4px #1f1f1f, 0 10px 20px rgba(0,0,0,0.5)"
                            }}
                        >
                            {/* Leather Stitching */}
                            <div className="absolute inset-2 border border-dashed border-[#ffffff20] rounded-xl pointer-events-none" />
                            
                            {/* Embossed Brand Name (Gold Foil effect) */}
                            <div className="flex flex-col items-center justify-center opacity-90 mt-2">
                                <span className="font-display font-black tracking-[0.2em] text-[#d4af37] text-2xl select-none drop-shadow-sm" style={{ textShadow: "0px 1px 2px rgba(255,255,255,0.2), 0px -1px 1px rgba(0,0,0,0.8)" }}>
                                    WALLET
                                </span>
                                <div className="w-12 h-[1px] bg-black/60 my-1 shadow-[0_1px_0_rgba(212,175,55,0.3)]" />
                                <span className="font-sans font-bold tracking-[0.3em] text-[#d4af37] text-[8px] uppercase select-none drop-shadow-sm" style={{ textShadow: "0px 1px 1px rgba(255,255,255,0.1), 0px -1px 1px rgba(0,0,0,0.8)" }}>
                                    Spendly
                                </span>
                            </div>

                            {/* Clasp (Metallic snap button) */}
                            <div className="w-14 h-4 rounded-full bg-gradient-to-b from-[#777] to-[#222] border border-[#000] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_4px_6px_rgba(0,0,0,0.8)] mt-auto flex items-center justify-center">
                                <div className="w-10 h-1.5 rounded-full bg-gradient-to-b from-[#111] to-[#333] shadow-[inset_0_1px_1px_rgba(0,0,0,1)]" />
                            </div>
                        </div>

                        {/* Flap Back Face (Inside) */}
                        <div
                            className="absolute inset-0 rounded-2xl flex flex-col items-center pt-4 [backface-visibility:hidden]"
                            style={{
                                transform: "rotateX(180deg)",
                                background: "linear-gradient(180deg, #181818 0%, #0d0d0d 100%)",
                                boxShadow: "inset 0 0 0 1px #000, inset 0 20px 30px rgba(0,0,0,0.5)"
                            }}
                        >
                            {/* Inside Stitching */}
                            <div className="absolute inset-2 border border-dashed border-[#ffffff0a] rounded-xl pointer-events-none" />
                            
                            {/* Suede/Soft leather inner texture hint */}
                            <div className="absolute inset-3 bg-[#00000020] rounded-lg blur-sm pointer-events-none" />
                            
                            {/* Inner Clasp Mechanism */}
                            <div className="w-10 h-3 rounded-full bg-[#0a0a0a] shadow-[inset_0_2px_4px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.05)] border border-[#111]" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
