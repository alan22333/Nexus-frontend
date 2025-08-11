import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./styles/neumorphism.css";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import GlobalErrorHandler from "./components/GlobalErrorHandler";
import BackToTop from "./components/BackToTop";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nexus Forum",
  description: "A modern forum application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-100 neumorphism-content`}
      >
        <ErrorBoundary>
          <GlobalErrorHandler />
          <ThemeProvider>
            <AuthProvider>
              <SidebarProvider>
                <div className="flex flex-1">
                  <Sidebar />
                  <main className="flex-1 flex flex-col ml-64">
                    {children}
                    <Footer />
                  </main>
                </div>
                <BackToTop />
              </SidebarProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
