"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { fetchSimilarAndOppositeWords } from "@/lib/utils";

type Word = {
	id: string;
	text: string;
	meaning: string;
	synonyms?: string[];
	antonyms?: string[];
	example?: string;
	prefix?: string;
	suffix?: string;
	root?: string;
};

export function WordEditModal({
	word,
	onUpdated,
}: {
	word: Word;
	onUpdated: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [text, setText] = useState(word.text);
	const [meaning, setMeaning] = useState(word.meaning);
	const [synonyms, setSynonyms] = useState<string[]>(word.synonyms || []);
	const [antonyms, setAntonyms] = useState<string[]>(word.antonyms || []);
	const [example, setExample] = useState(word.example || "");
	const [prefix, setPrefix] = useState(word.prefix || "");
	const [suffix, setSuffix] = useState(word.suffix || "");
	const [root, setRoot] = useState(word.root || "");
	const [loading, setLoading] = useState(false);
	const [aiLoading, setAiLoading] = useState(false);

	const handleFetchAI = async () => {
		if (!text) return;
		setAiLoading(true);
		const data = await fetchSimilarAndOppositeWords(text);
		setSynonyms(data.synonyms || []);
		setAntonyms(data.antonyms || []);
		setExample(data.example || "");
		setAiLoading(false);
	};

	const handleUpdate = async () => {
		setLoading(true);
		const res = await fetch("/api/word/update", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: word.id,
				update: {
					text,
					meaning,
					synonyms,
					antonyms,
					example,
					prefix,
					suffix,
					root,
				},
			}),
		});
		setLoading(false);
		if (res.ok) {
			toast.success("Word updated");
			onUpdated();
			setOpen(false);
		} else {
			toast.error("Update failed");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="text-gray-600 hover:text-yellow-600"
				>
					✏️
				</Button>
			</DialogTrigger>

			<DialogContent
				className="w-[800px]"
				style={{
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					position: "fixed",
				}}
			>
				<h2 className="text-lg font-semibold mb-3">✏️ Edit Word</h2>
				<form
					className="space-y-4"
					onSubmit={(e) => e.preventDefault()}
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
						variant="secondary"
						onClick={handleFetchAI}
						disabled={aiLoading}
					>
						{aiLoading ? "Fetching AI..." : "✨ Get AI Suggestions"}
					</Button>

					<div className="grid grid-cols-2 gap-4">
						<Input
							placeholder="Synonyms (comma-separated)"
							value={synonyms.join(", ")}
							onChange={(e) =>
								setSynonyms(
									e.target.value
										.split(",")
										.map((s) => s.trim())
								)
							}
						/>
						<Input
							placeholder="Antonyms (comma-separated)"
							value={antonyms.join(", ")}
							onChange={(e) =>
								setAntonyms(
									e.target.value
										.split(",")
										.map((s) => s.trim())
								)
							}
						/>
					</div>

					<Input
						placeholder="Example sentence"
						value={example}
						onChange={(e) => setExample(e.target.value)}
					/>

					<div className="grid grid-cols-3 gap-4">
						<Input
							placeholder="Prefix"
							value={prefix}
							onChange={(e) => setPrefix(e.target.value)}
						/>
						<Input
							placeholder="Suffix"
							value={suffix}
							onChange={(e) => setSuffix(e.target.value)}
						/>
						<Input
							placeholder="Root"
							value={root}
							onChange={(e) => setRoot(e.target.value)}
						/>
					</div>

					<Button
						type="button"
						onClick={handleUpdate}
						disabled={loading}
						className="w-full"
					>
						{loading ? "Saving..." : "💾 Update Word"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
