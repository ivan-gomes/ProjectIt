import { Checker } from "../Checker";
import { PiLanguage, PiLangConceptReference } from "../../metalanguage/PiLanguage";
import { PiScopeDef } from "./PiScopeDefLang";

export class PiScoperChecker extends Checker<PiScopeDef> {
    
    constructor(language: PiLanguage) {
        super();
        this.language = language;
    }

    public check(definition: PiScopeDef): void {
        console.log("Checking Scope Definition " + definition.scoperName);
        this.nestedCheck(
            {
                check: true,
                error: "This error never happens"
            });
            definition.namespaces.forEach(ns => this.checkConceptReference(ns.conceptRef));
        }

    checkConceptReference(reference: PiLangConceptReference) {
        // note that the following statement is crucial, because the model we are testing is separate
        // from the model of the language
        reference.language = this.language;
        this.nestedCheck(
            {
                check: reference.name !== undefined,
                error: `Element reference ${"UNKNOWN"}.type should have a name, but doesn't`,
                whenOk: () => this.nestedCheck(
                    {
                        check: reference.concept() !== undefined,
                        error: `ElementReference to ${reference.name} cannot be resolved`
                    })
            })
    }

}

