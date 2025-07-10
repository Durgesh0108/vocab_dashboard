// "use client";

// import { useState } from "react";
// import { shuffle } from "lodash";
// import { toast } from "react-hot-toast";
// import FlashcardGame from "./FlashcardGame";

// type Word = {
// 	id: string;
// 	text: string;
// 	meaning: string;
// 	example?: string;
// 	synonyms?: string[];
// 	antonyms?: string[];
// };

// // Simulate real data
// const mockWords: Word[] = Array.from({ length: 100 }, (_, i) => ({
// 	id: String(i + 1),
// 	text: `Word ${i + 1}`,
// 	meaning: `Meaning of word ${i + 1}`,
// 	example: `Example usage for word ${i + 1}`,
// }));

// export default function FlashcardChunkGame({
// 	words = mockWords,
// }: {
// 	words?: Word[];
// }) {
// 	const [chunkSize, setChunkSize] = useState(20);
// 	const [groups, setGroups] = useState<Word[][]>([]);
// 	const [activeGroup, setActiveGroup] = useState(0);

// 	const handleCreateChunks = () => {
// 		if (chunkSize <= 0) {
// 			toast.error("Chunk size must be greater than 0");
// 			return;
// 		}

// 		const shuffled = shuffle(words); // shuffle full list
// 		const temp: Word[][] = [];

// 		for (let i = 0; i < shuffled.length; i += chunkSize) {
// 			temp.push(shuffle(shuffled.slice(i, i + chunkSize))); // shuffle each chunk
// 		}

// 		setGroups(temp);
// 		setActiveGroup(0);
// 		toast.success("New groups created!");
// 	};

// 	const handleRefresh = () => {
// 		handleCreateChunks();
// 	};

// 	return (
// 		<div className="px-4 py-6 space-y-6">
// 			{/* Controls */}
// 			<div className="flex gap-4 items-center">
// 				<input
// 					type="number"
// 					min={1}
// 					value={chunkSize}
// 					onChange={(e) => setChunkSize(parseInt(e.target.value))}
// 					placeholder="Chunk size"
// 					className="border px-3 py-1 rounded w-24"
// 				/>
// 				<button
// 					onClick={handleCreateChunks}
// 					className="bg-blue-600 text-white px-4 py-1 rounded"
// 				>
// 					Create Groups
// 				</button>
// 				<button
// 					onClick={handleRefresh}
// 					className="bg-purple-600 text-white px-4 py-1 rounded"
// 				>
// 					🔁 Refresh
// 				</button>
// 			</div>

// 			{/* Group Tabs */}
// 			{groups.length > 0 && (
// 				<div className="flex gap-2 border-b pb-2 overflow-x-auto">
// 					{groups.map((_, idx) => (
// 						<button
// 							key={idx}
// 							onClick={() => setActiveGroup(idx)}
// 							className={`px-3 py-1 rounded-t-md border-b-2 transition-all text-sm ${
// 								activeGroup === idx
// 									? "font-bold text-purple-600 border-purple-600"
// 									: "text-gray-500 border-transparent"
// 							}`}
// 						>
// 							Group {idx + 1}
// 						</button>
// 					))}
// 				</div>
// 			)}

// 			{/* Flashcard View */}
// 			{groups.length > 0 ? (
// 				<FlashcardGame words={groups[activeGroup]} />
// 			) : (
// 				<p className="text-gray-500 text-sm">
// 					Please create groups to begin
// 				</p>
// 			)}
// 		</div>
// 	);
// }

"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import FlashcardGame from "./FlashcardGame";

type Word = {
	id: string;
	text: string;
	meaning: string;
	example?: string;
	synonyms?: string[];
	antonyms?: string[];
};

export default function FlashcardChunkGame() {
	const [groups, setGroups] = useState<Word[][]>([]);
	const [activeGroup, setActiveGroup] = useState(0);
	const [loading, setLoading] = useState(false);

	const loadGroups = async () => {
		try {
			const res = await fetch("/api/flashcard/groups");
			const data = await res.json();
			setGroups(data);
			setActiveGroup(0);
		} catch (err) {
			console.log(err)
			toast.error("Failed to load flashcard groups");
		}
	};

	const handleHardShuffle = async () => {
		setLoading(true);
		const res = await fetch("/api/flashcard/shuffle", { method: "POST" });

		if (res.ok) {
			toast.success("Flashcards reshuffled!");
			await loadGroups(); // reload new groups
		} else {
			toast.error("Failed to reshuffle flashcards");
		}
		setLoading(false);
	};

	useEffect(() => {
		loadGroups();
	}, []);

	return (
		<div className="px-4 py-6 space-y-6">
			{/* Controls */}
			<div className="flex gap-4 items-center">
				<button
					onClick={handleHardShuffle}
					className="bg-purple-600 text-white px-4 py-1 rounded disabled:opacity-60"
					disabled={loading}
				>
					{loading ? "Shuffling..." : "🔁 Hard Shuffle"}
				</button>
			</div>

			{/* Group Tabs */}
			{groups.length > 0 && (
				<div className="flex gap-2 border-b pb-2 overflow-x-auto">
					{groups.map((_, idx) => (
						<button
							key={idx}
							onClick={() => setActiveGroup(idx)}
							className={`px-3 py-1 rounded-t-md border-b-2 transition-all text-sm ${
								activeGroup === idx
									? "font-bold text-purple-600 border-purple-600"
									: "text-gray-500 border-transparent"
							}`}
						>
							Group {idx + 1}
						</button>
					))}
				</div>
			)}

			{/* Flashcard View */}
			{groups.length > 0 ? (
				<FlashcardGame words={groups[activeGroup]} />
			) : (
				<p className="text-gray-500 text-sm">
					No flashcard groups found.
				</p>
			)}
		</div>
	);
}
