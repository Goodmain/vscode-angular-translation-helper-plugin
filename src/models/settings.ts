import * as vscode from 'vscode';
import { TranslationKeyFormat, StorageKey, TranslationKeyStyle } from '../enums';

export class Settings {
  public basePath: string;

  public prefix: string;

  public maxWords: number;

  public translationCodeMask: string;

  public translationsPath: string;

  public supportedLanguages: string;

  public autoEditTranslationFiles: boolean;

  public get isUpperCase(): boolean {
    return this.caseType === TranslationKeyFormat.upperCase;
  }

  public get isNestedKeys(): boolean {
    return this.keyStyle === TranslationKeyStyle.nested;
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

  protected caseType: string;

  protected keyStyle: string;

  constructor(context: vscode.ExtensionContext) {
    const configuration = vscode.workspace.getConfiguration('translationHelper');

    this.caseType = configuration.get<string>(StorageKey.caseType) || TranslationKeyFormat.upperCase;
    this.keyStyle = configuration.get<string>(StorageKey.translationKeyStyle) || TranslationKeyStyle.nested;
    this.basePath = context.workspaceState.get<string>(StorageKey.basePath) || '';
    this.prefix = context.workspaceState.get<string>(StorageKey.prefix) || '';
    this.maxWords = configuration.get<number>(StorageKey.maxWords) || 5;
    this.translationCodeMask = configuration.get<string>(StorageKey.translationCodeMask) || '';
    this.autoEditTranslationFiles = configuration.get<boolean>(StorageKey.autoEditTranslationFiles) || false;
    this.translationsPath = configuration.get<string>(StorageKey.translationsPath) || '';
    this.supportedLanguages = configuration.get<string>(StorageKey.supportedLanguages) || '*';
  }
}