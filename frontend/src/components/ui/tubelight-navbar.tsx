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
                "fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100]",
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
                                    // if we are already on the page the hash targets
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
                                    // Smooth scroll to top if clicking Home while already on Home
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    window.history.pushState(null, '', '/');
                                }
                            }}
                            className={cn(
                                "relative cursor-pointer text-sm font-semibold px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-colors",
                                "text-[--nav-text]/80 hover:text-[--nav-accent]",
                                isActive && "text-[--nav-accent]",
                                isActive && prefersReducedMotion && "bg-[--nav-active-bg]"
                            )}
                        >
                            <span className="hidden md:inline relative z-10">{item.name}</span>
                            <span className="md:hidden relative z-10">
                                <Icon size={20} strokeWidth={2.5} />
                            </span>

                            {isActive && !prefersReducedMotion && (
                                <motion.div
                                    layoutId="lamp"
                                    className="absolute inset-0 w-full bg-[--nav-active-bg] rounded-full"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[--nav-accent] rounded-t-full">
                                        <div className="absolute w-12 h-6 bg-[--nav-accent]/20 rounded-full blur-md -top-2 -left-2" />
                                        <div className="absolute w-8 h-6 bg-[--nav-accent]/20 rounded-full blur-md -top-1" />
                                        <div className="absolute w-4 h-4 bg-[--nav-accent]/20 rounded-full blur-sm top-0 left-2" />
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
