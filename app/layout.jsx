"use client";

import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import CustomCursor from "@/components/CustomCursor/page";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>James Portfolio</title>
        <meta
          name="description"
          content="Welcome to my portfolio! Explore the projects and work I've done as a web developer. Discover my experience, skills, and passion for programming."
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <ThemeProvider enableSystem={true} attribute="class">
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}