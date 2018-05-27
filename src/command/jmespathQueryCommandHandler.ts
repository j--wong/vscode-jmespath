"use strict";

import * as vscode from "vscode";
import QueryInput from "./../ui/queryInput";
import Strings from "./../util/strings";
import JMESPathQueryService from "./../service/jmespathQueryService";
import { ResultViewer } from "./../ui/resultViewer";
import OutputChannelResultViewer from "./../ui/outputChannelResultViewer";

export default class JMESPathQueryCommandHandler {
	public static COMMAND_NAME = "jmespath.query";

	private extensionContext: vscode.ExtensionContext;
	private queryInputUi: QueryInput;
	private defaultExpression: string = "*";
	private queryService: JMESPathQueryService;
	private resultViewer: ResultViewer;
	private timeoutId: number;

	private disposable: vscode.Disposable;

	constructor(context: vscode.ExtensionContext, resultViewer?: ResultViewer) {
		this.extensionContext = context;
		this.queryInputUi = new QueryInput(context);
		this.queryService = new JMESPathQueryService(context);
		this.resultViewer = resultViewer || new OutputChannelResultViewer(Strings.UI_OUTPUT_CHANNEL_NAME, "  ");

		let subscriptions: Array<vscode.Disposable>;

		this.queryInputUi.onQueryExpressionChanged((expr) => {
			this.queryAndDisplayResult(expr);
		}, this, subscriptions);

		this.disposable = vscode.Disposable.from(...subscriptions);
	}

	public async handleCommand() {
		if (vscode.window.activeTextEditor.document.languageId !== "json") {
			throw new Error(Strings.ERROR_UNSUPPORTED_DOCUMENT);
		}

		try {
			let expression = await this.queryInputUi.presentInputBox(Strings.UI_QUERY_PROMPT, Strings.UI_QUERY_PROMPT_PLACEHOLDER, this.defaultExpression);
			this.defaultExpression = expression;
			if (expression === undefined) {
				return Promise.resolve();
			}
			if (expression.trim().length === 0) {
				throw new Error(Strings.ERROR_INVALID_EXPRESSION);
			}

			this.queryAndDisplayResult(expression);
		} catch (e) {
			return vscode.window.showErrorMessage(`${e.message}`);
		}
	}

	public dispose() {
		this.disposable.dispose();
	}

	private queryAndDisplayResult(expression: string) {
		let data = vscode.window.activeTextEditor.document.getText();
		let result = this.queryService.queryJson(expression, data);
		this.resultViewer.viewResult(result);
	}
}
