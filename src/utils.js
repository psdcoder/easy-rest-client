import isPlainObject from 'lodash/isPlainObject';

export function buildUrl(path, queryParams, trailing = false) {
    let resultPath = path;

    if (trailing) {
        resultPath += '/';
    }

    if (isPlainObject(queryParams) && Object.keys(queryParams).length) {
        resultPath += `?${encodeUrl(queryParams)}`;
    }

    return resultPath;
}

export function encodeUrl(data) {
    const dataKeys = Object.keys(data);
    const dataLength = dataKeys.length;
    let encodedData = '';

    dataKeys.forEach((param, index) => {
        encodedData += `${encodeURIComponent(param)}=${encodeURIComponent(data[param])}`;

        if (index + 1 < dataLength) {
            encodedData += '&';
        }
    });

    return encodedData;
}
