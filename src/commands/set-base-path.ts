import * as vscode from 'vscode';
import { StorageKey } from '../enums';

export async function setBasePath(context: vscode.ExtensionContext) {
  const basePath = await vscode.window.showInputBox({
    placeHolder: "Base path",
    prompt: "Enter translation base path, eg. PUBLIC.LOGIN_MODAL",
    value: context.workspaceState.get<string>(StorageKey.basePath),
    ignoreFocusOut: true,
    validateInput: (text) => {
      if (/^[a-zA-Z0-9_.-]+$/g.test(text)) {
        return null;
      } else if (text !== '') {
        return 'Only letters, numbers and symbols `.-_` are acceptable!';
      }
    }
  });
  
  if (basePath !== undefined && basePath?.trim() !== '') {
    context.workspaceState.update(StorageKey.basePath, basePath);
    vscode.window.showInformationMessage(`Current translation base path is '${basePath}'`);
  } else if (basePath?.trim() === '') {
    context.workspaceState.update(StorageKey.basePath, '');
    vscode.window.showInformationMessage(`Current translation base path is empty`);
  }
}
