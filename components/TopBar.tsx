"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-8",
        isScrolled ? "bg-white shadow-sm" : "bg-transparent",
      )}
      data-cy="navbar"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - Visible on both mobile and desktop */}
        <Link href="/" className="flex items-center z-20" data-cy="navbar-logo">
          <div className="absolute h-16 w-44">
            <Image src="/logo.png" alt="Trekking Miles" fill className="object-contain" priority />
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-20"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          data-cy="mobile-menu-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 mr-5">
          <Link href="/about" className="text-dark-green hover:text-gray-900 font-Raleway font-medium text-lg" data-cy="nav-about">
            About
          </Link>
          <Link href="/testimonial" className="text-dark-green hover:text-gray-900 font-Raleway font-medium text-lg" data-cy="nav-testimonial">
            Testimonial
          </Link>
          <Link href="/pricing" className="text-dark-green hover:text-gray-900 font-Raleway font-medium text-lg" data-cy="nav-pricing">
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-dark-green hover:text-gray-900 font-Raleway font-medium text-lg"
            data-cy="nav-login"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-dark-green text-white px-5 py-2 rounded-full font-medium hover:bg-gray-900 transition-colors font-Poppins"
            data-cy="nav-signup"
          >
            Sign up
          </Link>
        </nav>

        {/* Mobile Navigation - Fixed positioning to center it */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-10 flex items-center justify-center">
            <nav className="flex flex-col gap-6 items-center">
              <Link
                href="/about"
                className="text-dark-green hover:text-gray-900 font-medium py-2 font-Raleway"
                data-cy="mobile-nav-about"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/testimonial"
                className="text-dark-green hover:text-gray-900 font-medium py-2 font-Raleway"
                data-cy="mobile-nav-testimonial"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonial
              </Link>
              <Link
                href="/pricing"
                className="text-dark-green hover:text-gray-900 font-medium py-2 font-Raleway"
                data-cy="mobile-nav-pricing"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="text-dark-green px-6 py-2 font-medium hover:bg-gray-50 transition-colors w-40 text-center font-Raleway"
                data-cy="mobile-nav-login"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-dark-green text-white px-6 py-2 rounded-full font-medium hover:bg-gray-900 transition-colors w-40 text-center font-Poppins"
                data-cy="mobile-nav-signup"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

