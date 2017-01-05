"use strict";

import * as vscode from "vscode";
import JMESPathQueryCommandHandler from "./command/jmespathQueryCommandHandler";
import OutputChannelResultViewer from "./ui/outputChannelResultViewer";
import Strings from "./util/strings";

export function activate(context: vscode.ExtensionContext) {
	const outputChannel = new OutputChannelResultViewer(Strings.UI_OUTPUT_CHANNEL_NAME);
	const jmespathQueryCommandHandler = new JMESPathQueryCommandHandler(context, outputChannel);

	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand("jmespath.query",
			(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
				try {
					jmespathQueryCommandHandler.handleCommand();
				} catch (e) {
					vscode.window.showErrorMessage(`${e.message}`);
				}
			}
		)
	);
	context.subscriptions.push(outputChannel);
	context.subscriptions.push(jmespathQueryCommandHandler);
}
