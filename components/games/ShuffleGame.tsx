// /components/games/ShuffleGame.tsx
"use client";

import {
	DndContext,
	useSensor,
	useSensors,
	MouseSensor,
	TouchSensor,
	DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { toast } from "react-hot-toast";

type Word = {
	id: string;
	text: string;
	meaning: string;
};

type Group = {
	id: string;
	label: string;
	meaning: string;
	words: Word[];
};

export default function ShuffleGame() {
	const [groups, setGroups] = useState<Group[]>([]);
	const [wordsToGuess, setWordsToGuess] = useState<
		{ word: Word; groupId: string }[]
	>([]);

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
		useSensor(TouchSensor)
	);

	// Fetch groups & prepare shuffled words
	useEffect(() => {
		const fetchGroups = async () => {
			const res = await fetch("/api/groups");
			const data = await res.json();

			setGroups(data.groups);

			// prepare words (include groupId for correctness check)
			const combined: { word: Word; groupId: string }[] = [];
			for (const group of data.groups) {
				for (const word of group.words) {
					combined.push({ word, groupId: group.id });
				}
			}

			// shuffle the list
			setWordsToGuess(shuffle(combined));
		};

		fetchGroups();
	}, []);

	// DND Handlers
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;

		const draggedId = active.id.toString();
		const droppedOn = over.id.toString();

		const matched = wordsToGuess.find((w) => w.word.id === draggedId);

		if (!matched) return;

		if (matched.groupId === droppedOn) {
			toast.success(
				`✅ Correct! "${matched.word.text}" belongs to ${getGroupLabel(
					droppedOn
				)}`
			);
			// Remove word from list
			setWordsToGuess((prev) =>
				prev.filter((item) => item.word.id !== draggedId)
			);
		} else {
			toast.error(
				`❌ Oops! "${
					matched.word.text
				}" doesn't belong to ${getGroupLabel(droppedOn)}`
			);
		}
	};

	const getGroupLabel = (id: string) => {
		return groups.find((g) => g.id === id)?.label || "Unknown Group";
	};

	// DND Components
	const DraggableWord = ({ word }: { word: Word }) => {
		const { attributes, listeners, setNodeRef } = useDraggable({
			id: word.id,
		});

		return (
			<div
				ref={setNodeRef}
				{...listeners}
				{...attributes}
				className="bg-white dark:bg-gray-800 border rounded px-3 py-2 shadow-md cursor-grab"
			>
				📘 {word.text}
			</div>
		);
	};

	const DroppableGroup = ({ group }: { group: Group }) => {
		const { setNodeRef } = useDroppable({ id: group.id });

		return (
			<div
				ref={setNodeRef}
				className="min-w-[220px] bg-gray-50 dark:bg-gray-900 border p-3 rounded space-y-2"
			>
				<h3 className="font-semibold text-blue-600 dark:text-blue-300">
					📂 {group.label}
				</h3>
				<p className="text-xs text-gray-500 mb-2">{group.meaning}</p>
			</div>
		);
	};

	return (
		<div className="p-4 space-y-6">
			<h2 className="text-xl font-bold mb-2 text-purple-700">
				🔀 Shuffle Game
			</h2>

			<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
				{/* Word Pool */}
				<div className="flex flex-wrap gap-4 mb-6">
					{wordsToGuess.map(({ word }) => (
						<DraggableWord key={word.id} word={word} />
					))}
				</div>

				{/* Drop Zones */}
				<div className="flex gap-6 overflow-x-auto">
					{groups.map((group) => (
						<DroppableGroup key={group.id} group={group} />
					))}
				</div>
			</DndContext>
		</div>
	);
}
