"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { AppLogo } from "@/components/app-logo"
import { LayoutDashboard, ImageIcon, Settings, HelpCircle, Menu, X, Sparkles, History, Palette } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#fffef3]">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <AppLogo size={40} />
          </div>
          <div className="flex items-center space-x-4 ml-auto">{user && <ProfileDropdown />}</div>
        </div>
      </div>
      {/* Page content */}
      <main className="p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}

