"use strict";

import * as vscode from "vscode";
import { queryJson } from "./jmespathQuery";

export function activate(context: vscode.ExtensionContext) {
	let outputChannel = vscode.window.createOutputChannel("JMESPath Output");

	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand("jmespath.query",
			(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
				queryJson(context, outputChannel);
			}
		)
	);
}
