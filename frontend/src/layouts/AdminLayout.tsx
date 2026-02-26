"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconHome,
    IconClipboardList,
    IconFlag,
    IconUsersGroup,
    IconUser,
    IconLogout2,
    IconMenu2,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { logout } from "@/utils/auth";

export const Logo = () => {
    return (
        <a
            href="/admin/dashboard"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
        >
            {/* <div className="h-6 w-6 shrink-0 rounded-tl-lg rounded-br-lg bg-white" /> */}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold whitespace-pre text-white text-2xl"
            >
                GradePoint
            </motion.span>
        </a>
    );
};

export const LogoIcon = () => {
    return (
        <a
            href="/admin/dashboard"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
        >
            <div className="h-6 w-6 shrink-0 rounded-tl-lg rounded-br-lg bg-white" />
        </a>
    );
};

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const links = [
        {
            label: "Dashboard",
            href: "/admin/dashboard",
            icon: <IconHome className="h-6 w-6 shrink-0" />,
        },
        {
            label: "Data Pelanggaran",
            href: "/admin/pelanggaran",
            icon: <IconClipboardList className="h-6 w-6 shrink-0" />,
        },
        {
            label: "Data Siswa",
            href: "/admin/siswa",
            icon: <IconUsersGroup className="h-6 w-6 shrink-0" />,
        },
        {
            label: "Jenis Pelanggaran",
            href: "/admin/jenis-pelanggaran",
            icon: <IconFlag className="h-6 w-6 shrink-0" />,
        },
        {
            label: "Data Guru",
            href: "/admin/guru",
            icon: <IconUser className="h-6 w-6 shrink-0" />,
        },
    ];

    const [open, setOpen] = useState(true);

    let username = "Admin";
    try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            username = user?.username || user?.nama || user?.name || "Admin";
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
    }

    return (
        <div
            className={cn(
                "mx-auto flex w-full flex-1 flex-col overflow-hidden bg-[#151829] md:flex-row",
                "h-screen"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        <div className={cn("flex items-center pt-1 pb-4", open ? "gap-2 justify-start px-2" : "justify-center px-0")}>
                            <IconMenu2
                                className="cursor-pointer text-white h-6 w-6 shrink-0"
                                onClick={() => setOpen(!open)}
                            />
                            {open && <Logo />}
                        </div>
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div className="mt-auto">
                        <SidebarLink
                            link={{
                                label: "Logout",
                                icon: <IconLogout2 className="h-6 w-6 shrink-0" />,
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                logout();
                            }}
                            className="font-semibold text-md cursor-pointer hover:bg-red-700 dark:hover:bg-red-700 hover:text-white dark:hover:text-white transition-all duration-200"
                        />
                    </div>
                </SidebarBody>
            </Sidebar>

            <div className="flex flex-1 flex-col bg-[#151829]">
                {/* Header Area */}
                <div className="flex h-16 items-center justify-between px-6 lg:px-10 text-white">
                    <h1 className="text-xl font-semibold tracking-wide">{title}</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-md font-medium uppercase">{username}</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white">
                            <IconUser className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-1 overflow-hidden rounded-tl-3xl bg-slate-50 shadow-inner">
                    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-6 md:p-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
