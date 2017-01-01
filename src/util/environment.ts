import * as path from "path";
import * as vscode from "vscode";

export default class Environment {
	private context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	public getHomeDir(): string {
		return process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"];
	}

	public isInsiders(): boolean {
		return /insiders/.test(this.context.asAbsolutePath(""));
	}

	public getExtensionDir(): string {
		return path.join(this.getHomeDir(), this.isInsiders() ? ".vscode-insiders" : ".vscode", "extensions");
	}
}
