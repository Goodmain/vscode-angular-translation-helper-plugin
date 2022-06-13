# Angular Translation Helper for VSCode

This extension for Visual Studio Code generates `translation code` from the text and appends it into translation files

![demo](https://github.com/Goodmain/vscode-angular-translation-helper-plugin/raw/main/images/demo.gif)

## Usage

Select text to translate and in context menu choose `Convert text to translation code`.

Alternatively, press `Ctrl`+`Shift`+`T` (Windows, Linux) or `Cmd`+`Shift`+`T` (MacOS) to convert selected text.

Text will be converted into translation code with default mask `{{ '[BASE_PATH][PREFIX][TRANSLATION_KEY]' | translate }}` (you can change it in the extension settings) and will be added into translation files.

You may set `[BASE_PATH]` and `[PREFIX]` from the command palette with commands `Set translation base path` and `Set prefix` respectively.

## Extension settings

| Name | Description |
| --- | --- |
| translationHelper.translationCodeMask | Translation code mask that will replace the selected text. Default: `{{ '[BASE_PATH][PREFIX][TRANSLATION_KEY]' \| translate }}` |
| translationHelper.maxWords | Max words of the selected text that will be converted into translation key. Default: `5` |
| translationHelper.caseType | Translation key case format. Default: `uppercase` |
| translationHelper.autoEditTranslationFiles | When `true` the translation code will be automatically inserted into translation files, otherwise the translation code will be copied into clipboard. Default: `true` |
| translationHelper.translationsPath | Path to translation files. Default: `/src/assets/i18n/` |
| translationHelper.supportedLanguages | Comma separated list of supported languages. Default: `*` |
| translationHelper.translationKeyStyle | Style of the translation keys. Default: `nested` |

## Examples

### Flat translation file and translation key with prefix

Base path: `PUBLIC.LOGIN`

Prefix: `TEXT_`

Translation case style: `flat`

```html
<div>
  <div>
    <div>{{ 'PUBLIC.LOGIN.TEXT_SOME_TEXT' | translate }}</div>
    <div>Another one text</div>
  </div>
</div>
```

```json
{
  "PUBLIC.LOGIN.TEXT_SOME_TEXT": "Some text"
}
```

### Nested translation file and translation base path in variable

Base path: `PUBLIC.LOGIN`

Translation case style: `nested`

Translation code mask: `{{ basePath + '[PREFIX][TRANSLATION_KEY]' | translate }}`

```html
<div>
  <div>
    <div>{{ basePath + 'SOME_TEXT' | translate }}</div>
    <div>Another one text</div>
  </div>
</div>
```

```json
{
  "PUBLIC": {
    "LOGIN": {
      "SOME_TEXT": "Some text"
    }
  }
}
```