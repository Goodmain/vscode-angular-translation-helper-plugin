import * as vscode from 'vscode';
import fs = require('fs');
import { Settings } from '../models';
//import * as copypaste from 'copy-paste';
//import jsonfile = require("jsonfile");

export async function convertText(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const settings = new Settings(context);
    const document = editor.document;
    const selection = editor.selection;
    const basePath = toSelectedCase(settings.basePath, settings.isUpperCase);
    const prefix = toSelectedCase(settings.prefix, settings.isUpperCase);

    if (!isTranslationsPathExists(settings)) {
      vscode.window.showErrorMessage(`Translation path '${settings.translationsPath}' doesn't exist`);
      return;
    }
    
    const notExistLanguages = isTranslationsFilesExists(settings);
    if (notExistLanguages) {
      vscode.window.showErrorMessage(`No translation files for the following languages: ${notExistLanguages}`);
      return;
    }

    let translationKey = toSelectedCase(document.getText(selection), settings.isUpperCase)
      .trim()
      .replace(/[\s\t\-]/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .replace(/___/g, '_')
      .split('_')
      .slice(0, settings.maxWords)
      .join('_');

    const translationCode = settings.translationCodeMask
      .replace('[BASE_PATH]', (basePath) ? `${basePath}.` : '')
      .replace('[PREFIX]', prefix)
      .replace('[TRANSLATION_KEY]', translationKey);

    translationKey = prefix + translationKey;

    editor.edit((editBuilder) => {
      editBuilder.replace(selection, translationCode);
      //vscode.env.clipboard.writeText(`"${translationKey}": "${selectedText}"`);
    });
  }
}

function toSelectedCase(value: string, isUpperCase: boolean): string {
  return (isUpperCase)
    ? value.toLocaleUpperCase()
    : value.toLocaleLowerCase()
}

function isTranslationsPathExists(settings: Settings): boolean {
  return fs.existsSync(settings.fullTranslationPath);
}

function isTranslationsFilesExists(settings: Settings): string {
  let notExistLanguages: string[] = [];

  settings.languages.forEach((language) => {
    const languagePath = `${settings.fullTranslationPath}/${language}.json`;

    if (!fs.existsSync(languagePath)) {
      notExistLanguages.push(language);
    }
  });

  return notExistLanguages.join(',');
}

function updateTranslationFile(): string {
  return '';
}
