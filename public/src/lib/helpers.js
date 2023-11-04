

export function isValidJson(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    }
    catch (err) {
        return false;
    }
}




