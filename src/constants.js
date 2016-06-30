export const START_SLASH = /^\//;
export const END_SLASH = /\/$/;
export const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';
export const URL_ENCODED_CONTENT_TYPE = 'application/x-www-form-urlencoded; charset=utf-8';
export const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
export const DEFAULT_OPTIONS = {
    headers: {
        accept: JSON_CONTENT_TYPE.split(';')[0],
        contentType: JSON_CONTENT_TYPE
    },
    fetch: {
        mode: 'cors',
        cache: 'default'
    },
    trailing: false,
    interceptors: {
        request: [],
        response: []
    }
};
