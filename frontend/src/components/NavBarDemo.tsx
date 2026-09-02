"use client";

import { Home, Lightbulb, TrendingUp, Info } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "How It Works", url: "/#how-it-works", icon: Lightbulb },
    { name: "Why Spendly", url: "/#stats", icon: TrendingUp },
    { name: "About", url: "/about", icon: Info },
];

import { usePathname } from "next/navigation";

export function AppNavBar() {
    const pathname = usePathname();

    // Hide the navbar inside the main interface (dashboard)
    if (pathname?.startsWith("/app")) {
        return null;
    }

    return <NavBar items={navItems} />;
}
