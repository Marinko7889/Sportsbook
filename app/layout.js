import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import PageWrapper from "./components/PageWrapper";
import ProtectedWrapper from "./components/ProtectedWrapper";
import { LocaleProvider } from "./context/LocaleContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const queryClient = new QueryClient();
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* <PageWrapper>{children}</PageWrapper> */}
        <LocaleProvider>
          <ProtectedWrapper>{children}</ProtectedWrapper>
        </LocaleProvider>
      </body>
    </html>
  );
}
