import { useCallback, useContext } from "react";
import { useTokenStore } from "./useTokenStore";

export const useFetchExperiments = () => {
    const { axiosToken } = useTokenStore();

    const saveExperimentWithData = useCallback(async (name, data) => {
        try {
            const json = await axiosToken().post("experiment_set/" + name, data);
            if ((json || {}).error) {
                alert('save error: ' + json.error);
                return false;
            }
        } catch (e) {
            alert('save crush: ' + e);
            return false;
        }
        return true;
    }, [axiosToken]);

    const fetchAllExperiments = useCallback(async () => {
        try {
            const json = await axiosToken().get("experiment_list");
            if (!json || (json || {}).error) {
                alert(!json ? 'You are logged out' : 'Fetch experiments error ' + (json?.error || ''));
                return;
            }

            // TODO: reading all the experiments data just to get the dates and so
            // this can be optimized by fetching limited data from the server
            const exp = [];
            const errors = [];
            for (const name of (json.data || [])) {
                const url = "experiment/" + name.replaceAll(' ', '%20');
                const json = await axiosToken().get(url);
                if ((json || {}).error) {
                    errors.push('fetch ' + name + ': ' + json.error);
                    continue;
                }
                const curr = json.data;
                if ((curr || {}).name !== name) {
                    errors.push(`corrupted experiment ${name}`);
                    continue;
                }
                exp.push(curr);
            }
            if (errors.length) {
                alert(errors.join('\n'));
                return;
            }

            return exp;
        } catch (e) {
            alert('fetch crush: ' + e);
        }
        return;
    }, [axiosToken]);

    return {
        fetchAllExperiments,
        saveExperimentWithData,
    }
}
