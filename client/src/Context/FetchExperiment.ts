import { useCallback } from "react";
import { IExperiment } from "../types/types";
import { useTokenStore } from "./useTokenStore";

export const useFetchExperiments = () => {
    const { axiosSecure } = useTokenStore();

    const saveExperimentWithData = useCallback(async (name: string, data: IExperiment): Promise<boolean> => {
        try {
            await axiosSecure().post("experiment_set/" + name, data);
        } catch (e) {
            alert('save error: ' + e);
            console.error(e);
            return false;
        }
        return true;
    }, [axiosSecure]);

    const fetchExperimentList = useCallback(async (): Promise<{ names: string[], error?: string }> => {
        try {
            console.log('fetching experiment list')
            const json = await axiosSecure().get("experiment_list");
            if (!json) {
                alert('You are logged out');
                return { names: [] };
            }
            // console.log('got experiment list', json.data)
            return { names: json.data || [] };
        } catch (e) {
            console.error(e);
            return { names: [], error: 'fetch list error: ' + e };
        }
    }, [axiosSecure]);

    const fetchExperimentListInfo = useCallback(async (): Promise<{ names: { name: string, startDate: string, endDate: string }[], error?: string }> => {
        try {
            console.log('fetching experiment list info')
            const json = await axiosSecure().get("experiment_list_info");
            if (!json) {
                alert('You are logged out');
                return { names: [] };
            }
            console.log('got experiment list info', json.data)
            return { names: json.data || [] };
        } catch (e) {
            console.error(e);
            return { names: [], error: 'fetch list error: ' + e };
        }
    }, [axiosSecure]);

    const fetchExperiment = useCallback(async (name: string): Promise<{ experiment?: IExperiment, error?: string }> => {
        try {
            console.log('fetching experiment', name)
            const url = "experiment/" + name.replaceAll(' ', '%20');
            const json = await axiosSecure().get(url);
            const experiment = json.data;
            // console.log('got experiment', experiment)
            if ((experiment || {}).name !== name) {
                return { error: `corrupted experiment ${name}` };
            }
            return { experiment };
        } catch (error) {
            console.error(error);
            return { error };
        }
    }, [axiosSecure]);

    const fetchAllExperiments = useCallback(async (): Promise<IExperiment[]> => {
        // TODO: reading all the experiments data just to get the dates and so
        // this can be optimized by fetching limited data from the server
        const { names, error } = await fetchExperimentList();
        const errors: string[] = [];
        const exp: IExperiment[] = [];
        if (error) {
            errors.push(error);
        } else {
            for (const name of names || []) {
                const { experiment, error } = await fetchExperiment(name);
                if (error) {
                    errors.push(error);
                } else if (experiment) {
                    exp.push(experiment);
                }
            }
        }

        if (errors.length) {
            alert(errors.join('\n'));
        }

        return exp;
    }, [axiosSecure]);

    return {
        fetchAllExperiments,
        saveExperimentWithData,
        fetchExperimentListInfo,
        fetchExperiment,
    }
}
