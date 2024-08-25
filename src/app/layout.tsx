

import type { Metadata } from "next";

import { Inter as FontSans } from "next/font/google"
import "./globals.css";


import { cn } from "@/lib/utils"
import { Suspense } from "react";
import Loading from "./loading";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "My Panel CS",
  description: "My Panel CS gerencia todos os seus servidores de CS.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {

 
  return (
    
    <html lang="pt-BR" suppressHydrationWarning>
      <Suspense fallback={<Loading />}>
      <body className={cn(
          "font-sans antialiased",
          fontSans.variable
        )}>
        
        {children}
      </body>
      </Suspense>
    </html>
   
  );
}



