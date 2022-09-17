// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

async function listAllFiles(fs: vscode.FileSystem, dir: vscode.Uri): Promise<Array<string>> {
	console.log(`dir: ${dir}`)
	let files: Array<string> = [];
	let entries = await vscode.workspace.fs.readDirectory(dir);
	for(const e of entries) {
		console.log(`e: ${e}}`)
		if (e[1] == vscode.FileType.File) {
			files.push(e[0]);
		}
		if (e[1] == vscode.FileType.Directory) {
			console.log(`${e[0]}`);
			files = files.concat(await listAllFiles(fs, vscode.Uri.joinPath(dir, e[0])));
		}
	}
	return files;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld-web-sample" is now active in the web extension host!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('helloworld-web-sample.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		if (!vscode.workspace.workspaceFolders || !vscode.workspace.workspaceFolders[0]) {
			vscode.window.showErrorMessage("No workspace found");
			return;
		}
		let wf = vscode.workspace.workspaceFolders[0].uri;
		listAllFiles(vscode.workspace.fs, wf).then(files => {
			// Display a message box to the user
			vscode.window.showInformationMessage(`Hello ! ${files.length}`);

		});

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
