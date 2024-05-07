import { replaceUrlParams } from "../Utils/utils";

export class TrialChoosing {
    static FindTrialByName({ experimentName, trialTypeName, trialName }, allExperiments) {
        const experimentIndex = allExperiments.findIndex(t => t.name === experimentName);
        if (experimentIndex >= 0) {
            const experiment = allExperiments[experimentIndex];
            const trialTypeIndex = experiment.trialTypes.findIndex(t => t.name === trialTypeName);
            if (trialTypeIndex >= 0) {
                const trialType = experiment.trialTypes[trialTypeIndex];
                const trialIndex = trialType.trials.findIndex(t => t.name === trialName);
                if (trialIndex >= 0) {
                    return {
                        experimentName, experimentIndex,
                        trialTypeName, trialTypeIndex,
                        trialName, trialIndex,
                    };
                }
            }
        }
        return {};
    }

    static FindTrialByIndices = (currTrial, allExperiments) => {
        if (currTrial.trialName) {
            const experiment = allExperiments[currTrial.experimentIndex];
            const trialType = experiment.trialTypes[currTrial.trialTypeIndex];
            const trial = trialType.trials[currTrial.trialIndex];
            return {
                ...currTrial,
                experiment,
                trialType,
                trial,
            }
        }
        return {};
    }


    static ReplaceUrlByTrial(currTrial) {
        const { experimentName, trialTypeName, trialName } = currTrial;
        replaceUrlParams({ experimentName, trialTypeName, trialName, });
    }
}