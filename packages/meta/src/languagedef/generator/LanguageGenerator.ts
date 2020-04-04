import * as fs from "fs";
import { PiLogger } from "../../../../core/src/util/PiLogging";
import { ModelCreatorTemplate } from "./conveniences/ModelCreatorTemplate";
import { ENVIRONMENT_GEN_FOLDER, Helpers, LANGUAGE_GEN_FOLDER, LANGUAGE_UTILS_GEN_FOLDER, Names } from "../../utils";
import { PiLanguageUnit } from "../metalanguage/PiLanguage";
import {
    AllConceptsTemplate,
    ConceptTemplate,
    EnumerationTemplate,
    EnvironmentTemplate,
    IndexTemplate,
    MetaTypeTemplate,
    PiReferenceTemplate,
    UnionTemplate,
    UnparserTemplate,
    WalkerTemplate,
    WorkerInterfaceTemplate
} from "./templates";

const LOGGER = new PiLogger("LanguageGenerator").mute();
export class LanguageGenerator {
    public outputfolder: string = ".";
    protected languageGenFolder: string;
    protected environmentGenFolder: string;
    utilsGenFolder: string;

    constructor() {}

    generate(language: PiLanguageUnit): void {
        LOGGER.log("Generating language '" + language.name + "' in folder " + this.outputfolder + "/" + LANGUAGE_GEN_FOLDER);
        this.languageGenFolder = this.outputfolder + "/" + LANGUAGE_GEN_FOLDER;
        this.utilsGenFolder = this.outputfolder + "/" + LANGUAGE_UTILS_GEN_FOLDER;
        this.environmentGenFolder = this.outputfolder + "/" + ENVIRONMENT_GEN_FOLDER;

        const conceptTemplate = new ConceptTemplate();
        const metaTypeTemplate = new MetaTypeTemplate();
        const enumerationTemplate = new EnumerationTemplate();
        const typeTemplate = new UnionTemplate();
        const languageIndexTemplate = new IndexTemplate();
        const allConceptsTemplate = new AllConceptsTemplate();
        const piReferenceTemplate = new PiReferenceTemplate();
        const environmentTemplate = new EnvironmentTemplate();
        const walkerTemplate = new WalkerTemplate();
        const workerTemplate = new WorkerInterfaceTemplate();
        const unparserTemplate = new UnparserTemplate();
        const modelcreatorTemplate = new ModelCreatorTemplate();

        //Prepare folders
        Helpers.createDirIfNotExisting(this.languageGenFolder);
        Helpers.createDirIfNotExisting(this.utilsGenFolder);
        Helpers.createDirIfNotExisting(this.environmentGenFolder);
        Helpers.deleteFilesInDir(this.languageGenFolder);
        Helpers.deleteFilesInDir(this.utilsGenFolder);
        Helpers.deleteFilesInDir(this.environmentGenFolder);

        // set relative path to get the imports right
        let relativePath = "../";
 
        //  Generate it
        language.classes.forEach(concept => {
            LOGGER.log("Generating concept: " + concept.name);
            var generated = Helpers.pretty(conceptTemplate.generateConcept(concept, relativePath), "concept " + concept.name);
            fs.writeFileSync(`${this.languageGenFolder}/${Names.concept(concept)}.ts`, generated);
        });

        language.enumerations.forEach(enumeration => {
            LOGGER.log("Generating enumeration: " + enumeration.name);
            var generated = Helpers.pretty(enumerationTemplate.generateEnumeration(enumeration, relativePath), "enumeration " + enumeration.name);
            fs.writeFileSync(`${this.languageGenFolder}/${Names.enumeration(enumeration)}.ts`, generated);
        });

        language.unions.forEach(union => {
            LOGGER.log("Generating union: " + union.name);
            var generated = Helpers.pretty(typeTemplate.generateUnion(union, relativePath), "union " + union.name);
            fs.writeFileSync(`${this.languageGenFolder}/${Names.union(union)}.ts`, generated);
        });

        // TODO generate language.interfaces

        // the following classes do not need the relative path for their imports
        LOGGER.log("Generating metatype info: " + language.name + ".ts");
        var languageFile = Helpers.pretty(metaTypeTemplate.generateMetaType(language), "Model info");
        fs.writeFileSync(`${this.languageGenFolder}/${Names.metaType(language)}.ts`, languageFile);

        LOGGER.log("Generating " + Names.allConcepts(language) + " class: " + Names.allConcepts(language) + ".ts");
        var allConceptsFile = Helpers.pretty(allConceptsTemplate.generateAllConceptsClass(language), "All Concepts Class");
        fs.writeFileSync(`${this.languageGenFolder}/${Names.allConcepts(language)}.ts`, allConceptsFile);

        LOGGER.log("Generating language index: index.ts");
        var languageIndexFile = Helpers.pretty(languageIndexTemplate.generateIndex(language), "Language Index");
        fs.writeFileSync(`${this.languageGenFolder}/index.ts`, languageIndexFile);

        // set relative path to an extra level to get the imports right
        relativePath = "../../";

        LOGGER.log("Generating PeElementReference.ts");
        var referenceFile = Helpers.pretty(piReferenceTemplate.generatePiReference(language, relativePath), "PiElementReference");
        fs.writeFileSync(`${this.languageGenFolder}/PiElementReference.ts`, referenceFile);

        LOGGER.log("Generating environment");
        var environmentFile = Helpers.pretty(environmentTemplate.generateEnvironment(language, relativePath), "Language Environment");
        fs.writeFileSync(`${this.environmentGenFolder}/${Names.environment(language)}.tsx`, environmentFile);

        // generate the utility classes
        LOGGER.log("Generating language walker: " + Names.walker(language) + ".ts");
        var walkerFile = Helpers.pretty(walkerTemplate.generateWalker(language, relativePath), "Walker Class");
        fs.writeFileSync(`${this.utilsGenFolder}/${Names.walker(language)}.ts`, walkerFile);

        LOGGER.log("Generating language worker: " + Names.workerInterface(language) + ".ts");
        var workerFile = Helpers.pretty(workerTemplate.generateWorkerInterface(language, relativePath), "WorkerInterface Class");
        fs.writeFileSync(`${this.utilsGenFolder}/${Names.workerInterface(language)}.ts`, workerFile);

        LOGGER.log("Generating language unparser: " + Names.unparser(language) + ".ts");
        var unparserFile = Helpers.pretty(unparserTemplate.generateUnparser(language, relativePath), "Unparser Class");
        fs.writeFileSync(`${this.utilsGenFolder}/${Names.unparser(language)}.ts`, unparserFile);

        // generate the convenience classes
        LOGGER.log(`Generating language model creator: ${language.name}Creator.ts`);
        var creatorFile = Helpers.pretty(modelcreatorTemplate.generateModelCreator(language, relativePath), "Model Creator Class");
        fs.writeFileSync(`${this.utilsGenFolder}/${language.name}Creator.ts`, creatorFile);

        LOGGER.log("Succesfully generated language '" + language.name + "'"); // TODO check if it is really succesfull
    }
}
