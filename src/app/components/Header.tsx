"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconWorldQuestion } from "@tabler/icons-react";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";

type NavItem = {
    name: string;
    link: string;
    icon: JSX.Element;
};

export default function Header() {
    const { user } = useAuthStore();

    const navItems: (NavItem | null)[] = [
        {
            name: "Home",
            link: "/",
            icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "Questions",
            link: "/questions",
            icon: <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        user ? {
            name: "Profile",
            link: `/users/${user.$id}/${slugify(user.name)}`,
            icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
        } : null,  // If no user, return null
    ];

    const filteredNavItems = navItems.filter((item): item is NavItem => item !== null); // Type guard

    return (
        <>
            <FloatingNav navItems={filteredNavItems} />
        </>
    );
}
