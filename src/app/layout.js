import localFont from "next/font/local";
//import "./globals.css";
import "./css/app.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const gantari = localFont({
  src: "./fonts/font-gantari.woff2",
  variable: "--font-gantari",
  weight: "100 900",
});
const gantariItalic = localFont({
  src: "./fonts/font-gantari-italic.woff2",
  variable: "--font-gantari-italic",
  weight: "100 900",
});

export const metadata = {
  title: "Volumio Swish",
  description: "Simple UI for Volumio + Tidal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${gantari.variable} ${gantariItalic.variable}`}>
        {children}
      </body>
    </html>
  );
}
