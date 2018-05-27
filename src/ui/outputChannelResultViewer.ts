"use strict";

import * as vscode from "vscode";
import { Uri, ViewColumn, Selection, Position } from "vscode";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { ResultViewer } from "./resultViewer";
import JMESPathQueryCommandHandler from "./../command/jmespathQueryCommandHandler";

export default class OutputChannelResultViewer implements ResultViewer {
	private indentString: string;
	private resultsFilePath: string;
	private resultsDoc: vscode.TextDocument;

	constructor(channelName: string, indent: string = "  ") {
		this.indentString = indent;
		this.resultsFilePath = path.join(os.tmpdir(), "Query Results.json");
	}

	public viewResult(queryResult: any) {
		fs.writeFileSync(this.resultsFilePath, "");
		const resultsFileUri = Uri.file(this.resultsFilePath);
		const resultsFileUri2 = Uri.file(path.join(os.tmpdir(), "Query Results2.json"));
		if (this.resultsDoc)
			this.resultsDoc.save();
		fs.writeFileSync(this.resultsFilePath, JSON.stringify(queryResult, null, this.indentString));
		vscode.workspace.openTextDocument(resultsFileUri).then(doc => {
				this.resultsDoc = doc;
				vscode.window.showTextDocument(doc, getViewColumn(), true);
			}
		);
	}

	public dispose() {
		fs.unlink(this.resultsFilePath);
	}
}

function getViewColumn(): ViewColumn {
	const activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) {
		return ViewColumn.One;
	}
	return activeEditor.viewColumn + 1;
}
