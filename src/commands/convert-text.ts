import * as vscode from 'vscode';
import fs = require('fs');
import { Settings } from '../models';
import jsonfile = require('jsonfile');

export async function convertText(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const settings = new Settings(context);
    const document = editor.document;
    const selection = editor.selection;
    const basePath = toSelectedCase(settings.basePath, settings.isUpperCase);
    const prefix = toSelectedCase(settings.prefix, settings.isUpperCase);
    const selectedText = document.getText(selection);

    if (!isTranslationsPathExists(settings)) {
      vscode.window.showErrorMessage(`Translation path '${settings.translationsPath}' doesn't exist`);
      return;
    }
    
    const notExistLanguages = isTranslationsFilesExists(settings);
    if (notExistLanguages) {
      vscode.window.showErrorMessage(`No translation files for the following languages: ${notExistLanguages}`);
      return;
    }

    let translationKey = toSelectedCase(selectedText, settings.isUpperCase)
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
      if (settings.autoEditTranslationFiles) {
        if (updateTranslationFiles(settings, ((basePath) ? `${basePath}.` : '') + translationKey, selectedText)) {
          editBuilder.replace(selection, translationCode);
        }
      } else {
        editBuilder.replace(selection, translationCode);
        vscode.env.clipboard.writeText(`"${translationKey}": "${selectedText}"`);
      }
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
    const languagePath = `${settings.fullTranslationPath}${language}.json`;

    if (!fs.existsSync(languagePath)) {
      notExistLanguages.push(language);
    }
  });

  return notExistLanguages.join(',');
}

function updateTranslationFiles(settings: Settings, translationKey: string, text: string): boolean {
  let languages = settings.languages;

  if (!languages.length) {
    const files = fs.readdirSync(settings.fullTranslationPath, { withFileTypes: true });
    languages = files
      .filter((file) => file.isFile() && file.name.includes('.json'))
      .map((file) => file.name.replace('.json', ''));
    
    if (!languages.length) {
      vscode.window.showErrorMessage(`There are no translation files in the directory ${settings.translationsPath}`);
      return false;
    }
  }

  languages.forEach((language) => {
    const filePath = `${settings.fullTranslationPath}${language}.json`;
    let translation = jsonfile.readFileSync(filePath);
    
    if (settings.isNestedKeys) {
      const keyParts = translationKey.split('.');
      translation = addNestedValue(translation, keyParts, text);
    } else {
      translation[translationKey] = text;
    }

    jsonfile.writeFileSync(filePath, translation, { spaces: 2 });
  });

  return true;
}

function addNestedValue(obj: any, parts: string[], value: string): any {
  if (obj[parts[0]] === undefined && parts.length > 1) {
    obj[parts[0]] = {};
  }

  if (parts.length == 1) {
    obj[parts[0]] = value;
  } else {
    obj[parts[0]] = addNestedValue(obj[parts[0]], parts.slice(1), value);
  }

  return obj;
}
