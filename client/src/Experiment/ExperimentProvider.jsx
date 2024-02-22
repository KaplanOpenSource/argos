import { createContext, useEffect, useReducer, useState } from "react"
import dayjs from 'dayjs';
import { changeByName, createNewName, parseUrlParams, replaceUrlParams } from "../Utils/utils";
import { applyOperation } from 'fast-json-patch';

export const experimentContext = createContext();

// export const useExperiment = useContext(experimentContext);

export const ExperimentProvider = ({ children }) => {
    const actions = {
        SET_ALL_EXPS: 1,
        ADD_EXP: 2,
        DEL_EXP: 3,
        CHANGE_EXP: 4,
    };
    const initialState = {
        experiments: [],
    }
    const reducer = (state, action) => {
        switch (action.type) {
            case actions.SET_ALL_EXPS:
                return { ...state, experiments: action.payload };
            case actions.ADD_EXP:
                const name = createNewName(state.experiments, 'New Experiment');
                const newExp = {
                    name,
                    startDate: dayjs().startOf('day'),
                    endDate: dayjs().startOf('day').add(7, 'day'),
                    description: '',
                };
                return { ...state, experiments: [...state.experiments, newExp] };
            case actions.DEL_EXP:
                return { ...state, experiments: state.experiments.filter(t => t.name !== action.name) };
            case actions.CHANGE_EXP:
                const experiments = applyOperation(state.experiments, action.operation).newDocument;
                return { ...state, experiments };
            default:
                return state;
        }
    };
    const [state, dispatch] = useReducer(reducer, initialState);
    const experiments = state.experiments;

    const [currTrialInternal, setCurrTrialInternal] = useState();
    const [showExperiments, setShowExperiments] = useState(true);
    const [selection, setSelection] = useState([]);

    const baseUrl = window.location.port === '8080' ? '' : 'http://127.0.0.1:8080';

    const getExperimentList = async () => {
        const resp = await fetch(baseUrl + "/experiment_list");
        const json = await resp.json();
        if ((json || {}).error) {
            alert(json.error);
            return;
        }

        // TODO: reading all the experiments data just to get the dates and so
        // this can be optimized by fetching limited data from the server
        const exp = [];
        const errors = [];
        for (const name of (json || [])) {
            const resp = await fetch(baseUrl + "/experiment/" + name);
            const json = await resp.json();
            if ((json || {}).error) {
                errors.push(json.error);
                continue;
            }
            if ((json || {}).name !== name) {
                errors.push(`corrupted experiment ${name}`);
                continue;
            }
            exp.push(json);
        }
        if (errors.length) {
            alert(errors.join('\n'));
            return;
        }

        dispatch({ type: actions.SET_ALL_EXPS, payload: exp });
        const { experimentName, trialTypeName, trialName } = parseUrlParams();
        setCurrTrial({ experimentName, trialTypeName, trialName }, exp);
    }

    const deleteExperiment = (name) => {
        dispatch({ type: actions.DEL_EXP, name: name });
    }

    const addExperiment = async () => {
        dispatch({ type: actions.ADD_EXP });
    }

    const changeExperiment = (operation) => {
        dispatch({ type: actions.CHANGE_EXP, operation });
    }

    // Obsolete
    const setExperiment = (name, data) => {
        const exp = changeByName(state.experiments, name, data);
        dispatch({ type: actions.SET_ALL_EXPS, payload: exp });
    }


    const saveExperiment = async (name) => {
        const data = experiments.find(t => t.name === name);
        try {
            const resp = await fetch(baseUrl + "/experiment_set/" + name, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const json = await resp.json();
            if ((json || {}).error) {
                alert(json.error);
                return false;
            }
        } catch (e) {
            alert(e);
            return false;
        }
        return true;
    }

    const currTrial = currTrialInternal
        ? {
            experiment: experiments[currTrialInternal.experimentIndex],
            experimentName: currTrialInternal.experimentName,
            trialType: experiments[currTrialInternal.experimentIndex].trialTypes[currTrialInternal.trialTypeIndex],
            trialTypeName: currTrialInternal.trialTypeName,
            trial: experiments[currTrialInternal.experimentIndex].trialTypes[currTrialInternal.trialTypeIndex].trials[currTrialInternal.trialIndex],
            trialName: currTrialInternal.trialName,
        }
        : {};

    const setCurrTrial = (newCurrTrialStruct, theExperiments = undefined) => {
        theExperiments = theExperiments || experiments;
        if (newCurrTrialStruct) {
            const { experimentName, trialTypeName, trialName } = newCurrTrialStruct;
            const experimentIndex = theExperiments.findIndex(t => t.name === experimentName);
            if (experimentIndex >= 0) {
                const experiment = theExperiments[experimentIndex];
                const trialTypeIndex = experiment.trialTypes.findIndex(t => t.name === trialTypeName);
                if (trialTypeIndex >= 0) {
                    const trialType = experiment.trialTypes[trialTypeIndex];
                    const trialIndex = trialType.trials.findIndex(t => t.name === trialName);
                    if (trialIndex >= 0) {
                        const trial = trialType.trials[trialIndex];
                        setCurrTrialInternal({
                            experimentName, experimentIndex,
                            trialTypeName, trialTypeIndex,
                            trialName, trialIndex,
                        });
                        replaceUrlParams({
                            experimentName,
                            trialTypeName,
                            trialName,
                        });
                        return;
                    }
                }
            }
        }
        setCurrTrialInternal();
        replaceUrlParams({
            experimentName: undefined,
            trialTypeName: undefined,
            trialName: undefined,
        });
    }

    const trialData = currTrialInternal
        ? experiments[currTrialInternal.experimentIndex]
            .trialTypes[currTrialInternal.trialTypeIndex]
            .trials[currTrialInternal.trialIndex]
        : undefined;

    const setTrialData = async (data) => {
        if (!currTrialInternal) {
            console.log(`trying to set trial data without current trial\n`, data);
            return;
        }
        const e = JSON.parse(JSON.stringify(experiments[currTrialInternal.experimentIndex]));
        e.trialTypes[currTrialInternal.trialTypeIndex].trials[currTrialInternal.trialIndex] = data;
        setExperiment(currTrialInternal.experimentName, e)
    }

    useEffect(() => {
        getExperimentList();
    }, [])

    const store = {
        experiments,
        deleteExperiment,
        addExperiment,
        changeExperiment,
        setExperiment,
        saveExperiment,
        setCurrTrial,
        currTrial,
        trialData,
        setTrialData,
        showExperiments,
        setShowExperiments,
        selection,
        setSelection
    };

    return (
        <experimentContext.Provider value={store}>
            {children}
        </experimentContext.Provider>
    )
}