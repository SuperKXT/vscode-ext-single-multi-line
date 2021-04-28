import * as vscode from 'vscode'
import splitIntoLines from './split'

export function activate(context: vscode.ExtensionContext) {

	const COMMAND = 'extension.objectArrayFormatter'

	const commandHandler = async function () {

		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const document = editor.document
		const selection = editor.selection
		const selectedText = document.getText(selection)

		if (!selectedText.trim().length) {
			return;
		}

		const newText = splitIntoLines(selectedText);

		await editor.edit(builder => {
			builder.replace(selection, newText)
		});

		await vscode.commands.executeCommand(
			'editor.action.formatSelection',
			document.uri,
			selection,
		);

	}
	let disposable = vscode.commands.registerCommand(COMMAND, commandHandler);
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
