import {
    Names,
    PROJECTITCORE,
    EDITOR_FOLDER,
    VALIDATOR_GEN_FOLDER
} from "../../../utils/";
import { PiLanguage } from "../../metalanguage";

export class ConfigurationTemplate {

    generate(language: PiLanguage, relativePath: string): string {
        const configurationName = Names.configuration(language);
        const workerName = Names.checkerInterface(language);
        return `
            import { ${Names.PiProjection}, ${Names.PiActions}, ${Names.PiModelInitialization} } from "${PROJECTITCORE}";
            import { ${Names.customActions(language)}, ${Names.customProjection(language)} } from "${relativePath}${EDITOR_FOLDER}";
            import { ${Names.initialization(language)} } from "${relativePath}${EDITOR_FOLDER}/${Names.initialization(language)}";
            import { ${workerName } } from "${relativePath}${VALIDATOR_GEN_FOLDER}";
            
            /**
             * Class ${configurationName} is TODO add comment
             */
            class ${configurationName} {
                customProjection: ${Names.PiProjection}[] = [new ${Names.customProjection(language)}("manual")];
                customActions: ${Names.PiActions}[] = [new ${Names.customActions(language)}()];
                customInitialization: ${Names.PiModelInitialization} = new ${Names.initialization(language)}();
                customValidations: ${workerName}[] = [];
            }
            
            export const projectitConfiguration = new ${configurationName}();
        `;
    }
}
