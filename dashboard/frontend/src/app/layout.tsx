import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CSPostHogProvider } from "./provider";
import { JetBrains_Mono } from 'next/font/google';
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: "Cosmic Notebook",
  description: "Ship AI workflows with Cosmic Notebook",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable}`}>
      <CSPostHogProvider>
        <body
          className={`${jakarta.variable} ${jetbrainsMono.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
