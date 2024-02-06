import { createContext, useEffect, useState } from "react"
import dayjs from 'dayjs';
import { createNewName } from "../Utils/utils";

export const experimentContext = createContext();

// export const useExperiment = useContext(experimentContext);

export const ExperimentProvider = ({ children }) => {
    const [experiments, setExperiments] = useState([]);
    const [currTrialInternal, setCurrTrialInternal] = useState();
    const [showExperiments, setShowExperiments] = useState(true);

    const getExperimentList = async () => {
        const resp = await fetch("http://127.0.0.1:8080/experiment_list");
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
            const resp = await fetch("http://127.0.0.1:8080/experiment/" + name);
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

        setExperiments(exp);
    }

    const addExperiment = async () => {
        const name = createNewName(experiments, 'New Experiment');
        const data = {
            name,
            startDate: dayjs().startOf('day'),
            endDate: dayjs().startOf('day').add(7, 'day'),
            description: '',
        };
        setExperiment(name, data);
    }

    const setExperiment = async (name, data) => {
        // const nameData = { name: newName ? newName : name, data };
        const resp = await fetch("http://127.0.0.1:8080/experiment_set/" + name, {
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
            return;
        }

        setExperiments(prev => {
            const i = prev.findIndex(t => t.name === name);
            const newArr = [...prev];
            newArr[i >= 0 ? i : newArr.length] = data;
            return newArr;
        });
    }

    // const replace = (arr, index, data) => {
    //     const newArr = [...arr];
    //     newArr[index >= 0 ? index : newArr.length] = data;
    //     return newArr
    // }

    // const findTrial = ({ experimentName, trialTypeName, trialName }) => {
    //     const ie = experiments.findIndex(t => t.name === experimentName);
    //     if (!experiments) return {}
    //     if (!)
    // }
    const currTrial = currTrialInternal
        ? {
            experiment: currTrialInternal.experiment,
            experimentName: currTrialInternal.experimentName,
            trialType: currTrialInternal.trialType,
            trialTypeName: currTrialInternal.trialTypeName,
            trial: currTrialInternal.trial,
            trialName: currTrialInternal.trialName,
        }
        : {};

    const setCurrTrial = (newCurrTrialStruct) => {
        if (newCurrTrialStruct) {
            const { experimentName, trialTypeName, trialName } = newCurrTrialStruct;
            const experimentIndex = experiments.findIndex(t => t.name === experimentName);
            if (experimentIndex >= 0) {
                const experiment = experiments[experimentIndex];
                const trialTypeIndex = experiment.trialTypes.findIndex(t => t.name === trialTypeName);
                if (trialTypeIndex >= 0) {
                    const trialType = experiment.trialTypes[trialTypeIndex];
                    const trialIndex = trialType.trials.findIndex(t => t.name === trialName);
                    if (trialIndex >= 0) {
                        const trial = trialType.trials[trialIndex];
                        setCurrTrialInternal({
                            experimentName, experimentIndex, experiment,
                            trialTypeName, trialTypeIndex, trialType,
                            trialName, trialIndex, trial,
                        });
                        return;
                    }
                }
            }
        }
        setCurrTrialInternal();
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
        const e = JSON.parse(JSON.stringify(currTrialInternal.experiment));
        e.trialTypes[currTrialInternal.trialTypeIndex].trial[currTrialInternal.trialIndex] = data;
        setExperiment(currTrialInternal.experimentName, e)
    }

    useEffect(() => {
        getExperimentList();
    }, [])

    const store = {
        experiments,
        setExperiments,
        setExperiment,
        addExperiment,
        getExperimentList,
        setCurrTrial,
        currTrial,
        trialData,
        setTrialData,
        showExperiments,
        setShowExperiments
    };

    return (
        <experimentContext.Provider value={store}>
            {children}
        </experimentContext.Provider>
    )
}