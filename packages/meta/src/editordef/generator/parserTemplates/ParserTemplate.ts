import { PiConcept, PiLanguage } from "../../../languagedef/metalanguage/PiLanguage";
import { PiEditUnit } from "../../metalanguage";
import { LANGUAGE_GEN_FOLDER, Names } from "../../../utils";

export class ParserTemplate {

    /**
     * Returns a string representation of a generic parser for 'language'. This parser is able
     * to handle every modelunit in the language.
     */
    public generateParser(language: PiLanguage, editDef: PiEditUnit, relativePath: string): string {
        const unitNames = language.units.map(unit => Names.concept(unit));
 
        // Template starts here
        return `
        import { Parser } from "pegjs";
        import * as fs from "fs";
        import { ${unitNames.map(name => `${name}`).join(", ")} } from "${relativePath}${LANGUAGE_GEN_FOLDER }";   
        
        /**
        *   A type that combines all possible modelunits of language ${language.name}
        */
        export type MODELUNIT = ${unitNames.map(name => `${name}`).join("| ")};
        
        /**
        *   Class ${Names.parser(language)} is a wrapper for the various parsers of
        *   modelunits. It reads a file from disk, calls the javascript parser, and
        *   shows any syntax errors on the console.
        *   Note that property 'parser' should be set, before calling the method 'parse'.
        */
        export class ${Names.parser(language)}<MODELUNIT> {
            parser: Parser; // one of the Javascript parser objects generated by pegjs.
        
            parse(inputFile: string): MODELUNIT {
                // Check language file
                if (!fs.existsSync(inputFile)) {
                    console.error(this, "File '" + inputFile + "' does not exist, exiting.");
                    throw new Error("file not found.");
                }
                const langSpec: string = fs.readFileSync(inputFile, { encoding: "UTF8" });
                // Parse Language file
                let model: MODELUNIT = null;
                try {
                    model = this.parser.parse(langSpec);
                } catch (e) {
                    // syntax error
                    let errorstr = \`\${inputFile}: \${e} \${e.location && e.location.start ? \`[line \${e.location.start.line}, column \${e.location.start.column}]\` : \`\`}\`;
                    console.error(errorstr);
                }
                return model;
            }
        }
        `;
        // end Template
    }
}
