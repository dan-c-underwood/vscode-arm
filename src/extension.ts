import * as vscode from 'vscode';
import { getAsmOpcode } from './asm-docs-aarch64.js';

export function activate(context: vscode.ExtensionContext) {
    const hoverProvider = vscode.languages.registerHoverProvider('arm', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);

			const info = getAsmOpcode(word.toUpperCase())
            if (info) {
                return new vscode.Hover(info.tooltip);
            }

            switch (word.toUpperCase()) {
                case 'SP':
                    return new vscode.Hover('Stack Pointer - a register pointing to the last value written to the stack');
                case 'LR':
                    return new vscode.Hover('Link Register - a pointer to the return address of a subroutine call but can also be used for other purposes');
                case 'PC':
                    return new vscode.Hover('Program Counter - a pointer to the address of the next instruction to be executed');
                case 'APSR':
                    return new vscode.Hover('Application Program Status Register - a 32-bit register that holds the current status flags');
                case 'RZR':
                    return new vscode.Hover('Zero register');
                case 'XZR':
                    return new vscode.Hover('64-bit zero register');
                case 'WZR':
                    return new vscode.Hover('32-bit zero register');
                case 'LOC': // TODO: it should actually be .LOC
                    // TODO: might have more than those 3
                    return new vscode.Hover('Debugging directive linking to the source file number, line number and column number');
            }

            const register = word.match(/^([rxwsdq])([0-9]|1[0-9]|2[0-9]|3[0-1])$/i)
            if (register) {
                const [, srcType, srcNumber] = register;
                const type = srcType.toUpperCase();
                function matchCase(registerName: string) {
                    if (srcType === type) {
                        return registerName.toUpperCase();
                    }
                    return registerName.toLowerCase();
                }
                const n = parseInt(srcNumber);
                if (type === 'R') {
                    return new vscode.Hover('General-purpose register');
                }
                if (type === 'X') {
                    return new vscode.Hover('64-bit general-purpose register');
                }
                if (type === 'W') {
                    return new vscode.Hover('32-bit general-purpose register\n\nthe bottom 32 bits of ' + matchCase('X') + n);
                }
                if (type === 'S') {
                    if (n % 2 === 0) {
                        return new vscode.Hover('Single-precision floating-point register\n\nthe least significant 32 bits of ' + matchCase('D') + (n * 2));
                    }
                    return new vscode.Hover('Single-precision floating-point register\n\nthe most significant 32 bits of ' + matchCase('D') + (n * 2 - 1));
                }
                if (type === 'D') {
                    if (n % 2 === 0) {
                        return new vscode.Hover('Double-precision floating-point register\n\nthe least significant 64 bits of ' + matchCase('Q') + (n * 2));
                    }
                    return new vscode.Hover('Double-precision floating-point register\n\nthe most significant 64 bits of ' + matchCase('Q') + (n * 2 - 1));
                }
                if (type === 'Q') {
                    return new vscode.Hover('Quad-precision floating-point register');
                }
            }

            // TODO: immediate offset (#123 #-123 and maybe more?)
            // TODO: l_.str.1@PAGE incorrectly says "str" is a label
            // TODO: ldr	x0, [x8, x9, lsl  #3] incorrectly says "lsl" is a label
        }
    });

    context.subscriptions.push(hoverProvider);

}

// This method is called when your extension is deactivated
export function deactivate() {}
