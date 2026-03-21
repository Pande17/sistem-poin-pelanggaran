"use client";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconHome,
    IconClipboardList,
    IconFlag2,
    IconUser,
    IconUsers,
    IconSchool,
    IconFileText,
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
            label: "Jenis Pelanggaran",
            href: "/admin/jenis-pelanggaran",
            icon: <IconFlag2 className="h-6 w-6 shrink-0" />,
        },
        {
            label: "Data Siswa",
            href: "/admin/siswa",
            icon: <IconUsers className="h-6 w-6 shrink-0" />,
        },
        {
            label: "Data Guru",
            href: "/admin/guru",
            icon: <IconUser className="h-6 w-6 shrink-0" />,
        },
        {
            label: "Data Kelas",
            href: "/admin/kelas",
            icon: <IconSchool className="h-6 w-6 shrink-0" />,
        },
        {
            label: "Cetak Surat",
            href: "/admin/cetak-surat",
            icon: <IconFileText className="h-6 w-6 shrink-0" />,
        }
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

    const location = useLocation();

    return (
        <div
            className={cn(
                "mx-auto flex w-full flex-1 flex-col overflow-hidden bg-[#151829] md:flex-row",
                "h-screen"
            )}
        >
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <div className={cn("flex items-center pt-1 pb-4", open ? "gap-2 justify-start px-2" : "justify-center px-0")}>
                            <IconMenu2
                                className="cursor-pointer text-white h-6 w-6 shrink-0"
                                onClick={() => setOpen(!open)}
                            />
                            {open && <Logo />}
                        </div>
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => {
                                const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + '/');
                                return (
                                    <SidebarLink
                                        key={idx}
                                        link={link}
                                        className={isActive ? "bg-[#1e2238] text-white font-semibold" : ""}
                                    />
                                );
                            })}
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

            <div className="flex flex-1 flex-col bg-[#151829] overflow-hidden min-h-0 min-w-0">
                {/* Header Area */}
                <div className="flex flex-row h-16 shrink-0 items-center justify-between px-4 sm:px-6 lg:px-10 py-0 text-white gap-2">
                    <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        <div className="md:hidden flex shrink-0 items-center">
                            <IconMenu2
                                className="text-white cursor-pointer hover:opacity-80 transition-opacity w-6 h-6"
                                onClick={() => setOpen(!open)}
                            />
                        </div>
                        <h1 className="text-lg sm:text-xl font-semibold tracking-wide truncate">Dashboard | {title}</h1>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:block text-sm md:text-md font-medium uppercase">{username}</span>
                        <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white shrink-0">
                            <IconUser className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden md:rounded-tl-3xl bg-slate-50 shadow-inner min-h-0">
                    <div className="h-full w-full overflow-y-auto p-4 sm:p-6 md:p-10 content-wrapper">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
