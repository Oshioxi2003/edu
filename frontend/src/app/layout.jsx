import "./globals.scss";
import "../styles/tailwind.css";
import "../styles/hydration-fix.css";
import {
  Plus_Jakarta_Sans,
} from "next/font/google";
import HydrationBoundary from "../components/common/HydrationBoundary";
import AppProviders from "../providers/AppProviders";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: ["--tp-ff-body", "--tp-ff-heading"],
});

export const metadata = {
  title: "IELTS Listening Platform - Luyện IELTS Listening Chuẩn Quốc Tế",
  description: "Nền tảng học IELTS Listening trực tuyến với 500+ bài tập, chấm điểm tự động và theo dõi tiến độ chi tiết",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning={true}>
      <body className={plusJakartaSans.variable}>
        <AppProviders>
          <HydrationBoundary>
            {children}
          </HydrationBoundary>
        </AppProviders>
      </body>
    </html>
  );
}
