import * as vscode from "vscode";
let jmespath = require("jmespath");

let outputChannel = vscode.window.createOutputChannel("JMESPath Output");

export function queryJson(context: vscode.ExtensionContext) {
	let editor = vscode.window.activeTextEditor;

	if (editor.document.languageId !== "json") {
		vscode.window.showInformationMessage("Please open a JSON document.");
		return;
	}

	let options: vscode.InputBoxOptions = {
		prompt: "Enter JMESPath expression",
		placeHolder: "JMESPath expression"
	};

	vscode.window.showInputBox(options).then((expression) => {
		if (expression.trim().length === 0) {
			return;
		}

		try {
			jmespath.compile(expression);
		}
		catch (e) {
			vscode.window.showErrorMessage(`${e.message}`);
			return;
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
			return;
		}
	});
}
