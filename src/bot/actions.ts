import { tag, message, memoBox, vault } from "./actions.methods.ts";
export class Action {
	x: number;
	y: number;
	tag: typeof tag;
	message: typeof message;
	memoBox: typeof memoBox;
	vault: typeof vault;
	constructor() {
		this.tag = tag.bind(this);
		this.message = message.bind(this);
		this.memoBox = memoBox.bind(this);
		this.vault = vault.bind(this);
	}
}
