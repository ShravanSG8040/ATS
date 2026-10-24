import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Talentifyx — hiring, in plain sight",
    template: "%s · Talentifyx",
  },
  description: "Find open roles and apply in minutes, or track every applicant from one recruiter dashboard.",
};

/* Runs before paint so the saved (or system) theme applies without a flash. */
const themeScript = `(function(){try{var t=localStorage.getItem('tfx-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Navbar />
        <main className="page">{children}</main>
        <footer className="footer">
          <div className="container footer-inner">
            <span>© {new Date().getFullYear()} Talentifyx</span>
            <nav className="footer-links" aria-label="Footer">
              <Link href="/jobs">Open roles</Link>
              <Link href="/dashboard">Recruiter dashboard</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
