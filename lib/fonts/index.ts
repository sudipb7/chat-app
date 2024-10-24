import localFont from "next/font/local";
import { Inter as FontSans, Instrument_Serif as FontSerif } from "next/font/google";

export const fontMono = localFont({
  src: "./GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontSerif = FontSerif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
});

export default {
  fontMono,
  fontSans,
  fontSerif,
};
