"use client";

import { toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { fetchSimilarAndOppositeWords } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchGeminiWordDetails } from "@/lib/gemini";

export function WordFormInline({ onWordAdded }: { onWordAdded: () => void }) {
	const [text, setText] = useState("");
	const [meaning, setMeaning] = useState("");
	const [synonyms, setSynonyms] = useState<string[]>([]);
	const [antonyms, setAntonyms] = useState<string[]>([]);
	const [example, setExample] = useState("");
	const [prefix, setPrefix] = useState("");
	const [suffix, setSuffix] = useState("");
	const [root, setRoot] = useState("");
	const [loading, setLoading] = useState(false);
	const [aiLoading, setAiLoading] = useState(false);

	// const handleFetchAI = async () => {
	// 	if (!text) return;
	// 	setAiLoading(true);
	// 	const data = await fetchSimilarAndOppositeWords(text);
	// 	setSynonyms(data.synonyms || []);
	// 	setAntonyms(data.antonyms || []);
	// 	setExample(data.example || "");
	// 	setAiLoading(false);
	// };
	

	const handleFetchAI = async () => {
		if (!text) return;
		setAiLoading(true);
		const data = await fetchGeminiWordDetails(text);
		setSynonyms(data.synonyms || []);
		setAntonyms(data.antonyms || []);
		setExample(data.example || "");
		setAiLoading(false);
	};


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const res = await fetch("/api/word/add", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				text,
				meaning,
				synonyms,
				antonyms,
				example,
				prefix,
				suffix,
				root,
			}),
		});

		setLoading(false);

		if (res.ok) {
			toast.success("Word added successfully");
			setText("");
			setMeaning("");
			setSynonyms([]);
			setAntonyms([]);
			setExample("");
			setPrefix("");
			setSuffix("");
			setRoot("");
			onWordAdded();
		} else {
			toast.error("Failed to add word");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 border rounded p-4 bg-white shadow-sm mb-4"
		>
			<Input
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="Word"
				required
			/>
			<Textarea
				value={meaning}
				onChange={(e) => setMeaning(e.target.value)}
				placeholder="Meaning"
				required
			/>

			<Button
				type="button"
				onClick={handleFetchAI}
				variant="secondary"
				disabled={!text || aiLoading}
			>
				{aiLoading
					? "Fetching AI Suggestions..."
					: "✨ Get AI Suggestions"}
			</Button>

			<div className="grid grid-cols-2 gap-4">
				<Input
					type="text"
					placeholder="Synonyms (comma-separated)"
					value={synonyms.join(", ")}
					onChange={(e) =>
						setSynonyms(
							e.target.value.split(",").map((s) => s.trim())
						)
					}
				/>
				<Input
					type="text"
					placeholder="Antonyms (comma-separated)"
					value={antonyms.join(", ")}
					onChange={(e) =>
						setAntonyms(
							e.target.value.split(",").map((a) => a.trim())
						)
					}
				/>
			</div>

			<Input
				type="text"
				placeholder="Example Sentence"
				value={example}
				onChange={(e) => setExample(e.target.value)}
			/>

			<div className="grid grid-cols-3 gap-4">
				<Input
					type="text"
					placeholder="Prefix"
					value={prefix}
					onChange={(e) => setPrefix(e.target.value)}
				/>
				<Input
					type="text"
					placeholder="Suffix"
					value={suffix}
					onChange={(e) => setSuffix(e.target.value)}
				/>
				<Input
					type="text"
					placeholder="Root"
					value={root}
					onChange={(e) => setRoot(e.target.value)}
				/>
			</div>

			<Button type="submit" className="w-full" disabled={loading}>
				{loading ? "Saving..." : "💾 Save Word"}
			</Button>
		</form>
	);
}
