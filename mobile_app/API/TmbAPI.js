function _prepareFormData(uri, mediaType, previousResults) {
    console.log(uri, mediaType, previousResults);
    const formData = new FormData();
    let uriParts = uri.split('.');
    let extType = uriParts[uriParts.length - 1];

    formData.append('file', {
        uri,
        name: `file.${extType}`,
        type: `${mediaType}/${extType}`,
    });
    if (previousResults) {
        formData.append('result', JSON.stringify(previousResults))
    }

    return formData;
}

export async function predictBirds(uri, mediaType, previousResults) {
    const url = "https://tmb-api-prod.herokuapp.com/bird_detection";
    const formData = _prepareFormData(uri, mediaType, previousResults);
    let birdList = [];

    const payload = await fetch(url, {method: 'POST', body: formData,});

    if (!payload.ok) {
        return {hasError: true, results: undefined, bird_list: birdList}
    }

    const jsonResponse = await payload.json();
    const results = jsonResponse.result;

    for (i = 0; i < results.length; i++) {
        const specie = results[i].species.replace(/ /g, "_");
        birdList.push(specie);
    }

    return {hasError: false, results: results, bird_list: birdList}
}