import { tag, message } from "./actions.methods.ts";
export class Action {
	x: number;
	y: number;
	tag: typeof tag;
	message: typeof message;
	constructor() {
		//this.x = x;
		//this.y = y;
		this.tag = tag.bind(this);
		this.message = message.bind(this);
	}
}
