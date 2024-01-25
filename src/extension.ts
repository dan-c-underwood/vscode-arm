import * as vscode from 'vscode';
import { getAsmOpcode } from './asm-docs-aarch64.js';

// The difference from the one in language-config.json is that
// this treats '.' as part of a word.
const WORD_PATTERN = /(#?-?(0b[01]+|0[0-7]+|0x[0-9a-fA-F]+|[0x]?[0-9][0-9a-fA-F]*[hH]|[1-9][0-9]*))|(\d*\.\d\w*)|([^\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\\"\,\<\>\/\?\s]+)/;

export function activate(context: vscode.ExtensionContext) {
    const getInfo = (word: string): string | undefined => {
        const info = getAsmOpcode(word.toUpperCase())
        if (info) {
            return info.tooltip;
        }

        function matchCase(s: string) {
            return word === word.toLowerCase() ? s.toLowerCase() : s.toUpperCase();
        }
        switch (word.toLowerCase()) {
            case 'sp':
                return 'Stack Pointer - a register pointing to the last value written to the stack (' + matchCase('XZR') + ')';
            case 'wsp':
                return '32-bit Stack Pointer - a register pointing to the last value written to the stack (' + matchCase('WZR') + ')';
            case 'lr':
                return 'Link Register - a pointer to the return address of a subroutine call but can also be used for other purposes (' + matchCase('X30') + ')';
            case 'fp':
                return 'Frame Pointer - a pointer to the current stack frame (' + matchCase('X29') + ')';
            case 'ip1':
                return 'Second 64-bit intra-procedure-call temporary register (' + matchCase('X17') + ')'
            case 'ip0':
                return 'First 64-bit intra-procedure-call temporary register (' + matchCase('X16') + ')'
            case 'pc':
                return 'Program Counter - a pointer to the address of the next instruction to be executed';
            case 'rzr':
                return 'Zero register (' + matchCase('SP') + ')';
            case 'xzr':
                return '64-bit zero register (' + matchCase('SP') + ')';
            case 'wzr':
                return '32-bit zero register (' + matchCase('SP') + ')';
            case 'apsr':
                return 'Application Program Status Register - a 32-bit register that holds the current status flags';
            case 'fpcr':
                return 'Floating Point Control Register - a 32-bit register that controls how floating point operations are performed';
            case 'fpsr':
                return 'Floating Point Status Register - a 32-bit register that holds the current status flags for floating point operations';
            case 'pstate':
                return 'Processor State register - a 32-bit register that holds the current processor state';
            
            // Standard conditions
            case 'eq':
                return 'Equal';
            case 'ne':
                return 'Not equal';
            case 'hs':
                return 'Unsigned higher or same';
            case 'cs':
                return 'Carry set';
            case 'lo':
                return 'Unsigned lower';
            case 'cc':
                return 'Carry clear';
            case 'mi':
                return 'Negative';
            case 'pl':
                return 'Positive or zero';
            case 'vs':
                return 'Overflow';
            case 'vc':
                return 'No overflow';
            case 'ls':
                return 'Unsigned lower or same';
            case 'ge':
                return 'Signed greater than or equal';
            case 'lt':
                return 'Signed less than';
            case 'gt':
                return 'Signed greater than';
            case 'le':
                return 'Signed less than or equal';
            case 'hi':
                return 'Unsigned higher';
            // "The condition code NV exists only to provide 
            // a valid disassembly of the ‘1111b’ encoding, and 
            // otherwise behaves identically to AL."
            case 'al': 
            case 'nv':
                return 'Always';

            // Labels
            case '.section':
                return 'Section label';
            case '.loc':
                // TODO: might have more than those 3
                return 'Debugging directive linking to the source file, line and column numbers';
            case '.set':
            case '.equ':
            case '.equiv':
            case '.ascii':
            case '.asciz':
            case '.string':
            case '.byte':
            case '.short':
            case '.value':
            case '.2byte':
            case '.long':
            case '.int':
            case '.4byte':
            case '.quad':
            case '.8byte':
            case '.octa':
            case '.single':
            case '.float':
            case '.double':
            case '.align':
            case '.align32':
            case '.balign':
            case '.balignw':
            case '.balignl':
            case '.p2align':
            case '.p2alignw':
            case '.p2alignl':
            case '.org':
            case '.fill':
            case '.zero':
            case '.extern':
            case '.globl':
            case '.global':
            case '.lazy_reference':
            case '.no_dead_strip':
            case '.symbol_resolver':
            case '.private_extern':
            case '.reference':
            case '.weak_definition':
            case '.weak_reference':
            case '.weak_def_can_be_hidden':
            case '.cold':
            case '.comm':
            case '.common':
            case '.lcomm':
            case '.abort':
            case '.include':
            case '.incbin':
            case '.code16':
            case '.code16gcc':
            case '.rept':
            case '.rep':
            case '.irp':
            case '.irpc':
            case '.endr':
            case '.bundle_align_mode':
            case '.bundle_lock':
            case '.bundle_unlock':
            case '.if':
            case '.ifeq':
            case '.ifge':
            case '.ifgt':
            case '.ifle':
            case '.iflt':
            case '.ifne':
            case '.ifb':
            case '.ifnb':
            case '.ifc':
            case '.ifeqs':
            case '.ifnc':
            case '.ifnes':
            case '.ifdef':
            case '.ifndef':
            case '.ifnotdef':
            case '.elseif':
            case '.else':
            case '.end':
            case '.endif':
            case '.skip':
            case '.space':
            case '.file':
            case '.line':
            // case '.loc':
            case '.stabs':
            case '.cv_file':
            case '.cv_func_id':
            case '.cv_loc':
            case '.cv_linetable':
            case '.cv_inline_linetable':
            case '.cv_inline_site_id':
            case '.cv_def_range':
            case '.cv_string':
            case '.cv_stringtable':
            case '.cv_filechecksums':
            case '.cv_filechecksumoffset':
            case '.cv_fpo_data':
            case '.sleb128':
            case '.uleb128':
            case '.cfi_sections':
            case '.cfi_startproc':
            case '.cfi_endproc':
            case '.cfi_def_cfa':
            case '.cfi_def_cfa_offset':
            case '.cfi_adjust_cfa_offset':
            case '.cfi_def_cfa_register':
            case '.cfi_llvm_def_aspace_cfa':
            case '.cfi_offset':
            case '.cfi_rel_offset':
            case '.cfi_personality':
            case '.cfi_lsda':
            case '.cfi_remember_state':
            case '.cfi_restore_state':
            case '.cfi_same_value':
            case '.cfi_restore':
            case '.cfi_escape':
            case '.cfi_return_column':
            case '.cfi_signal_frame':
            case '.cfi_undefined':
            case '.cfi_register':
            case '.cfi_window_save':
            case '.cfi_b_key_frame':
            case '.cfi_mte_tagged_frame':
            case '.macros_on':
            case '.macros_off':
            case '.macro':
            case '.exitm':
            case '.endm':
            case '.endmacro':
            case '.purgem':
            case '.err':
            case '.error':
            case '.warning':
            case '.altmacro':
            case '.noaltmacro':
            case '.reloc':
            case '.dc':
            case '.dc.a':
            case '.dc.b':
            case '.dc.d':
            case '.dc.l':
            case '.dc.s':
            case '.dc.w':
            case '.dc.x':
            case '.dcb':
            case '.dcb.b':
            case '.dcb.d':
            case '.dcb.l':
            case '.dcb.s':
            case '.dcb.w':
            case '.dcb.x':
            case '.ds':
            case '.ds.b':
            case '.ds.d':
            case '.ds.l':
            case '.ds.p':
            case '.ds.s':
            case '.ds.w':
            case '.ds.x':
            case '.print':
            case '.addrsig':
            case '.addrsig_sym':
            case '.pseudoprobe':
            case '.lto_discard':
            case '.lto_set_conditional':
            case '.memtag':
                return 'Directive';
        }

        // TODO: SIMD shapes? For example "Vn.16B" (where n is a register number)
        const register = word.match(/^([rxwvzbhsdqhb])([0-9]|1[0-9]|2[0-9]|3[0-1])|p([0-9]|1[0-5])$/i)
        if (register) {
            const [, srcType, srcNumber] = register;
            const type = srcType.toLowerCase();
            const n = parseInt(srcNumber);
            if (type === 'r') {
                if (n === 31) {
                    return 'Stack pointer or zero register (' + matchCase('SP') + ' or ' + matchCase('RZR') + ')';
                } else if (n === 30) {
                    return 'Link register (' + matchCase('LR') + ')';
                } else if (n === 29) {
                    return 'Frame pointer (' + matchCase('FP') + ')';
                } else if (n >= 19) {
                    return 'Callee-saved register'
                } else if (n === 18) {
                    return 'Platform register or just a temporary register'
                } else if (n === 17) {
                    return 'Second intra-procedure-call temporary register (' + matchCase('IP1') + ')'
                } else if (n === 16) {
                    return 'First intra-procedure-call temporary register (' + matchCase('IP0') + ')'
                } else if (n >= 9) {
                    return 'Temporary register'
                } else if (n === 8) {
                    return 'Indirect result location register'
                } else if (n >= 0) {
                    return 'Parameter/result register'
                }
            } else if (type === 'x') {
                if (n === 31) {
                    return '64-bit stack pointer or zero register (' + matchCase('SP') + ' or ' + matchCase('XZR') + ')';
                } else if (n === 30) {
                    return '64-bit link register (' + matchCase('LR') + ')';
                } else if (n === 29) {
                    return '64-bit frame pointer (' + matchCase('FP') + ')';
                } else if (n >= 19) {
                    return '64-bit callee-saved register'
                } else if (n === 18) {
                    return '64-bit platform register or just a temporary register'
                } else if (n === 17) {
                    return 'Second 64-bit intra-procedure-call temporary register (' + matchCase('IP1') + ')'
                } else if (n === 16) {
                    return 'First 64-bit intra-procedure-call temporary register (' + matchCase('IP0') + ')'
                } else if (n >= 9) {
                    return '64-bit temporary register'
                } else if (n === 8) {
                    return '64-bit indirect result location register'
                } else if (n >= 0) {
                    return '64-bit parameter/result register'
                }
            } else if (type === 'w') {
                let registerHelp = '32-bit register';
                if (n === 31) {
                    registerHelp = '32-bit stack pointer or zero register';
                } else if (n === 30) {
                    registerHelp = '32-bit link register';
                } else if (n === 29) {
                    registerHelp = '32-bit frame pointer';
                } else if (n >= 19) {
                    registerHelp = '32-bit callee-saved register'
                } else if (n === 18) {
                    registerHelp = '32-bit platform register or just a temporary register'
                } else if (n === 17) {
                    registerHelp = 'Second 32-bit intra-procedure-call temporary register'
                } else if (n === 16) {
                    registerHelp = 'First 32-bit intra-procedure-call temporary register'
                } else if (n >= 9) {
                    registerHelp = '32-bit temporary register'
                } else if (n === 8) {
                    registerHelp = '32-bit indirect result location register'
                } else if (n >= 0) {
                    registerHelp = '32-bit parameter/result register'
                }
                return registerHelp + '\n\nthe bottom 32 bits of ' + matchCase('X') + n
            } else if (type === 'b') {
                // TODO: b/h/s/d/q can be floating point or SIMD registers
                return '8-bit scalar register';
            } else if (type === 'h') {
                return '16-bit scalar or half-precision floating-point register';
            } else if (type === 's') {
                if (n % 2 === 0) {
                    return 'Single-precision floating-point register\n\nthe least significant 32 bits of ' + matchCase('D') + (n * 2);
                }
                return 'Single-precision floating-point register\n\nthe most significant 32 bits of ' + matchCase('D') + (n * 2 - 1);
            } else if (type === 'd') {
                if (n % 2 === 0) {
                    return 'Double-precision floating-point register\n\nthe least significant 64 bits of ' + matchCase('Q') + (n * 2);
                }
                return 'Double-precision floating-point register\n\nthe most significant 64 bits of ' + matchCase('Q') + (n * 2 - 1);
            } else if (type === 'q') {
                return '128-bit scalar register';
            }
        }

        const immediate = word.match(/^#(-?[0-9]+)$/i)
        if (immediate) {
            // TODO: can be offset
            if (word === '#0') {
                return 'Zero immediate';
            }
            if (word.startsWith('#-')) {
                return 'Negative immediate';
            }
            return 'Immediate';
        }

        // TODO: immediate offset (#123 #-123 and maybe more?)
        // TODO: l_.str.1@PAGE incorrectly says "str" is a label
        // TODO: ldr	x0, [x8, x9, lsl  #3] incorrectly says "lsl" is a label
    }

    const hoverProvider = vscode.languages.registerHoverProvider('arm', {
        provideHover(document, position, token) {

         const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
            if (word) {
                const info = getInfo(word);
                if (info) {
                    return new vscode.Hover(info);
                }
            }

        }
    });

    context.subscriptions.push(hoverProvider);

}

// This method is called when your extension is deactivated
export function deactivate() {}
