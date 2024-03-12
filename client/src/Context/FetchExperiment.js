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
            alert(json.error);
            return false;
        }
    } catch (e) {
        alert(e);
        return false;
    }
    return true;
}

export const fetchAllExperiments = async () => {
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

    return exp;
}

