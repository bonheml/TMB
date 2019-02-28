function randGenerator() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function idGenerator() {
    genId = "";
    for (let i=0; i < 20; i++) {
        genId += randGenerator();
    }
    console.log(genId);
    return genId;
}


export async function getBirdFromLatinName(bird_name) {
    const url = "https://fr.wikipedia.org/api/rest_v1/page/summary/" + bird_name;
    const payload = await fetch(url);
    const jsonResponse = await payload.json();
    return {
            id: idGenerator(),
            common_name: jsonResponse.displaytitle,
            scientific_name: bird_name,
            image_path: jsonResponse.thumbnail.source,
            overview: jsonResponse.extract,
    };
}


export function loadBirdsFromList(bird_list) {
    return Promise.all(bird_list.map(getBirdFromLatinName));
}