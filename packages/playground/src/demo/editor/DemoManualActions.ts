// Generated by the ProjectIt Language Generator.
import { KeyboardShortcutBehavior, PiBinaryExpressionCreator, PiCustomBehavior, PiExpressionCreator } from "@projectit/core";
import { EXPRESSION_PLACEHOLDER } from "@projectit/core";
import { Box, PiEditor, PiTriggerType } from "@projectit/core";
import { DemoNumberLiteralExpression } from "../language/gen";
export const MANUAL_EXPRESSION_CREATORS: PiExpressionCreator[] = [
    // Add your own custom expression creators here
    {
        trigger: /[0-9]/,
        activeInBoxRoles: [EXPRESSION_PLACEHOLDER],
        expressionBuilder: (box: Box, trigger: PiTriggerType, editor: PiEditor) => {
            const x = new DemoNumberLiteralExpression();
            x.value = trigger.toString();
            return x;
        },
        boxRoleToSelect: "num-literal-value"
    }
];

export const MANUAL_BINARY_EXPRESSION_CREATORS: PiBinaryExpressionCreator[] = [
    // Add your own custom binary expression creators here
];

export const MANUAL_CUSTOM_BEHAVIORS: PiCustomBehavior[] = [
    // Add your own custom behavior here
];

export const MANUAL_KEYBOARD: KeyboardShortcutBehavior[] = [
    // Add your own custom keyboard shortcuts here
];
