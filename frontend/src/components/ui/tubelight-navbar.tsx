"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    name: string;
    url: string;
    icon: LucideIcon;
}

interface NavBarProps {
    items: NavItem[];
    className?: string;
    isLoggedIn?: boolean;
}

export function NavBar({ items, className, isLoggedIn }: NavBarProps) {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState(items[0].name);
    const [isMobile, setIsMobile] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Sync active tab with the actual current route.
    useEffect(() => {
        // Wait for hash to be available on client
        const hash = window.location.hash;
        const currentPathWithHash = pathname + hash;

        const match = items.find((item) => {
            if (item.url === currentPathWithHash) return true;
            if (item.url === "/" && currentPathWithHash === "/") return true;
            if (item.url !== "/" && pathname.startsWith(item.url)) return true;
            return false;
        });

        if (match) {
            setActiveTab(match.name);
        }
    }, [pathname, items]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);

        // Check for reduced motion
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);
        const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener("change", handleChange);

        return () => {
            window.removeEventListener("resize", handleResize);
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return (
        <div
            className={cn(
                "relative z-[100] flex justify-center pt-4 sm:pt-6",
                className
            )}
        >
            <div className="flex items-center gap-2 md:gap-3 bg-[--nav-bg] border border-[--nav-border] backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;

                    return (
                        <Link
                            key={item.name}
                            href={item.url}
                            onClick={(e) => {
                                setActiveTab(item.name);
                                const isHash = item.url.includes('#');
                                if (isHash) {
                                    const path = item.url.split('#')[0];
                                    const hash = item.url.split('#')[1];
                                    if (path === pathname || (path === '/' && pathname === '/')) {
                                        e.preventDefault();
                                        const el = document.getElementById(hash);
                                        if (el) {
                                            const y = el.getBoundingClientRect().top + window.scrollY - 100;
                                            window.scrollTo({ top: y, behavior: 'smooth' });
                                            window.history.pushState(null, '', item.url);
                                        }
                                    }
                                } else if (item.url === '/' && pathname === '/') {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    window.history.pushState(null, '', '/');
                                }
                            }}
                            className={cn(
                                "group relative cursor-pointer text-sm font-semibold px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-colors",
                                "text-[--nav-text] opacity-80 hover:opacity-100",
                                isActive && "opacity-100 text-mint"
                            )}
                        >
                            {/* Hover Backdrop tint (non-active links only) */}
                            {!isActive && (
                                <div className="absolute inset-0 w-full h-full bg-mint rounded-full opacity-0 group-hover:opacity-[0.03] transition-opacity" />
                            )}

                            <span className="hidden md:inline relative z-10">{item.name}</span>
                            <span className="md:hidden relative z-10">
                                <Icon size={20} strokeWidth={2.5} />
                            </span>

                            {/* Active State Background & Tubelight Glow */}
                            {isActive && (
                                <motion.div
                                    layoutId={prefersReducedMotion ? undefined : "lamp"}
                                    className="absolute inset-0 w-full h-full rounded-full"
                                    initial={false}
                                    transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    {/* Active background subtle tint (8% opacity) */}
                                    <div className="absolute inset-0 w-full h-full bg-mint opacity-[0.08] rounded-full" />

                                    {/* Glowing top line / fixture */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-mint rounded-full">
                                        {/* Blurred light spills beneath the bar */}
                                        <div className="absolute w-12 h-5 bg-mint opacity-[0.35] rounded-full blur-[5px] -top-1 -left-2" />
                                        <div className="absolute w-8 h-4 bg-mint opacity-[0.4] rounded-full blur-[3px] top-0 left-0" />
                                    </div>
                                </motion.div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
