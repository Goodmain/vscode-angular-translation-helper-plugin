# Angular Translation Helper for VSCode

This extension for Visual Studio Code generates `translation code` from the text for [ngx-translate](https://github.com/ngx-translate/core)

![demo](https://github.com/Goodmain/vscode-angular-translation-helper-plugin/raw/main/images/demo.gif)

## Usage

Select text to translate and in context menu select `Convert text to translation code`.

Alternatively, press `Ctrl`+`Shift`+`T` (Windows, Linux) or `Cmd`+`Shift`+`T` (MacOS) to convert selected text.

Text will be converted into translation code with default mask `{{ '[BASE_PATH][PREFIX][TRANSLATION_KEY]' | translate }}` (you can change it in the extension settings) while in clipboard you will have text for the json translation file `"[PREFIX][TRANSLATION_KEY]": "selected text"`.

You may set `[BASE_PATH]` and `[PREFIX]` from the command palette with commands `Set translation base path` and `Set prefix` respectively.

## Extension settings

| Name | Description | Default value |
| --- | --- | --- |
| translationHelper.translationCodeMask | Translation code mask that will replace the selected text | `{{ '[BASE_PATH][PREFIX][TRANSLATION_KEY]' \| translate }}` |
| translationHelper.maxWords | Max words of the selected text that will be converted into translation key | `5` |
| translationHelper.caseFormat | Translation key case format | `uppercase` |