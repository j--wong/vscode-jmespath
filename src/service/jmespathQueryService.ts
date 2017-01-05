"use strict";

import * as vscode from "vscode";
import Strings from "../util/strings";

const jmespath = require("jmespath");

export default class JMESPathQueryService {
	private context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	public queryJson(expression: string, data: string): any {
		if (expression === undefined || expression.trim().length === 0) {
			throw new Error(Strings.ERROR_INVALID_EXPRESSION);
		}

		let jsonData = JSON.parse(data);
		let searchResult = jmespath.search(jsonData, expression);
		return searchResult;
	}
}
