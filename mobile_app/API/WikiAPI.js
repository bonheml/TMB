// API/WikiAPI.js

export async function getBirdFromLatinName(bird_name) {
    const url = "https://fr.wikipedia.org/api/rest_v1/page/summary/" + bird_name;
    const payload = await fetch(url);
    const jsonResponse = await payload.json();
    return {
            id: jsonResponse.pageid,
            common_name: jsonResponse.displaytitle,
            scientific_name: bird_name,
            image_path: jsonResponse.thumbnail.source,
            overview: jsonResponse.extract,
    };
}


export function loadBirdsFromList(bird_list) {
    return Promise.all(bird_list.map(getBirdFromLatinName));
}