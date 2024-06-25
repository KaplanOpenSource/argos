export const baseUrl = window.location.port === '8080' ? '' : 'http://127.0.0.1:8080';

export const saveExperimentWithData = async (name, data) => {
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
            alert('save error: ' + json.error);
            return false;
        }
    } catch (e) {
        alert('save crush: ' + e);
        return false;
    }
    return true;
}

export const fetchAllExperiments = async (axiosWithToken) => {
    const json = await axiosWithToken.get("experiment_list");
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
        const json = await axiosWithToken.get(url);
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
}

