// TODO note that the following import cannot be from "@projectit/core", because
// this leads to a load error
import { PiErrorSeverity } from "../../../../../core/src/validator/PiValidator";
import {
    ENVIRONMENT_GEN_FOLDER,
    langExpToTypeScript,
    LANGUAGE_GEN_FOLDER,
    LANGUAGE_UTILS_GEN_FOLDER,
    Names,
    PROJECTITCORE
} from "../../../utils";
import { PiConcept, PiLanguage, PiPrimitiveProperty } from "../../../languagedef/metalanguage";
import {
    CheckConformsRule,
    CheckEqualsTypeRule,
    ConceptRuleSet,
    ExpressionRule,
    IsuniqueRule,
    NotEmptyRule,
    PiValidatorDef,
    ValidationMessage,
    ValidationMessageReference,
    ValidationMessageText,
    ValidationRule,
    ValidNameRule
} from "../../metalanguage";
import { ValidationUtils } from "../ValidationUtils";

export class RulesCheckerTemplate {
    done: PiConcept[] = [];

    generateRulesChecker(language: PiLanguage, validdef: PiValidatorDef, relativePath: string): string {
        const defaultWorkerName = Names.defaultWorker(language);
        const errorClassName: string = Names.PiError;
        const checkerClassName: string = Names.rulesChecker(language);
        const typerInterfaceName: string = Names.PiTyper;
        const unparserInterfaceName: string = Names.PiUnparser;
        const checkerInterfaceName: string = Names.checkerInterface(language);
        const commentBefore = `/**
                                * Checks 'modelelement' before checking its children.
                                * Found errors are pushed onto 'errorlist'.
                                * @param modelelement
                                */`;
        return `
        import { ${errorClassName}, PiErrorSeverity, ${typerInterfaceName}, ${unparserInterfaceName} } from "${PROJECTITCORE}";
        import { ${this.createImports(language)} } from "${relativePath}${LANGUAGE_GEN_FOLDER }"; 
        import { ${Names.environment(language)} } from "${relativePath}${ENVIRONMENT_GEN_FOLDER}/${Names.environment(language)}";
        import { ${defaultWorkerName} } from "${relativePath}${LANGUAGE_UTILS_GEN_FOLDER}";   
        import { ${checkerInterfaceName} } from "./${Names.validator(language)}";
        import { reservedWordsInTypescript } from "./ReservedWords";  

        /**
         * Class ${checkerClassName} is the part of validator that is generated from, if present, 
         * the validator definition. As the other checkers, it uses the visitor pattern. 
         * Class ${defaultWorkerName} implements the traversal of the model tree. This class implements 
         * the actual checking of each node in the tree.
         */
        export class ${checkerClassName} extends ${defaultWorkerName} implements ${checkerInterfaceName} {
            // 'myUnparser' is used to provide error messages on the nodes in the model tree
            myUnparser: ${unparserInterfaceName} = (${Names.environment(language)}.getInstance() as ${Names.environment(language)}).unparser;
            // 'typer' is used to implement the 'typecheck' rules in the validator definition 
            typer: ${typerInterfaceName} = (${Names.environment(language)}.getInstance() as ${Names.environment(language)}).typer;
            // 'errorList' holds the errors found while traversing the model tree
            errorList: ${errorClassName}[] = [];

        ${validdef.conceptRules.map(ruleSet =>
            `${commentBefore}
            public execBefore${Names.concept(ruleSet.conceptRef.referred)}(modelelement: ${Names.concept(ruleSet.conceptRef.referred)}): boolean {
                let hasFatalError: boolean = false;
                ${this.createRules(ruleSet)}
                return hasFatalError;
            }`
        ).join("\n\n")}
        
        /**
         * Returns true if 'name' is a valid identifier
         * @param name
         */
        private isValidName(name: string): boolean {
            if (!(!!name)) return false;
            // cannot start with number
            if (/[0-9]/.test( name[0]) ) return false; 
            // may contain letters, numbers, '$', and '_', but no other characters
            if (/[.|,|!|?|@|~|%|^|&|*|-|=|+|(|)|{|}|"|'|:|;|<|>|?]/.test( name ) ) return false; 
            if (/\\\\/.test(name)) return false;
            if (/[\/|\[|\]]/.test(name)) return false;
            // may not contain whitespaces
            if (/[\\t|\\n|\\r| ]/.test(name)) return false;
            // may not be a Typescript keyword
            if (reservedWordsInTypescript.includes(name)) return false;
            return true;
            }
        }    
        `;

        this.done = [];
        // the template starts here
    }

    private createImports(language: PiLanguage): string {
        let result: string = language.concepts?.map(concept => `
                ${Names.concept(concept)}`).join(", ");
        result = result.concat(language.concepts ? `,` : ``);
        result = result.concat(
            language.interfaces?.map(intf => `
                ${Names.interface(intf)}`).join(", "));
        return result;
    }

    private createRules(ruleSet: ConceptRuleSet): string {
        let result: string = "";
        // find the property that indicates the location in human terms
        const locationdescription = ValidationUtils.findLocationDescription(ruleSet.conceptRef.referred);

        ruleSet.rules.forEach(r => {
            // find the severity for the rule
            const severity: string = this.makeSeverity(r);

            // if this rule has a message defined by the language engineer then use it
            const message: string = this.makeMessage(r.message);

            // add a comment to the result
            result += `// ${r.toPiString()}\n`;

            // create the text for the rule
            if (r instanceof CheckEqualsTypeRule) {
                result += this.makeEqualsTypeRule(r, locationdescription, severity, message);
            } else if (r instanceof CheckConformsRule) {
                result += this.makeConformsRule(r, locationdescription, severity, message);
            } else if (r instanceof NotEmptyRule) {
                result += this.makeNotEmptyRule(r, locationdescription, severity, message)
            } else if (r instanceof ValidNameRule) {
                result += this.makeValidNameRule(r, locationdescription, severity, message)
            } else if (r instanceof ExpressionRule) {
                result += this.makeExpressionRule(r, locationdescription, severity, message)
            } else if (r instanceof IsuniqueRule) {
                result += this.makeIsuniqueRule(r, locationdescription, severity, message);
            }
        });
        return result;
    }

    private makeSeverity(r: ValidationRule): string {
        // this method makes sure that we do not depend on the name of the severity to be the same as its value
        // i.e. PiErrorSeverity.ToDo = "TODO",
        let result: string = `PiErrorSeverity.`
        switch (r.severity.severity) {
            case PiErrorSeverity.Error: {
                result += `Error`;
                break;
            }
            case PiErrorSeverity.Improvement:{
                result += `Improvement`;
                break;
            }
            case PiErrorSeverity.Info:{
                result += `Info`;
                break;
            }
            case PiErrorSeverity.NONE:{
                result += `NONE`;
                break;
            }
            case PiErrorSeverity.ToDo:{
                result += `ToDo`;
                break;
            }
        }
        return result;
    }

    private makeExpressionRule(r: ExpressionRule, locationdescription: string, severity: string, message: string) {
        if (message.length === 0) {
            message = `"'${r.toPiString()}' is false"`;
        }
        return `if (!(${langExpToTypeScript(r.exp1)} ${r.comparator} ${langExpToTypeScript(r.exp2)})) {
                    this.errorList.push( new PiError( ${message}, modelelement, ${locationdescription}, ${severity} ));   
                    ${r.severity.severity === PiErrorSeverity.Error ? `hasFatalError = true;` : ``}                      
                }`;
    }

    private makeValidNameRule(r: ValidNameRule, locationdescription: string, severity: string, message: string) {
        if (message.length === 0) {
            message = `"'" + ${langExpToTypeScript(r.property)} + "' is not a valid identifier"`;
        }
        return `if (!this.isValidName(${langExpToTypeScript(r.property)})) {
                    this.errorList.push( new PiError( ${message}, modelelement, ${locationdescription}, ${severity} ));                         
                    ${r.severity.severity === PiErrorSeverity.Error ? `hasFatalError = true;` : ``}                      
                }`;
    }

    private makeNotEmptyRule(r: NotEmptyRule, locationdescription: string, severity: string, message: string) {
        if (message.length === 0) {
            message = `"List '${r.property.toPiString()}' may not be empty"`;
        }
        return `if (${langExpToTypeScript(r.property)}.length == 0) {
                    this.errorList.push(new PiError(${message}, modelelement, ${locationdescription}, ${severity}));
                    ${r.severity.severity === PiErrorSeverity.Error ? `hasFatalError = true;` : ``}                      
                }`;
    }

    private makeConformsRule(r: CheckConformsRule, locationdescription: string, severity: string, message?: string) {
        if (message.length === 0) {
            message = `"Type of '" + this.myUnparser.unparse(${langExpToTypeScript(r.type1)}, 0, true) + 
                         "' does not conform to (the type of) '" + this.myUnparser.unparse(${langExpToTypeScript(r.type2)}, 0, true) + "'"`;
        }
        return `if (!this.typer.conformsTo(${langExpToTypeScript(r.type1)}, ${langExpToTypeScript(r.type2)})) {
                    this.errorList.push(new PiError(${message}, ${langExpToTypeScript(r.type1)}, ${locationdescription}, ${severity}));
                    ${r.severity.severity === PiErrorSeverity.Error ? `hasFatalError = true;` : ``}                      
                 }`;
    }

    private makeEqualsTypeRule(r: CheckEqualsTypeRule, locationdescription: string, severity: string, message?: string) {
        if (message.length === 0) {
            message = `"Type of '"+ this.myUnparser.unparse(${langExpToTypeScript(r.type1)}, 0, true) 
                        + "' should be equal to (the type of) '" + this.myUnparser.unparse(${langExpToTypeScript(r.type2)}, 0, true) + "'"`;
        }
        return `if (!this.typer.equalsType(${langExpToTypeScript(r.type1)}, ${langExpToTypeScript(r.type2)})) {
                    this.errorList.push(new PiError(${message}, ${langExpToTypeScript(r.type1)}, ${locationdescription}, ${severity}));
                    ${r.severity.severity === PiErrorSeverity.Error ? `hasFatalError = true;` : ``}                      
                }`;
    }

    private makeIsuniqueRule(rule: IsuniqueRule, locationdescription: string, severity: string, message: string): string {
        const listpropertyName = rule.listproperty.appliedfeature.toPiString();
        const listName = rule.list.appliedfeature.toPiString();
        const uniquelistName = `unique${Names.startWithUpperCase(listpropertyName)}In${Names.startWithUpperCase(listName)}`;
        const referredListproperty = rule.listproperty.findRefOfLastAppliedFeature();
        const listpropertyTypeName = (referredListproperty instanceof PiPrimitiveProperty) ?
                referredListproperty.primType
            :
                referredListproperty.type.referred.name;
        const listpropertyTypescript = langExpToTypeScript(rule.listproperty.appliedfeature);
        if (message.length === 0) {
            message = `"The value of property '${listpropertyName}' is not unique in list '${listName}'"`;
        }
        return `let ${uniquelistName}: ${listpropertyTypeName}[] = [];
        ${langExpToTypeScript(rule.list)}.forEach((elem, index) => {
            if ((elem === undefined) || (elem === null)) {
                this.errorList.push(new PiError(\`Element[\$\{index\}] of property '${listName}' has no value\`,
                 ${langExpToTypeScript(rule.list)}[index],
                 ${locationdescription},
                 ${severity}));
                    ${rule.severity.severity === PiErrorSeverity.Error ? `hasFatalError = true;` : ``}                      
            } else {
                if (!${uniquelistName}.includes(elem.${listpropertyTypescript})){
                    ${uniquelistName}.push(elem.${listpropertyTypescript});
                } else {
                    this.errorList.push(new PiError(${message},
                     ${langExpToTypeScript(rule.list)}[index],
                     ${locationdescription},
                     ${severity}));                }
                    ${rule.severity.severity === PiErrorSeverity.Error ? `hasFatalError = true;` : ``}                      
            }
        });`;
    }

    private makeMessage(message: ValidationMessage): string {
        let result = "";
        if (!!message) {
            const numberOfparts = message.content.length;
            message.content.forEach((cont, index) => {
                if (cont instanceof ValidationMessageText) {
                    // console.log("FOUND message text: '" + cont.value + "'");
                    result += `${cont.value}`;
                } else if (cont instanceof  ValidationMessageReference) {
                    // console.log("FOUND message expression: '" + cont.expression.toPiString() + "'");
                    result += `\${${langExpToTypeScript(cont.expression)}}`;
                }
                if (index < numberOfparts - 1) {
                    result += " ";
                }
            });
        }
        if (result.length > 0) {
            result = "\`" + result + "\`";
        }
        return result;
    }
}
