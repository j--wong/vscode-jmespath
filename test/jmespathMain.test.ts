import * as vscode from "vscode";
import * as jmespathMain from "../src/jmespathMain";
import * as assert from "assert";
import * as sinon from "sinon";
import chai = require("chai");

let expect = chai.expect;

describe("JMESPath extension", () => {
	let extensionId = "joshwong.vscode-jmespath";

	describe("#activate()", () => {
		let context: vscode.ExtensionContext;
		let stubTextEditorCommand: sinon.SinonStub;

		beforeEach(() => {
			context = {
				subscriptions: [],
				workspaceState: null,
				globalState: null,
				extensionPath: null,
				asAbsolutePath: sinon.stub()
			};
			stubTextEditorCommand = sinon.stub(vscode.commands, "registerTextEditorCommand");
		});

		afterEach(() => {
			stubTextEditorCommand.restore();
		});

		it("should register 'jmespath.query' command", sinon.test(() => {
			jmespathMain.activate(context);
			expect(stubTextEditorCommand.calledWith("jmespath.query")).to.be.true;
		}));

		it("should add disposable command to subscriptions array", sinon.test(() => {
			jmespathMain.activate(context);

			expect(context.subscriptions).to.not.be.empty;
			expect(context.subscriptions.length).to.equals(3);
		}));
	});

});
