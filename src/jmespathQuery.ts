"use strict";

import * as vscode from "vscode";
let jmespath = require("jmespath");

export function queryJson(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel): PromiseLike<void> {
	let editor = vscode.window.activeTextEditor;

	if (editor.document.languageId !== "json") {
		vscode.window.showInformationMessage("Please open a JSON document.");
		return Promise.resolve();
	}

	let options: vscode.InputBoxOptions = {
		prompt: "Enter JMESPath expression",
		placeHolder: "JMESPath expression"
	};

	return vscode.window.showInputBox(options).then((expression) => {
		if (expression === undefined || expression.trim().length === 0) {
			vscode.window.showInformationMessage("Please enter a valid JMESPath expression.");
			return Promise.resolve();
		}

		try {
			jmespath.compile(expression);
		}
		catch (e) {
			vscode.window.showErrorMessage(`${e.message}`);
			return Promise.resolve();
		}

		let data = vscode.window.activeTextEditor.document.getText();
		try {
			let jsonData = JSON.parse(data);
			let searchResult = jmespath.search(jsonData, expression);

			outputChannel.clear();
			outputChannel.append(JSON.stringify(searchResult, null, "  "));
			outputChannel.show();
		} catch (e) {
			vscode.window.showErrorMessage(`${e.message}`);
			return Promise.resolve();
		}
	});
}
