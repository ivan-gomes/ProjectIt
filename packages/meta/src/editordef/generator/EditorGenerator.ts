import { PiLanguageEditor } from "../metalanguage/PiLanguageEditor";
import { Helpers } from "../../utils/Helpers";
import { ContextTemplate } from "./templates/ContextTemplate";
import { UserTemplate } from "../../languagedef/generator/templates/UserTemplate";
import { EditorTemplate } from "./templates/EditorTemplate";
import { EditorIndexTemplate } from "./templates/EditorIndexTemplate";
import { Names } from "../../utils/Names";
import { EnumerationSelectBoxTemplate } from "./templates/EnumerationSelectBoxTemplate";
import { MainProjectionalEditorTemplate } from "./templates/MainProjectionalEditorTemplate";
import { ProjectionTemplate } from "./templates/ProjectionTemplate";
import { ActionsTemplate } from "./templates/ActionsTemplate";
import { PiLanguageUnit } from "../../languagedef/metalanguage/PiLanguage";
import * as fs from "fs";
import { EDITOR_GEN_FOLDER, EDITOR_FOLDER } from "../../utils/GeneratorConstants";
import { PiLogger } from "../../../../core/src/util/PiLogging";

const LOGGER = new PiLogger("EditorGenerator"); // .mute();

export class EditorGenerator {
    public outputfolder: string = ".";
    protected editorGenFolder: string;
    protected editorFolder: string;
    language: PiLanguageUnit;

    protected userTemplate = new UserTemplate();

    constructor() {    }

    generate(editor: PiLanguageEditor, verbose?: boolean): void {
        this.editorFolder = this.outputfolder + "/" + EDITOR_FOLDER;
        this.editorGenFolder = this.outputfolder + "/" + EDITOR_GEN_FOLDER;

        if (verbose) LOGGER.log("Generating editor '" + editor.name + "' in folder " + this.editorGenFolder);
        const actions = new ActionsTemplate();
        const projection = new ProjectionTemplate();
        const enumProjection = new EnumerationSelectBoxTemplate();
        const contextTemplate = new ContextTemplate();
        const projectionalEditorTemplate = new MainProjectionalEditorTemplate();
        const editorTemplate = new EditorTemplate();
        const editorIndexTemplate = new EditorIndexTemplate();

        //Prepare folders
        Helpers.createDirIfNotExisting(this.editorFolder, verbose);
        Helpers.createDirIfNotExisting(this.editorGenFolder, verbose);

        //  Generate it
        if (verbose) LOGGER.log("Generating projection default");
        var projectionfileDefault = Helpers.pretty(projection.generateProjectionDefault(this.language), "Projection Default", verbose);
        fs.writeFileSync(`${this.editorGenFolder}/${Names.projectionDefault(this.language)}.ts`, projectionfileDefault);

        if (verbose) LOGGER.log("Generating enumeration projections");
        var enumProjectionFile = Helpers.pretty(enumProjection.generate(this.language), "Enumeration Projections", verbose);
        fs.writeFileSync(`${this.editorGenFolder}/${Names.enumProjections(this.language)}.ts`, enumProjectionFile);

        if (verbose) LOGGER.log("Generating default actions");
        var defaultActionsFile = Helpers.pretty(actions.generateDefaultActions(this.language), "DefaultActions", verbose);
        fs.writeFileSync(`${this.editorGenFolder}/${Names.defaultActions(this.language)}.ts`, defaultActionsFile);

        if (verbose) LOGGER.log("Generating manual actions");
        var manualActionsFile = Helpers.pretty(actions.generateManualActions(this.language), "ManualActions", verbose);
        Helpers.generateManualFile(`${this.editorFolder}/${Names.manualActions(this.language)}.ts`, manualActionsFile, "ManualActions");
        
        if (verbose) LOGGER.log("Generating actions");
        var actionsFile = Helpers.pretty(actions.generateActions(this.language), "Actions", verbose);
        fs.writeFileSync(`${this.editorGenFolder}/${Names.actions(this.language)}.ts`, actionsFile);

        if (verbose) LOGGER.log("Generating context");
        var contextFile = Helpers.pretty(contextTemplate.generateContext(this.language), "Context", verbose);
        fs.writeFileSync(`${this.editorGenFolder}/${Names.context(this.language)}.ts`, contextFile);

        if (verbose) LOGGER.log("Generating MainProjectionalEditor");
        var projectionalEditorFile = Helpers.pretty(projectionalEditorTemplate.generateEditor(this.language, true), "MainProjectionalEditor", verbose);
        fs.writeFileSync(`${this.editorGenFolder}/${Names.mainProjectionalEditor(this.language)}.tsx`, projectionalEditorFile);

        if (verbose) LOGGER.log("Generating ProjectionalEditorManual");
        var projectionalEditorManualFile = Helpers.pretty(projection.generateProjection(this.language), "ProjectionalEditorManual", verbose);
        Helpers.generateManualFile(`${this.editorFolder}/${Names.projection(this.language)}.ts`, projectionalEditorManualFile, "ManualProjections");

        if (verbose) LOGGER.log("Generating Editor");
        var editorFile = Helpers.pretty(editorTemplate.generateEditor(this.language, true), "Editor", verbose);
        fs.writeFileSync(`${this.editorGenFolder}/${Names.editor(this.language)}.ts`, editorFile);
        
        if (verbose) LOGGER.log("Generating editor gen index");
        var editorIndexGenFile = Helpers.pretty(editorIndexTemplate.generateGenIndex(this.language), "Editor Gen Index", verbose);
        fs.writeFileSync(`${this.editorGenFolder}/index.ts`, editorIndexGenFile);

        if (verbose) LOGGER.log("Generating editor index");
        var editorIndexFile = Helpers.pretty(editorIndexTemplate.generateIndex(this.language), "Editor Index", verbose);
        fs.writeFileSync(`${this.editorFolder}/index.ts`, editorIndexFile);

        if (verbose) LOGGER.log("Succesfully generated editor");
    }

}