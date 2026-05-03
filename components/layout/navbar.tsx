'use client'

import React from 'react';
import Link from 'next/link'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { SearchBar } from "@/components/ui/searchbar"

const NAV_LINKS = [
    {href:'/', label: 'Home'},
    {href:'/authors', label: 'Authors'},
    {href: '/library', label: 'Library'},
    {href:'/dashboard', label: 'Dashboard'},
    {href:'/write', label: 'Write'},

]

export function Navbar (){
    return (
        <nav className="grid grid-cols-3 items-center p-4 border-b bg-background w-full">
            <div className="flex justify-start">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    Artisea
                </Link>
            </div>
            <div className="flex justify-center">
                <NavigationMenu>
                    <NavigationMenuList className="gap-2">
                        {NAV_LINKS.map((link) => (
                            <NavigationMenuItem key={link.href} className="min-w-[100px] flex justify-center">
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href={link.href} legacyBehavior passHref>
                                        {link.label}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu> 
            </div>
            <div className="flex justify-end items-center gap-4">
                <div className="hidden lg:block w-full max-w-[240px]">
                    <SearchBar />
                </div>
                <Link
                    href="/login"
                    className="whitespace-nowrap h-10 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-4 py-2 text-sm font-semibold hover:opacity-80 transition-opacity flex items-center justify-center"
                >
                    Sign In
                </Link>
            </div>

        </nav>
    )
}