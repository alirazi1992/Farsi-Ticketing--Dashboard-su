"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { LogOut, Settings, User } from "lucide-react"

export function UserMenu() {
  const { user, logout } = useAuth()

  if (!user) return null

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "مدیر سیستم"
      case "technician":
        return "تکنسین"
      case "client":
        return "کاربر"
      default:
        return role
    }
  }

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
            <AvatarFallback className="font-iran">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 font-iran" align="end" forceMount dir="rtl">
        <DropdownMenuLabel className="font-normal text-right">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none font-iran">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground font-iran">{getRoleLabel(user.role)}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-right font-iran">
          <User className="ml-2 h-4 w-4" />
          <span>پروفایل</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-right font-iran">
          <Settings className="ml-2 h-4 w-4" />
          <span>تنظیمات</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-right font-iran">
          <LogOut className="ml-2 h-4 w-4" />
          <span>خروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
