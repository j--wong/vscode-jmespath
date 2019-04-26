"use strict";

import * as vscode from "vscode";
import { ResultViewer } from "./resultViewer";

export default class OutputChannelResultViewer implements ResultViewer {
	private outputChannel: vscode.OutputChannel;
	private indentString: string;

	constructor(channelName: string, indent: string = "  ") {
		this.outputChannel = vscode.window.createOutputChannel(channelName);
		this.indentString = indent;
		this.outputChannel.show(true);
	}

	public viewResult(queryResult: any) {
		this.outputChannel.clear();
		this.outputChannel.appendLine(JSON.stringify(queryResult, null, this.indentString));
	}

	public dispose() {
		this.outputChannel.dispose();
	}
}
