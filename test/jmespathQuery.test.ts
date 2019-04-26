"use strict";

import * as path from "path";
import * as sinon from "sinon";
import * as vscode from "vscode";
import chai = require("chai");

let expect = chai.expect;
let jmespath = require("jmespath");

let testDataPath = path.join(__dirname, "..", "..", "test", "data");
let testJsonFile = path.join(testDataPath, "locations.json");
let emptyJsonFile = path.join(testDataPath, "empty.json");

let jmespathQuery: any;

xdescribe("jmespathQuery", () => {

	describe("#queryJson()", () => {
		let context: vscode.ExtensionContext;
		let sandbox: sinon.SinonSandbox;
		let showInputBox: sinon.SinonStub;
		let showInformationMessage: sinon.SinonStub;
		let showErrorMessage: sinon.SinonStub;
		let jmespathCompile: sinon.SinonStub;

		let createOutputChannel: sinon.SinonStub;
		let outputChannel: vscode.OutputChannel, outputBuffer;

		beforeEach(() => {
			context = {
				subscriptions: [],
				workspaceState: null,
				globalState: null,
				extensionPath: null,
				asAbsolutePath: sinon.stub()
			};

			sandbox = sinon.sandbox.create();

			showInformationMessage = sandbox.stub(vscode.window, "showInformationMessage");
			showErrorMessage = sandbox.stub(vscode.window, "showErrorMessage");
			createOutputChannel = sandbox.stub(vscode.window, "createOutputChannel");

			outputBuffer = "";
			outputChannel = {
				name: "TestOutputChannel",
				append: (output: string) => {
					outputBuffer = output;
				},
				appendLine: sandbox.stub(),
				clear: sandbox.stub(),
				show: <any>sandbox.stub(),
				hide: sandbox.stub(),
				dispose: sandbox.stub()
			};
			createOutputChannel.withArgs(sinon.match.any).returns(outputChannel);
		});

		afterEach(() => {
			sandbox.restore();
		});

		it("active document is not JSON -- display info message", () => {
			return jmespathQuery.queryJson(context, outputChannel)
				.then(() => {
					expect(showInformationMessage.called).to.be.true;
				});
		});

		it("empty expression entered -- display info message", () => {
			jmespathCompile = sandbox.stub(jmespath, "compile");

			let emptyExpression = "";
			showInputBox = sandbox.stub(vscode.window, "showInputBox");
			showInputBox.withArgs(sinon.match.any).returns(Promise.resolve(emptyExpression));

			return vscode.workspace.openTextDocument(testJsonFile)
				.then((document) => {
					return vscode.window.showTextDocument(document);
				})
				.then((editor) => {
					return jmespathQuery.queryJson(context, outputChannel);
				})
				.then(() => {
					expect(showInformationMessage.called).to.be.true;
					expect(jmespathCompile.called).to.not.be.true;
				});
		});

		it("invalid expression entered -- display error message", () => {
			let invalidExpression = "locations[?state=='WA'"; // invalid jmespath expression
			showInputBox = sandbox.stub(vscode.window, "showInputBox");
			showInputBox.withArgs(sinon.match.any).returns(Promise.resolve(invalidExpression));

			return vscode.workspace.openTextDocument(testJsonFile)
				.then((document) => {
					return vscode.window.showTextDocument(document);
				})
				.then((editor) => {
					return jmespathQuery.queryJson(context, outputChannel);
				})
				.then(() => {
					expect(showErrorMessage.called).to.be.true;
				});
		});

		it("valid jmespath expression -- display results in output channel", () => {
			let expression = "locations[?state=='WA'].name | sort(@)";
			showInputBox = sandbox.stub(vscode.window, "showInputBox");
			showInputBox.withArgs(sinon.match.any).returns(Promise.resolve(expression));

			let expectedOutput = JSON.stringify([ "Bellevue", "Olympia", "Seattle" ], null, "  ");

			return vscode.workspace.openTextDocument(testJsonFile)
				.then((document) => {
					return vscode.window.showTextDocument(document);
				})
				.then((editor) => {
					return jmespathQuery.queryJson(context, outputChannel);
				})
				.then(() => {
					expect(expectedOutput).to.equal(outputBuffer);
					expect((<sinon.SinonStub>outputChannel.show).called).to.be.true;
				});
		});

		it("empty json document -- display error message", () => {
			let expression = "locations[?state=='WA'].name";
			showInputBox = sandbox.stub(vscode.window, "showInputBox");
			showInputBox.withArgs(sinon.match.any).returns(Promise.resolve(expression));

			return vscode.workspace.openTextDocument(emptyJsonFile)
				.then((document) => {
					return vscode.window.showTextDocument(document);
				})
				.then((editor) => {
					return jmespathQuery.queryJson(context, outputChannel);
				})
				.then(() => {
					expect(showErrorMessage.called).to.be.true;
				});
		});
	});

});
