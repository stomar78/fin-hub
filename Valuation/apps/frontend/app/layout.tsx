import type { ReactNode } from 'react';
import "../styles/theme.css";
import "../styles/components.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import RouteContainer from "../components/ui/RouteContainer";
import Breadcrumbs from "../components/ui/Breadcrumbs";

export const metadata = { title: 'Valuation Wizard' };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, Arial', margin: 0 }}>
        <a href="#main" className="skip-link">Skip to content</a>
        <Navbar />
        <Breadcrumbs />
        <main id="main">
          <RouteContainer>
            {children}
          </RouteContainer>
        </main>
        <Footer />
      </body>
    </html>
  );
}
