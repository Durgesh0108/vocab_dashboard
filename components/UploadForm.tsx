"use client";

import { useState } from "react";

export default function UploadForm() {
	const [file, setFile] = useState<File | null>(null);
	const [url, setUrl] = useState("");

	const handleUpload = async () => {
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		const res = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});

		const data = await res.json();
		setUrl(data.url);
	};

	return (
		<div className="space-y-4">
			<input
				type="file"
				accept="image/*,video/*,.pdf"
				onChange={(e) => setFile(e.target.files?.[0] || null)}
			/>
			<button
				onClick={handleUpload}
				className="bg-blue-600 text-white px-4 py-2 rounded"
			>
				Upload
			</button>

			{url && (
				<div className="mt-4">
					<p>Uploaded File URL:</p>
					<a
						href={url}
						target="_blank"
						className="text-blue-500 underline"
					>
						{url}
					</a>
				</div>
			)}
		</div>
	);
}
