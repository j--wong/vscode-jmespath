"use strict";

import * as vscode from "vscode";

const jmespath = require("jmespath");

export default class QueryInput {
	private context: vscode.ExtensionContext;

	// Events
	public onQueryExpressionChanged: vscode.Event<string>;
	private onQueryExpressionChangedEventEmitter: vscode.EventEmitter<string>;

	/**
	 * Creates a new instance of QueryInput.
	 *
	 * @param context VSCode extension context
	 */
	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.onQueryExpressionChangedEventEmitter = new vscode.EventEmitter<string>();
		this.onQueryExpressionChanged = this.onQueryExpressionChangedEventEmitter.event;
	}

	/**
	 * Presents an input box for users to enter jmespath expression.
	 *
	 * @param prompt The text to display underneath the input box.
	 * @param placeholder An optional string to show as place holder in the input box to guide the user what to type.
	 * @return A string representing the user-entered expression
	 */
	public async presentInputBox(prompt: string, placeholder?: string, defaultVal?: string): Promise<string> {
		return vscode.window.showInputBox({
			prompt: prompt,
			placeHolder: placeholder,
			value: defaultVal,
			validateInput: (expr) => { return this.validateExpression(expr); }
		});
	}

	private validateExpression(expression: string): string {
		try {
			jmespath.compile(expression);
		} catch (e) {
			return e.message;
		}

		this.onQueryExpressionChangedEventEmitter.fire(expression);

		return null; // indicates expression being valid
	}
}

