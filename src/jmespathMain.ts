"use strict";

import * as vscode from "vscode";
import { queryJson } from "./jmespathQuery";

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand("jmespath.query",
			(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
				queryJson(context);
			}
		)
	);
}
