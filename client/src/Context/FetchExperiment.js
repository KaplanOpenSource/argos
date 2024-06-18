export const baseUrl = window.location.port === '8080' ? '' : 'http://127.0.0.1:8080';

export const saveExperimentWithData = async (name, data) => {
    try {


        $$$$ TODO: Add to every fetch this header:
        headers: {
            Authorization: 'Bearer ' + props.token
          }

          https://dev.to/nagatodev/how-to-add-login-authentication-to-a-flask-and-react-application-23i7
          look at  Profile.js  on that page ^^




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

export const fetchAllExperiments = async () => {
    const resp = await fetch(baseUrl + "/experiment_list");
    const json = await resp.json();
    if ((json || {}).error) {
        alert('fetch list: ' + json.error);
        return;
    }

    // TODO: reading all the experiments data just to get the dates and so
    // this can be optimized by fetching limited data from the server
    const exp = [];
    const errors = [];
    for (const name of (json || [])) {
        const url = baseUrl + "/experiment/" + name.replaceAll(' ', '%20');
        const resp = await fetch(url);
        const json = await resp.json();
        if ((json || {}).error) {
            errors.push('fetch ' + name + ': ' + json.error);
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

