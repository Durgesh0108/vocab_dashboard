// import GroupBoard from "@/components/GroupBoard";

// export default function Home() {
// 	return (
// 		<div>
// 			<h1 className="text-2xl font-bold mb-4 px-4">Group Board</h1>
// 			<GroupBoard />
// 		</div>
// 	);
// }

// Step 1: Update `Home` component to support mode switching and tab rendering

"use client";
import { useEffect, useState } from "react";
import GroupBoard from "@/components/GroupBoard";
// import FlashcardGame from "@/components/games/FlashcardGame";
import ShuffleGame from "@/components/games/ShuffleGame";
import FlashcardChunkGame from "@/components/games/FlashcardChunkGame";
// import UploadForm from "@/components/UploadForm";

const GAME_TABS = [
	{ label: "🃏 Flashcards", id: "flashcards" },
	{ label: "🔀 Shuffle", id: "shuffle" },
	// { label: "📦 Arrangement", id: "arrangement" },
];

type Word = {
	id: string;
	text: string;
	meaning: string;
	example?: string;
	synonyms?: string[];
	antonyms?: string[];
};

export default function Home() {
	const [exploreMode, setExploreMode] = useState(false);
	const [activeGame, setActiveGame] = useState("shuffle");
	const [words, setWords] = useState<Word[]>([]);

	useEffect(() => {
		const fetchWords = async () => {
			const res = await fetch("/api/word/get");
			const data = await res.json();
			setWords(data.words || []);
		};
		if (exploreMode) fetchWords();
	}, [exploreMode]);

	return (
		<div>
			{/* <UploadForm /> */}
			<h1 className="text-2xl font-bold mb-4 px-4">
				{exploreMode ? "Explore Mode 🎮" : "Group Board"}
			</h1>
			<div className="flex justify-between px-4 mb-4">
				<button
					onClick={() => setExploreMode((prev) => !prev)}
					className="bg-purple-600 text-white px-4 py-1 rounded"
				>
					{exploreMode
						? "Exit Explore Mode"
						: "🎮 Enter Explore Mode"}
				</button>
			</div>
			{exploreMode ? (
				<div className="px-4">
					<div className="flex gap-2 mb-4 border-b">
						{GAME_TABS.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveGame(tab.id)}
								className={`px-4 py-2 rounded-t-md border-b-2 transition-all duration-200 ${
									activeGame === tab.id
										? "border-purple-600 font-bold text-purple-700"
										: "border-transparent text-gray-500"
								}`}
							>
								{tab.label}
							</button>
						))}
					</div>

					<div>
						{activeGame === "flashcards" && <FlashcardChunkGame />}
						{activeGame === "shuffle" && <ShuffleGame />}
						{/* Add future game conditionals here */}
					</div>
				</div>
			) : (
				<GroupBoard />
			)}
		</div>
	);
}
