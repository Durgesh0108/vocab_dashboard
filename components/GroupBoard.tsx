// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";

import {
	DndContext,
	useSensor,
	useSensors,
	MouseSensor,
	TouchSensor,
	DragEndEvent,
} from "@dnd-kit/core";

import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Copy, Trash2 } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { fetchSimilarAndOppositeWords } from "@/lib/utils";
import { AddWordModal } from "./AddWordModal";
import { WordEditModal } from "./WordEditModal";

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

	const handleFetchAI = async () => {
		if (!text) return;
		setAiLoading(true);
		const data = await fetchSimilarAndOppositeWords(text);
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
			<h3 className="font-semibold text-lg">➕ Add New Word</h3>

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

// Types

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

const WordCard = ({
	word,
	onRemove,
	onCopy,
	onUpdated, // callback after edit
}: {
	word: Word;
	onRemove?: () => void;
	onCopy?: () => void;
	onUpdated?: () => void;
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: word.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		cursor: "grab",
		boxShadow: isDragging ? "0 4px 20px rgba(0,0,0,0.15)" : undefined,
	};

	return (
		<>
			<Card
				ref={setNodeRef}
				{...attributes}
				{...listeners}
				style={style}
				className={`p-3 flex justify-between items-start bg-gradient-to-br from-white to-gray-100 border border-gray-200 transition rounded-xl ${
					isDragging
						? "ring-2 ring-blue-500"
						: "shadow-md hover:shadow-lg"
				}`}
			>
				<div className="flex items-start gap-2">
					<GripVertical className="w-4 h-4 text-gray-400 mt-1" />
					<div>
						<h4 className="font-semibold text-sm text-gray-800 mb-1">
							📘 {word.text}
						</h4>
						<p className="text-xs text-gray-500 leading-snug">
							{word.meaning}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-1">
					{onCopy && (
						<Button
							variant="ghost"
							size="icon"
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								onCopy();
							}}
							className="text-blue-500 hover:text-blue-700"
							title="Copy"
						>
							<Copy className="w-4 h-4" />
						</Button>
					)}
					<WordEditModal word={word} onUpdated={onUpdated} />
					{onRemove && (
						<Button
							variant="ghost"
							size="icon"
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								onRemove();
							}}
							className="text-red-500 hover:text-red-700"
							title="Remove"
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					)}
				</div>
			</Card>
		</>
	);
};

const DroppableColumn = ({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}) => {
	const { setNodeRef } = useDroppable({ id });
	return (
		<div ref={setNodeRef} id={id} className="space-y-3">
			{children}
		</div>
	);
};

export default function GroupBoard() {
	const [groups, setGroups] = useState<Group[]>([]);
	const [groupOrder, setGroupOrder] = useState<string[]>([]);
	const [allWords, setAllWords] = useState<Word[]>([]);
	const [copiedWord, setCopiedWord] = useState<Word | null>(null);
	const [newLabel, setNewLabel] = useState("");
	const [newMeaning, setNewMeaning] = useState("");
	// const [showForm, setShowForm] = useState(false);

	const [query, setQuery] = useState("");
	const [filteredWords, setFilteredWords] = useState<Word[]>([]);

	const handleSearch = (searchText: string) => {
		if (!searchText) {
			setFilteredWords(allWords);
			return;
		}

		const lower = searchText.toLowerCase();
		const filtered = allWords.filter((word) => {
			return (
				word.text.toLowerCase().includes(lower) ||
				word.meaning.toLowerCase().includes(lower) ||
				(word.synonyms || []).some((s) =>
					s.toLowerCase().includes(lower)
				) ||
				(word.antonyms || []).some((a) =>
					a.toLowerCase().includes(lower)
				) ||
				(word.example || "").toLowerCase().includes(lower) ||
				(word.prefix || "").toLowerCase().includes(lower) ||
				(word.suffix || "").toLowerCase().includes(lower) ||
				(word.root || "").toLowerCase().includes(lower)
			);
		});
		setFilteredWords(filtered);
	};

	const clearSearch = () => {
		setQuery("");
		setFilteredWords(allWords);
	};

	// useEffect(() => {
	// 	const delay = setTimeout(() => {
	// 		handleSearch(query);
	// 	}, 200); // 200ms debounce

	// 	return () => clearTimeout(delay);
	// }, [query]);

	const fetchGroups = async () => {
		const res = await fetch("/api/groups");
		const data = await res.json();
		const sorted = data.groups.sort((a: Group, b: Group) =>
			a.label.localeCompare(b.label)
		);
		setGroups(sorted);
		setGroupOrder(sorted.map((g: Group) => g.id));
	};

	const fetchWords = async () => {
		const res = await fetch("/api/word/get");
		const data = await res.json();
		const assignedIds = new Set(
			data.groups?.flatMap((g: Group) =>
				g.words.map((w: Word) => w.id)
			) || []
		);
		const unassignedWords = data.words.filter(
			(w: Word) => !assignedIds.has(w.id)
		);
		setAllWords(unassignedWords);
		setFilteredWords(data.words);
	};

	useEffect(() => {
		fetchGroups();
		fetchWords();
	}, []);

	const handleCreateGroup = async () => {
		if (!newLabel || !newMeaning) return;
		await fetch("/api/group/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ label: newLabel, meaning: newMeaning }),
		});
		setNewLabel("");
		setNewMeaning("");
		await fetchGroups();
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;

		const wordId = active.id as string;
		const targetContainerId = over.id.toString();

		const alreadyInGroup = groups.some(
			(g) =>
				g.id === targetContainerId &&
				g.words.find((w) => w.id === wordId)
		);
		if (alreadyInGroup) return;

		if (targetContainerId === "all-words") {
			const currentGroup = groups.find((g) =>
				g.words.find((w) => w.id === wordId)
			);
			if (currentGroup) {
				await fetch("/api/group/remove-word", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ wordId, groupId: currentGroup.id }),
				});
			}
		} else {
			await fetch("/api/group/add-word", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ wordId, groupId: targetContainerId }),
			});
		}

		await fetchGroups();
		await fetchWords();
	};

	const handleDeleteWord = async (id: string) => {
		const confirmed = confirm("Are you sure you want to delete this word?");
		if (!confirmed) return;

		try {
			const res = await fetch("/api/word/delete", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});

			if (res.ok) {
				toast.success("Word deleted");
				await fetchWords(); // refresh the list
			} else {
				toast.error("Failed to delete word");
			}
		} catch (err) {
			console.log(err);
			toast.error("Something went wrong");
		}
	};

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
		useSensor(TouchSensor)
	);

	return (
		<div className="p-4 space-y-6">
			<div className="flex gap-2">
				<Input
					value={newLabel}
					onChange={(e) => setNewLabel(e.target.value)}
					placeholder="Group label (e.g. Ambi)"
					className="w-1/4"
				/>
				<Input
					value={newMeaning}
					onChange={(e) => setNewMeaning(e.target.value)}
					placeholder="Group meaning"
					className="w-1/2"
				/>
				<Button onClick={handleCreateGroup}>➕ Add Group</Button>
			</div>

			<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
				<div className="flex gap-4 overflow-x-auto">
					<DroppableColumn id="all-words">
						<div className="min-w-[250px] bg-blue-50 p-4 rounded shadow-inner">
							<h2 className="font-bold text-lg mb-2">
								📚 All Words
							</h2>
							<div className="flex gap-2 mb-3">
								<input
									type="text"
									placeholder="Search word..."
									value={query}
									onChange={(e) => {
										setQuery(e.target.value);
										handleSearch(e.target.value); // filter instantly
									}}
									className="w-full border border-gray-300 text-sm px-3 py-1.5 rounded"
								/>

								{query && (
									<button
										onClick={clearSearch}
										className="text-sm text-gray-500 hover:underline"
									>
										Clear
									</button>
								)}
							</div>

							{/* <WordFormInline onWordAdded={fetchWords} /> */}

							{/* <div className="mb-2">
								<button
									onClick={() => setShowForm((prev) => !prev)}
									className="text-sm font-medium flex items-center text-blue-700 hover:underline"
								>
									{showForm ? (
										<ChevronDown className="w-4 h-4 mr-1" />
									) : (
										<ChevronRight className="w-4 h-4 mr-1" />
									)}
									{showForm
										? "Hide Word Form"
										: "➕ Add New Word"}
								</button>
							</div>

						
							{showForm && (
								<WordFormInline onWordAdded={fetchWords} />
							)} */}

							<AddWordModal onWordAdded={fetchWords} />

							<SortableContext
								items={filteredWords.map((w) => w.id)}
								strategy={verticalListSortingStrategy}
							>
								<div className="space-y-3">
									{filteredWords.map((word) => (
										<WordCard
											key={word.id}
											word={word}
											onCopy={() => setCopiedWord(word)}
											onRemove={() =>
												handleDeleteWord(word.id)
											}
											onUpdated={fetchWords}
										/>
									))}
								</div>
							</SortableContext>

							{/* <SortableContext
								items={(searchResults.length
									? searchResults
									: allWords
								).map((w) => w.id)}
								strategy={verticalListSortingStrategy}
							>
								<div className="space-y-3">
									{(searchResults.length
										? searchResults
										: allWords
									).map((word) => (
										<WordCard
											key={word.id}
											word={word}
											onCopy={() => setCopiedWord(word)}
											onRemove={() =>
												handleDeleteWord(word.id)
											}
											onUpdated={fetchWords}
										/>
									))}
								</div>
							</SortableContext> */}

							{/* <SortableContext
								items={allWords.map((w) => w.id)}
								strategy={verticalListSortingStrategy}
							>
								<div className="space-y-3">
									{allWords.map((word) => (
										<WordCard
											key={word.id}
											word={word}
											onCopy={() => setCopiedWord(word)}
											onRemove={() =>
												handleDeleteWord(word.id)
											}
											onUpdated={fetchWords}
										/>
									))}
								</div>
							</SortableContext> */}
						</div>
					</DroppableColumn>

					{groupOrder.map((groupId) => {
						const group = groups.find((g) => g.id === groupId);
						if (!group) return null;
						return (
							<DroppableColumn key={group.id} id={group.id}>
								<div className="min-w-[250px] bg-white border p-4 rounded shadow-sm">
									<h3 className="font-semibold text-lg mb-1">
										📂 {group.label}
									</h3>
									<p className="text-sm text-gray-500 mb-2">
										{group.meaning}
									</p>
									<SortableContext
										items={group.words.map((w) => w.id)}
										strategy={verticalListSortingStrategy}
									>
										<div className="space-y-2">
											{group.words.map((word) => (
												<WordCard
													key={word.id}
													word={word}
													onRemove={async () => {
														await fetch(
															"/api/group/remove-word",
															{
																method: "POST",
																headers: {
																	"Content-Type":
																		"application/json",
																},
																body: JSON.stringify(
																	{
																		wordId: word.id,
																		groupId:
																			group.id,
																	}
																),
															}
														);
														await fetchGroups();
														await fetchWords();
													}}
													onCopy={() =>
														setCopiedWord(word)
													}
												/>
											))}
										</div>
									</SortableContext>
									{copiedWord && (
										<Button
											onClick={async () => {
												await fetch(
													"/api/group/add-word",
													{
														method: "POST",
														headers: {
															"Content-Type":
																"application/json",
														},
														body: JSON.stringify({
															wordId: copiedWord.id,
															groupId: group.id,
														}),
													}
												);
												toast.success(
													`Pasted "${copiedWord.text}" into ${group.label}`
												);
												await fetchGroups();
												await fetchWords();
											}}
											className="mt-2 w-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
										>
											📋 Paste Copied Word
										</Button>
									)}
								</div>
							</DroppableColumn>
						);
					})}
				</div>
			</DndContext>
		</div>
	);
}
