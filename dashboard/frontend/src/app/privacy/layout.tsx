import "../globals.css";
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
  title: "Privacy Policy & Terms of Service",
  description: "See our privacy policy and terms of service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${jakarta.variable} ${jetbrainsMono.variable} antialiased`}>
      {children}
    </div>
  );
}
