import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

import RestClient from './rest-client';
import { ALLOWED_METHODS } from './constants';

const HOST_REGEX = /^((http[s]?):\/\/)(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/; // eslint-disable-line max-len

export function isValidHost(host) {
    if (!isString(host) || !HOST_REGEX.test(host)) {
        throw new Error('You MUST pass valid hostname as "host" param');
    }
}

export function isValidRestClientOptions(options) {
    if (!isPlainObject(options)) {
        throw new Error('You MUST pass object as "options" param');
    }
}

export function isValidResource(path) {
    if (!isString(path)) {
        throw new Error('You MUST pass string as "path" param');
    }
}

export function isValidRequestUrlParam(urlParam) {
    const paramIsString = isString(urlParam);
    const paramIsValidArray = isArray(urlParam) && urlParam.length === 2;

    if (!paramIsString && !paramIsValidArray) {
        throw new Error('You must pass string or array with 2 required values[url, queryParams] as "urlParam" param');
    }
}

export function isValidRequestOptions(options) {
    if (options === undefined) {
        return;
    }

    if (!isPlainObject(options)) {
        throw new Error('You MUST pass object as "options" param');
    }

    if (
        'method' in options
        && (!isString(options.method) || ALLOWED_METHODS.indexOf(options.method.toUpperCase()) === -1)
    ) {
        throw new Error(`
            You are trying use unsupported request method: ${options.method}.
            Supported methods: ${ALLOWED_METHODS.join(', ')}
        `.replace(/^\s*/, ''));
    }

    if ('headers' in options && !isPlainObject(options.headers)) {
        throw new Error('You must pass object as "headers" param');
    }

    if ('fetch' in options && !isPlainObject(options.fetchOptions)) {
        throw new Error('You must pass object as "fetchOptions" param');
    }
}

export function isValidRestClientInstance(restClient) {
    if (!(restClient instanceof RestClient)) {
        throw new Error('You should pass RestClient instance as "restClient" param');
    }
}
