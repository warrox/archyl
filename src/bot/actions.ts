import { tag, message, memoBox } from "./actions.methods.ts";
export class Action {
	x: number;
	y: number;
	tag: typeof tag;
	message: typeof message;
	memoBox: typeof memoBox;

	constructor() {
		this.tag = tag.bind(this);
		this.message = message.bind(this);
		this.memoBox = memoBox.bind(this);
	}
}
