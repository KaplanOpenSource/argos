import { createContext, useEffect, useState } from "react"
import dayjs from 'dayjs';
import { createNewName } from "./utils";

export const experimentContext = createContext();

// export const useExperiment = useContext(experimentContext);

export const ExperimentProvider = ({ children }) => {
    const [experiments, setExperiments] = useState([]);

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

    useEffect(() => {
        getExperimentList();
    }, [])

    const store = {
        experiments, setExperiments, setExperiment, addExperiment, getExperimentList
    };

    return (
        <experimentContext.Provider value={store}>
            {children}
        </experimentContext.Provider>
    )
}