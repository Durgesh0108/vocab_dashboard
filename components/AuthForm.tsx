// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// type Props = {
// 	type: "login" | "signup";
// };

// export default function AuthForm({ type }: Props) {
// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");
// 	const router = useRouter();

// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();

// 		const res = await fetch(`/api/auth/${type}`, {
// 			method: "POST",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify({ email, password }),
// 		});

// 		if (res.ok) {
// 			router.push("/");
// 		} else {
// 			alert("Authentication failed");
// 		}
// 	};

// 	return (
// 		<form
// 			onSubmit={handleSubmit}
// 			className="max-w-md mx-auto p-4 border rounded space-y-4"
// 		>
// 			<h2 className="text-2xl font-bold">
// 				{type === "signup" ? "Sign Up" : "Login"}
// 			</h2>
// 			<input
// 				type="email"
// 				placeholder="Email"
// 				className="w-full border p-2 rounded"
// 				value={email}
// 				onChange={(e) => setEmail(e.target.value)}
// 				required
// 			/>
// 			<input
// 				type="password"
// 				placeholder="Password"
// 				className="w-full border p-2 rounded"
// 				value={password}
// 				onChange={(e) => setPassword(e.target.value)}
// 				required
// 			/>
// 			<button
// 				type="submit"
// 				className="w-full bg-blue-600 text-white p-2 rounded"
// 			>
// 				{type === "signup" ? "Create Account" : "Login"}
// 			</button>
// 		</form>
// 	);
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {
	type: "login" | "signup";
};

export default function AuthForm({ type }: Props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const res = await fetch(`/api/auth/${type}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		setLoading(false);
		if (res.ok) {
			router.push("/");
		} else {
			alert("Authentication failed");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6"
			>
				<h2 className="text-3xl font-bold text-center text-blue-700">
					{type === "signup" ? "Create an Account" : "Welcome Back"}
				</h2>

				<div className="space-y-4">
					<input
						type="email"
						placeholder="Email address"
						className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Password"
						className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{loading && <Loader2 className="w-4 h-4 animate-spin" />}
					{type === "signup" ? "Sign Up" : "Login"}
				</button>

				<p className="text-sm text-center text-gray-500">
					{type === "signup"
						? "Already have an account?"
						: "Don’t have an account?"}{" "}
					<a
						href={
							type === "signup" ? "/login" : "/signup"
						}
						className="text-blue-600 font-medium hover:underline"
					>
						{type === "signup" ? "Login" : "Sign Up"}
					</a>
				</p>
			</form>
		</div>
	);
}
