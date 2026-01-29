import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "IOSH Professional Maturity Audit",
    description: "Global standard HSE competency assessment",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body>{children}</body>
        </html>
    );
}
