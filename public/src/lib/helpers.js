export function isValidJson(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    }
    catch (err) {
        return false;
    }
}

export async function guard(func) {
    try {
        const res = await func();
        return {
            result: res,
            error: null
        };
    }
    catch (err) {
        return {
            result: null,
            error: err
        };
    }
}

// For syncronous guarding
guard.let = function (func) {
    try {
        const res = func();
        return {
            result: res,
            error: null
        };
    }
    catch (err) {
        return {
            result: null,
            error: err
        };
    }
};


