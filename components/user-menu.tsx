"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { SettingsDialog } from "@/components/settings-dialog"
import { User, Settings, LogOut, Shield, Wrench } from "lucide-react"

export function UserMenu() {
  const { user, logout } = useAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)

  if (!user) return null

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-blue-600" />
      case "technician":
        return <Wrench className="w-4 h-4 text-green-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "مدیر سیستم"
      case "technician":
        return "تکنسین"
      default:
        return "کاربر"
    }
  }

  return (
    <>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name} />
              <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" alignOffset={-40} forceMount dir="rtl">
          <DropdownMenuLabel className="font-normal text-right p-4" dir="rtl">
            <div className="flex flex-col space-y-1 text-right">
              <p className="text-sm font-medium leading-none text-right">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground text-right">{user.email}</p>
              <div className="flex items-center gap-2 mt-1 justify-end">
                <span className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</span>
                {getRoleIcon(user.role)}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setSettingsOpen(true)}
            className="cursor-pointer text-right justify-end"
            dir="rtl"
          >
            <span className="ml-2">تنظیمات</span>
            <Settings className="h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-right justify-end" dir="rtl">
            <span className="ml-2">خروج</span>
            <LogOut className="h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
