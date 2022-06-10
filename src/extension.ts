import * as vscode from 'vscode';
import { TranslationKeyFormat } from './enums';

export function activate(context: vscode.ExtensionContext) {
  
  const basePathKey = 'translationHelper.basePath';
  const prefixKey = 'translationHelper.prefix';
  const maxWordsKey = 'maxWords';
  const translationCodeMaskKey = 'translationCodeMask';
  const caseFormatKey = 'caseFormat';
  
  const setBasePathCommand = vscode.commands.registerCommand('translationHelper.setBasePath', async () => {
    const basePath = await vscode.window.showInputBox({
      placeHolder: "Base path",
      prompt: "Enter translation base path, eg. PUBLIC.LOGIN_MODAL",
      value: context.workspaceState.get<string>(basePathKey),
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
      context.workspaceState.update(basePathKey, basePath);
      vscode.window.showInformationMessage(`Current translation base path is '${basePath}'`);
    } else if (basePath?.trim() === '') {
      context.workspaceState.update(basePathKey, '');
      vscode.window.showInformationMessage(`Current translation base path is empty`);
    }
  });

  context.subscriptions.push(setBasePathCommand);

  const setPrefixCommand = vscode.commands.registerCommand('translationHelper.setPrefix', async () => {
    const prefix = await vscode.window.showInputBox({
      placeHolder: "Prefix",
      prompt: "Enter a translation prefix, eg. TEXT_",
      value: context.workspaceState.get<string>(prefixKey),
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
      context.workspaceState.update(prefixKey, prefix);
      vscode.window.showInformationMessage(`Current prefix is '${prefix}'`);
    } else if (prefix?.trim() === '') {
      context.workspaceState.update(prefixKey, '');
      vscode.window.showInformationMessage(`Current prefix is empty`);
    }
  });

  context.subscriptions.push(setPrefixCommand);

  const convertTextCommand = vscode.commands.registerCommand('translationHelper.convertText', async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const configuration = vscode.workspace.getConfiguration('translationHelper');
      const document = editor.document;
      const selection = editor.selection;
      let basePath = context.workspaceState.get<string>(basePathKey) || '';
      let prefix = context.workspaceState.get<string>(prefixKey) || '';
      const maxWords = configuration.get<number>(maxWordsKey) || 5;
      const translationCodeMask = configuration.get<string>(translationCodeMaskKey) || '';
      const isUpperCase = (configuration.get<string>(caseFormatKey) || TranslationKeyFormat.upperCase) === TranslationKeyFormat.upperCase;

      const selectedText = document.getText(selection);
      let translationKey = selectedText
        .trim()
        .replace(/[\s\t\-]/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .replace(/___/g, '_')
        .split('_')
        .slice(0, maxWords)
        .join('_');

      translationKey = (isUpperCase)
        ? translationKey.toLocaleUpperCase()
        : translationKey.toLocaleLowerCase();

      basePath = (isUpperCase)
        ? basePath.toLocaleUpperCase()
        : basePath.toLocaleLowerCase();

      prefix = (isUpperCase)
        ? prefix.toLocaleUpperCase()
        : prefix.toLocaleLowerCase();

      let translationCode = translationCodeMask
        .replace('[BASE_PATH]', (basePath) ? `${basePath}.` : '')
        .replace('[PREFIX]', prefix)
        .replace('[TRANSLATION_KEY]', translationKey);

      translationKey = prefix + translationKey;

      editor.edit((editBuilder) => {
        editBuilder.replace(selection, translationCode);
        vscode.env.clipboard.writeText(`"${translationKey}": "${selectedText}"`);
      });
    }
  });

  context.subscriptions.push(convertTextCommand);
}

export function deactivate() {}

/*
my name is mister bean!


my name is mister bean:


my name is mister-bean:

my name is mister - bean!

my name is mister_bean:
*/
