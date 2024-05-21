import { replaceUrlParams } from "../Utils/utils";

export class TrialChoosing {
    constructor(state, setState) {
        this.state = state;
        this.setState = setState;
    }

    static initialState = {
        currTrial: {}
    };

    GetCurrTrial() {
        return TrialChoosing.FindTrialByIndices(this.state.currTrial, this.state.experiments);
    }

    static FindTrialByName({ experimentName, trialTypeName, trialName }, allExperiments) {
        const experimentIndex = allExperiments.findIndex(t => t.name === experimentName);
        if (experimentIndex >= 0) {
            const experiment = allExperiments[experimentIndex];
            const trialTypeIndex = ((experiment || {}).trialTypes || []).findIndex(t => t.name === trialTypeName);
            if (trialTypeIndex >= 0) {
                const trialType = experiment.trialTypes[trialTypeIndex];
                const trialIndex = ((trialType || {}).trials || []).findIndex(t => t.name === trialName);
                if (trialIndex >= 0) {
                    return {
                        experimentName, experimentIndex,
                        trialTypeName, trialTypeIndex,
                        trialName, trialIndex,
                    };
                }
            } else {
                return {
                    experimentName, experimentIndex,
                };
            }
        }
        return {};
    }

    static FindTrialByIndices = (currTrial, allExperiments) => {
        if (currTrial.experimentIndex === undefined) {
            return {};
        }
        const experiment = allExperiments[currTrial.experimentIndex];
        if (currTrial.trialIndex === undefined) {
            return {
                ...currTrial,
                experiment
            }
        }
        const trialType = ((experiment || {}).trialTypes || [])[currTrial.trialTypeIndex];
        const trial = ((trialType || {}).trials || [])[currTrial.trialIndex];
        return {
            ...currTrial,
            experiment,
            trialType,
            trial,
        }
    }

    static ReplaceUrlByTrial(currTrial) {
        const { experimentName, trialTypeName, trialName } = currTrial;
        replaceUrlParams({ experimentName, trialTypeName, trialName, });
    }
}