// "use client";

// import { useEffect, useState } from "react";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import { prisma } from "@/lib/prisma";

// type Word = {
// 	id: string;
// 	text: string;
// 	meaning: string;
// 	synonyms: string[];
// 	antonyms: string[];
// 	prefix?: string;
// 	suffix?: string;
// 	root?: string;
// };

// const COLUMN_KEYS = ["prefix", "suffix", "root"] as const;

// export default function TrelloBoard() {
// 	const [words, setWords] = useState<Word[]>([]);

// 	useEffect(() => {
// 		const fetchWords = async () => {
// 			const res = await fetch("/api/word/get");
// 			const data = await res.json();
// 			setWords(data.words);
// 		};

// 		fetchWords();
// 	}, []);

// 	const getColumnWords = (key: "prefix" | "suffix" | "root") => {
// 		return words.filter((w) => w[key]);
// 	};

// 	return (
// 		<DndContext collisionDetection={closestCenter}>
// 			<div className="grid grid-cols-3 gap-4 p-4">
// 				{COLUMN_KEYS.map((key) => (
// 					<div
// 						key={key}
// 						className="bg-gray-100 p-4 rounded min-h-[500px]"
// 					>
// 						<h2 className="text-xl font-bold capitalize mb-4">
// 							{key}
// 						</h2>
// 						<div className="space-y-4">
// 							{getColumnWords(key).map((word) => (
// 								<div
// 									key={word.id}
// 									className="bg-white p-2 shadow rounded"
// 								>
// 									<h3 className="font-semibold text-lg">
// 										{word.text}
// 									</h3>
// 									<p className="text-sm">{word.meaning}</p>
// 									<p className="text-xs mt-1">
// 										<strong>Syn:</strong>{" "}
// 										{word.synonyms.join(", ")}
// 										<br />
// 										<strong>Ant:</strong>{" "}
// 										{word.antonyms.join(", ")}
// 									</p>
// 								</div>
// 							))}
// 						</div>
// 					</div>
// 				))}
// 			</div>
// 		</DndContext>
// 	);
// }

"use client";

import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";

type Word = {
	id: string;
	text: string;
	meaning: string;
	synonyms: string[];
	antonyms: string[];
	prefix?: string;
	suffix?: string;
	root?: string;
};

const COLUMN_KEYS = ["prefix", "suffix", "root"] as const;

const WordCard = ({ word }: { word: Word }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: word.id,
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			style={style}
			className="bg-white p-3 rounded shadow"
		>
			<h3 className="font-semibold">{word.text}</h3>
			<p className="text-sm">{word.meaning}</p>
			<p className="text-xs mt-1">
				<strong>Syn:</strong> {word.synonyms.join(", ")}
				<br />
				<strong>Ant:</strong> {word.antonyms.join(", ")}
			</p>
		</div>
	);
};

export default function TrelloBoard() {
	const [words, setWords] = useState<Word[]>([]);

	useEffect(() => {
		const fetchWords = async () => {
			const res = await fetch("/api/word/get");
			const data = await res.json();
			setWords(data.words);
		};

		fetchWords();
	}, []);

	const getColumnWords = (key: "prefix" | "suffix" | "root") =>
		words.filter((w) => !!w[key]);

	const handleDragEnd = async (event: DragEndEvent) => {
		const wordId = event.active.id as string;
		const overColumn = (event.over?.id ?? "") as
			| "prefix"
			| "suffix"
			| "root";

		if (!wordId || !overColumn) return;

		// Reset all columns to false and assign to the new column
		const updated = words.map((w) =>
			w.id === wordId
				? {
						...w,
						prefix: overColumn === "prefix" ? "✓" : null,
						suffix: overColumn === "suffix" ? "✓" : null,
						root: overColumn === "root" ? "✓" : null,
				  }
				: w
		);

		setWords(updated);

		await fetch("/api/word/update", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: wordId,
				update: {
					prefix: overColumn === "prefix" ? "✓" : null,
					suffix: overColumn === "suffix" ? "✓" : null,
					root: overColumn === "root" ? "✓" : null,
				},
			}),
		});
	};

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor)
	);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<div className="grid grid-cols-3 gap-4 p-4">
				{COLUMN_KEYS.map((column) => (
					<div
						key={column}
						id={column}
						className="bg-gray-100 p-4 rounded min-h-[500px]"
					>
						<h2 className="text-xl font-bold capitalize mb-4">
							{column}
						</h2>
						<SortableContext
							items={getColumnWords(column)}
							strategy={verticalListSortingStrategy}
						>
							<div className="space-y-3">
								{getColumnWords(column).map((word) => (
									<WordCard key={word.id} word={word} />
								))}
							</div>
						</SortableContext>
					</div>
				))}
			</div>
		</DndContext>
	);
}
