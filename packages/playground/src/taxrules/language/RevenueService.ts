// Generated by the ProjectIt Language Generator.
import * as uuid from "uuid";
import { PiElement, PiNamedElement, PiExpression, PiBinaryExpression } from "@projectit/core";
import { model, MobxModelElementImpl, observablelistpart, observablepart } from "@projectit/core";
import { TaxRulesConceptType } from "./TaxRules";
import { TaxRuleSet } from "./TaxRuleSet";
import { TaxPayer } from "./TaxPayer";
import { IncomeType } from "./IncomeType";
import { TaxPayerType } from "./TaxPayerType";
import { PlaceholderExpression } from "./PlaceholderExpression";
import { Expression } from "./Expression";

@model
export class RevenueService extends MobxModelElementImpl implements PiElement {
    readonly $typename: TaxRulesConceptType = "RevenueService";
    $id: string;

    constructor(id?: string) {
        super();

        if (!!id) {
            this.$id = id;
        } else {
            this.$id = uuid.v4();
        }
    }

    @observablepart rules: TaxRuleSet;

    @observablelistpart payers: TaxPayer[];

    piLanguageConcept(): TaxRulesConceptType {
        return this.$typename;
    }

    piId(): string {
        return this.$id;
    }

    piIsExpression(): boolean {
        return false;
    }

    piIsBinaryExpression(): boolean {
        return false;
    }
}