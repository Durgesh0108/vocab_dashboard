"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
	const router = useRouter();

	const handleLogout = () => {
		document.cookie = "token=; Max-Age=0; path=/";
		router.push("/login");
	};

	const navItems = [
		{ label: "Dashboard", href: "/" },
		// { label: "Group Board", href: "/group-board" },
		// { label: "Add Word", href: "/add-word" },
		// { label: "Board", href: "/board" },
		// { label: "Search", href: "/search" },
	];

	return (
		<nav className="bg-blue-600 text-white p-4 sticky top-0 z-50 shadow">
			<div className="max-w-7xl mx-auto flex justify-between items-center">
				<div className="font-bold text-xl">GRE Vocab App</div>
				<div className="flex gap-6 items-center">
					{navItems?.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="hover:underline font-medium"
						>
							{item.label}
						</Link>
					))}
					<button
						onClick={handleLogout}
						className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
					>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
}
