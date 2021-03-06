import { PiLanguage } from "../../metalanguage";
import { Names, LANGUAGE_GEN_FOLDER } from "../../../utils";

export class WorkerInterfaceTemplate {

    generateWorkerInterface(language: PiLanguage, relativePath: string): string {

        // the template starts here
        return `
        import { ${this.createImports(language)} } from "${relativePath}${LANGUAGE_GEN_FOLDER }"; 

        /**
         * Interface ${Names.workerInterface(language)} implements the extended visitor pattern of instances of language ${language.name}.
         * Class ${Names.walker(language)} implements the traversal of the model tree, classes that implement this interface 
         * are responsible for the actual work being done on the nodes of the tree.
         * Every node is visited twice, once before the visit of its children, and once after this visit.
         */
        export interface ${Names.workerInterface(language)} {

        ${language.concepts.map(concept =>
            `execBefore${Names.concept(concept)}(modelelement: ${Names.concept(concept)}): boolean;
            execAfter${Names.concept(concept)}(modelelement: ${Names.concept(concept)}): boolean;`
        ).join("\n\n") }       
        }`;
    }

    private createImports(language: PiLanguage): string {
        // sort all names alphabetically
        let tmp: string[] = [];
        language.concepts.map(c =>
            tmp.push(Names.concept(c))
        );
        tmp = tmp.sort();

        // the template starts here
        return `
            ${tmp.map(c =>
                `${c}`
            ).join(", ")}`;
    }
}
