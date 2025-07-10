// "use client";

// import { useEffect, useState } from "react";
// // import { toast } from "react-hot-toast";

// type Word = {
// 	id: string;
// 	text: string;
// 	meaning: string;
// 	example?: string;
// 	synonyms?: string[];
// 	antonyms?: string[];
// };

// const mockWords: Word[] = [
// 	{
// 		id: "1",
// 		text: "Ubiquitous",
// 		meaning: "Present, appearing, or found everywhere.",
// 		example: "Smartphones have become ubiquitous in daily life.",
// 	},
// 	{
// 		id: "2",
// 		text: "Ambiguous",
// 		meaning: "Open to more than one interpretation.",
// 		example: "The instructions were ambiguous and confusing.",
// 	},
// ];

// export default function FlashcardGame({
// 	words = mockWords,
// }: {
// 	words?: Word[];
// }) {
// 	const [index, setIndex] = useState(0);
// 	const [flipped, setFlipped] = useState(false);

// 	const word = words[index];

// 	useEffect(() => {
// 		setIndex(0);
// 		setFlipped(false);
// 	}, [words]);

// 	const handleNext = () => {
// 		setFlipped(false);
// 		setIndex((prev) => (prev + 1) % words.length);
// 	};

// 	const handlePrev = () => {
// 		setFlipped(false);
// 		setIndex((prev) => (prev - 1 + words.length) % words.length);
// 	};

// 	// const handleCopy = (text: string) => {
// 	// 	navigator.clipboard.writeText(text);
// 	// 	toast.success("Copied!");
// 	// };

// 	return (
// 		<div className="flex flex-col items-center gap-6 p-6">
// 			{/* Progress Bar */}
// 			<div className="w-full max-w-sm h-2 bg-gray-300 dark:bg-gray-700 rounded">
// 				<div
// 					className="bg-purple-500 h-full rounded"
// 					style={{ width: `${((index + 1) / words.length) * 100}%` }}
// 				/>
// 			</div>

// 			<div
// 				className="flip-card w-[320px] h-[220px]"
// 				onClick={() => setFlipped(!flipped)}
// 			>
// 				<div
// 					className={`flip-card-inner ${
// 						flipped ? "transform rotate-y-180" : ""
// 					}`}
// 				>
// 					{/* Front */}
// 					<div
// 						className="flip-card-front text-2xl font-bold"
// 						// onClick={(e) => {
// 						// 	e.stopPropagation();
// 						// 	handleCopy(word.text);
// 						// }}
// 					>
// 						📘 {word.text}
// 					</div>

// 					{/* Back */}
// 					<div
// 						className="flip-card-back px-4 text-center text-lg font-medium text-purple-700 dark:text-purple-300"
// 						// onClick={(e) => {
// 						// 	e.stopPropagation();
// 						// 	handleCopy(word.meaning);
// 						// }}
// 					>
// 						<p>{word.meaning}</p>
// 						{word.example && (
// 							<p className="text-sm italic text-gray-500 mt-2">
// 								💡 {word.example}
// 							</p>
// 						)}
// 					</div>
// 				</div>
// 			</div>

// 			{/* Controls */}
// 			<div className="flex gap-4">
// 				<button
// 					onClick={handlePrev}
// 					className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded shadow"
// 				>
// 					⬅️ Previous
// 				</button>
// 				<button
// 					onClick={handleNext}
// 					className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
// 				>
// 					Next ➡️
// 				</button>
// 			</div>

// 			{/* Word Index */}
// 			<p className="text-sm text-gray-500">
// 				Word {index + 1} of {words.length}
// 			</p>
// 		</div>
// 	);
// }

"use client";

import { useEffect, useState } from "react";

type Word = {
	id: string;
	text: string;
	meaning: string;
	example?: string;
	synonyms?: string[];
	antonyms?: string[];
};

export default function FlashcardGame({ words = [] }: { words?: Word[] }) {
	const [index, setIndex] = useState(0);
	const [flipped, setFlipped] = useState(false);

	const word = words[index];

	useEffect(() => {
		setIndex(0);
		setFlipped(false);
	}, [words]);

	const handleNext = () => {
		setFlipped(false);
		setIndex((prev) => (prev + 1) % words.length);
	};

	const handlePrev = () => {
		setFlipped(false);
		setIndex((prev) => (prev - 1 + words.length) % words.length);
	};

	if (!word) {
		return (
			<div className="p-6 text-center text-gray-500">
				No word found in this group.
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-6 p-6">
			{/* Progress Bar */}
			<div className="w-full max-w-sm h-2 bg-gray-300 dark:bg-gray-700 rounded">
				<div
					className="bg-purple-500 h-full rounded"
					style={{ width: `${((index + 1) / words.length) * 100}%` }}
				/>
			</div>

			{/* Flashcard */}
			<div
				className="flip-card w-[320px] h-[220px]"
				onClick={() => setFlipped(!flipped)}
			>
				<div
					className={`flip-card-inner ${
						flipped ? "transform rotate-y-180" : ""
					}`}
				>
					{/* Front */}
					<div className="flip-card-front text-2xl font-bold text-purple-700 dark:text-purple-300">
						📘 {word.text}
					</div>

					{/* Back */}
					<div className="flip-card-back px-4 text-center text-lg font-medium text-purple-700 dark:text-purple-300">
						<p>{word.meaning}</p>
						{word.example && (
							<p className="text-sm italic text-gray-500 mt-2">
								💡 {word.example}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Controls */}
			<div className="flex gap-4">
				<button
					onClick={handlePrev}
					className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded shadow"
				>
					⬅️ Previous
				</button>
				<button
					onClick={handleNext}
					className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
				>
					Next ➡️
				</button>
			</div>

			{/* Word Index */}
			<p className="text-sm text-gray-500">
				Word {index + 1} of {words.length}
			</p>
		</div>
	);
}
