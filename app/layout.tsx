import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
	title: "GRE Vocab Builder",
	description: "Learn words with prefixes, suffixes, and roots",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Toaster />
				<Navbar />
				<main className="p-4">{children}</main>
			</body>
		</html>
	);
}
