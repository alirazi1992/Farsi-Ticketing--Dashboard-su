"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"

export function UserMenu() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      admin: "مدیر سیستم",
      technician: "تکنسین",
      client: "کاربر",
    }
    return roleLabels[role as keyof typeof roleLabels] || role
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2 font-iran">
          <ChevronDown className="h-4 w-4" />
          <div className="text-right">
            <div className="text-sm font-medium font-iran">{user.name}</div>
            <div className="text-xs text-muted-foreground font-iran">{getRoleLabel(user.role)}</div>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-iran">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 font-iran" align="end" dir="rtl">
        <DropdownMenuLabel className="text-right font-iran">حساب کاربری</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 text-sm text-muted-foreground">
          <div className="font-medium text-foreground font-iran">{user.name}</div>
          <div className="text-xs font-iran">{user.email}</div>
          {user.department && <div className="text-xs font-iran">{user.department}</div>}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-right font-iran cursor-pointer">
          <User className="ml-2 h-4 w-4" />
          پروفایل
        </DropdownMenuItem>

        <DropdownMenuItem className="text-right font-iran cursor-pointer">
          <Settings className="ml-2 h-4 w-4" />
          تنظیمات
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-right font-iran cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="ml-2 h-4 w-4" />
          خروج از سیستم
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
