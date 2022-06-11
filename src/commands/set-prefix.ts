import * as vscode from 'vscode';
import { StorageKey } from '../enums';

export async function setPrefix(context: vscode.ExtensionContext) {
  const prefix = await vscode.window.showInputBox({
    placeHolder: "Prefix",
    prompt: "Enter a translation prefix, eg. TEXT_",
    value: context.workspaceState.get<string>(StorageKey.prefix),
    ignoreFocusOut: true,
    validateInput: (text) => {
      if (/^[a-zA-Z0-9_.-]+$/g.test(text)) {
        return null;
      } else if (text !== '') {
        return 'Only letters, numbers and symbols `.-_` are acceptable!';
      }
    }
  });
  
  if (prefix !== undefined && prefix?.trim() !== '') {
    context.workspaceState.update(StorageKey.prefix, prefix);
    vscode.window.showInformationMessage(`Current prefix is '${prefix}'`);
  } else if (prefix?.trim() === '') {
    context.workspaceState.update(StorageKey.prefix, '');
    vscode.window.showInformationMessage(`Current prefix is empty`);
  }
}
