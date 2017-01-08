# JMESPath for Visual Studio Code

[![Build Status](https://travis-ci.org/j--wong/vscode-jmespath.svg?branch=master)](https://travis-ci.org/j--wong/vscode-jmespath)
[![Version](http://vsmarketplacebadge.apphb.com/version/joshwong.vscode-jmespath.svg)](https://marketplace.visualstudio.com/items?itemName=joshwong.vscode-jmespath)
[![Installs](http://vsmarketplacebadge.apphb.com/installs/joshwong.vscode-jmespath.svg)](https://marketplace.visualstudio.com/items?itemName=joshwong.vscode-jmespath)

JMESPath is a query language for JSON. For more information about JMESPath, please visit [here](http://jmespath.org)

This extension lets you test JMESPath expressions from within Visual Studio Code.

## Features

![JMESPath Example](images/jmespath-example.gif)

## How to use this extension

- Open a JSON document
- Press `cmd+shift+j` or Run `JMESPath: Query JSON` command from command palette (`F1` on Windows or `Cmd+Shift+P` on Mac)
- Enter JMESPath expression
- Expression output will be shown in `JMESPath Output` window

## Release Notes

### 0.0.5

- Add live expression evaluation
- Expression validation
- Changed keyboard shortcut to `cmd+shift+j` / `ctrl+shift+j` as previous ones didn't work properly

### 0.0.4

- Fix keyboard shortcut on Mac

### 0.0.3

- Added keyboard shortcut `cmd+j q` on Mac and `ctrl+j q` on Windows
- Added expression validation

### 0.0.2

- Ensured expression result is displayed in the same output window instead of creating new ones each time

### 0.0.1

- Initial release
