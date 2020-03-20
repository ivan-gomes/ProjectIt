import { PiLanguageUnit, PiLangConcept, PiLangEnumeration, PiLangCUI, PiLangInterface, PiLangUnion, PiLangCI } from "./PiLanguage";

export class PiLangCUIReference {
    language: PiLanguageUnit;
    name: string;

    concept(): PiLangCUI {
        if(!!this.language) return this.language.findCUI(this.name);
    }
}

export class PiLangCIReference {
    language: PiLanguageUnit;
    name: string;

    concept(): PiLangCI {
        if(!!this.language) return this.language.findCI(this.name);
    }
}

export class PiLangConceptReference extends PiLangCUIReference {
    language: PiLanguageUnit;
    name: string;

    concept(): PiLangConcept {
        if(!!this.language) return this.language.findConcept(this.name);
    }
}

export class PiLangInterfaceReference extends PiLangCUIReference {
    language: PiLanguageUnit;
    name: string;

    concept(): PiLangInterface {
        if(!!this.language) return this.language.findInterface(this.name);
    }
}
export class PiLangUnionReference extends PiLangCUIReference {
    language: PiLanguageUnit;
    name: string;

    concept(): PiLangUnion {
        if(!!this.language) return this.language.findUnion(this.name);
    }
}


export class PiLangEnumerationReference {
    language: PiLanguageUnit;
    name: string;

    constructor() {
    }

    enumeration(): PiLangEnumeration {
        if(!!this.language) return this.language.findEnumeration(this.name);
    }
}
