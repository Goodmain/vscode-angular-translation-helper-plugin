import * as vscode from 'vscode';
import { convertText, setBasePath, setPrefix } from './commands';

export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(vscode.commands.registerCommand('translationHelper.setBasePath', () => setBasePath(context)));
  context.subscriptions.push(vscode.commands.registerCommand('translationHelper.setPrefix', () => setPrefix(context)));
  context.subscriptions.push(vscode.commands.registerCommand('translationHelper.convertText', () => convertText(context)));

}

export function deactivate() {}
