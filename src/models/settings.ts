import * as vscode from 'vscode';
import { TranslationKeyFormat, StorageKey } from '../enums';

export class Settings {
  public basePath: string;

  public prefix: string;

  public maxWords: number;

  public translationCodeMask: string;

  public translationsPath: string;

  public supportedLanguages: string;

  public get isUpperCase(): boolean {
    return this.upperCase === TranslationKeyFormat.upperCase;
  }

  public get fullTranslationPath(): string {
    if (vscode.workspace.workspaceFolders) {
      return vscode.workspace.workspaceFolders[0].uri.fsPath + this.translationsPath;
    }

    return '';
  }

  public get languages(): string[] {
    return (this.supportedLanguages === '*') ? [] : this.supportedLanguages.split(',');
  }

  protected upperCase: string;

  constructor(context: vscode.ExtensionContext) {
    const configuration = vscode.workspace.getConfiguration('translationHelper');

    this.upperCase = configuration.get<string>(StorageKey.caseFormat) || TranslationKeyFormat.upperCase;
    this.basePath = context.workspaceState.get<string>(StorageKey.basePath) || '';
    this.prefix = context.workspaceState.get<string>(StorageKey.prefix) || '';
    this.maxWords = configuration.get<number>(StorageKey.maxWords) || 5;
    this.translationCodeMask = configuration.get<string>(StorageKey.translationCodeMask) || '';
    this.translationsPath = configuration.get<string>(StorageKey.translationsPath) || '';
    this.supportedLanguages = configuration.get<string>(StorageKey.supportedLanguages) || '*';
  }
}