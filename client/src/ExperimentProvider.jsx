import { createContext, useEffect, useState } from "react"
import dayjs from 'dayjs';

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
        for (const name of (json || [])) {
            const resp = await fetch("http://127.0.0.1:8080/experiment/" + name);
            const json = await resp.json();
            if ((json || {}).error) {
                alert(json.error);
                return;
            }
            exp.push({ name, data: json });
        }

        setExperiments(exp);
    }

    const addExperiment = async () => {
        const name = prompt('Experiment name');
        if (name && /^[0-9_a-zA-Z]+$/g.test(name)) {
            const data = {
                startDate: dayjs().startOf('day'),
                endDate: dayjs().startOf('day').add(7, 'day'),
                description: ''
            };
            setExperiment(name, data);
        }
    }

    const setExperiment = async (name, data, newName = undefined) => {
        const info = { name: newName ? newName : name, data };
        const resp = await fetch("http://127.0.0.1:8080/experiment_set/" + name, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        });
        const json = await resp.json();
        if ((json || {}).error) {
            alert(json.error);
            return;
        }

        setExperiments(prev => {
            const i = prev.findIndex(t => t.name === name);
            if (i < 0) {
                return [...prev, info];
            } else {
                const next = [...prev];
                next[i] = info;
                return next;
            }
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