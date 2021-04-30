import * as vscode from 'vscode';
import transformText from './transformText';

export function activate(context: vscode.ExtensionContext) {

	const COMMAND = 'extension.singleMultiLine';

	const commandHandler = async function (args: any) {

		let isCommaOnNewLine: boolean = false;

		if (!args) {

			const optionSelected = await vscode.window.showQuickPick(
				[
					{label: 'commaOnSameLine', description: 'Comma At The End Of Line'},
					{label: 'commaOnNewLine', description: 'Comma At The Start Of New Line'},
				],
				{
					canPickMany: false,
					placeHolder: 'Choose The Comma Placement'
				}
			) || { label: undefined };
			console.log(optionSelected);
			isCommaOnNewLine = optionSelected.label === 'commaOnNewLine';
		} else {
			isCommaOnNewLine = !!args.isCommaOnNewLine;
		}

		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const document = editor.document;
		const selection = editor.selection;
		const selectedText = document.getText(selection);

		if (!selectedText.trim().length) {
			return;
		}

		const newText = transformText(selectedText, isCommaOnNewLine);

		await editor.edit(builder => {
			builder.replace(selection, newText);
		});

		await vscode.commands.executeCommand(
			'editor.action.formatSelection',
			document.uri,
			selection,
		);

		await vscode.commands.executeCommand(
			'editor.action.trimTrailingWhitespace',
			document.uri,
			selection,
		);

	};
	let disposable = vscode.commands.registerCommand(COMMAND, commandHandler);
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
