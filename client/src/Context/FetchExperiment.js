import { useCallback, useContext } from "react";
import { TokenContext } from "../App/TokenContext";

export const useFetchExperiments = () => {
    const { axiosToken } = useContext(TokenContext);

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
        const json = await axiosToken().get("experiment_list");
        if ((json || {}).error) {
            alert('fetch list: ' + json.error);
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
    }, [axiosToken]);

    return {
        fetchAllExperiments,
        saveExperimentWithData,
    }
}
