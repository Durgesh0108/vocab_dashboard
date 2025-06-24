import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { WordFormInline } from "./WordForm";
// make sure this is the enhanced version you built

export function AddWordModal({ onWordAdded }: { onWordAdded: () => void }) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default" className="w-full mb-4">
					➕ Add New Word
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
				<DialogHeader>
					<DialogTitle className="text-center text-xl">
						➕ Add New Word
					</DialogTitle>
				</DialogHeader>
				<WordFormInline
					onWordAdded={() => {
						onWordAdded();
						setOpen(false); // close modal on success
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}
