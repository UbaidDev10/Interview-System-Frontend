"use client"
import { Link, useNavigate } from "react-router-dom"
import { Home, Calendar, User, LogOut, Briefcase, Menu } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import useUserProfile from "../../hooks/admin/useUserProfile"
import PropTypes from 'prop-types'

const Header = ({ activeTab }) => {
  const { profile } = useUserProfile()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const navigationItems = [
    { id: "home", label: "Home", icon: Home, href: "/user" },
    { id: "interviews", label: "Interviews", icon: Calendar, href: "/Interviews" },
  ]

  const NavItems = ({ mobile = false }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id

        return (
          <Link
            key={item.id}
            to={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            } ${mobile ? "w-full justify-start" : ""}`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </>
  )

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/user" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg group-hover:shadow-lg transition-shadow">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InterviewHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavItems />
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <AvatarImage src={profile?.profile_picture || "/placeholder.svg"} alt={profile?.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {profile?.name && <p className="font-medium">{profile.name}</p>}
                    {profile?.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{profile.email}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/user/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-6">
                  <div className="flex items-center gap-2 pb-4 border-b">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      InterviewHub
                    </span>
                  </div>
                  <nav className="flex flex-col gap-2">
                    <NavItems mobile />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
