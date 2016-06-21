import fetch from 'isomorphic-fetch';
import assign from 'lodash/assign';
import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

import RestClientResource from './resource';
import { encodeUrl } from './utils';
import {
    START_SLASH,
    END_SLASH,
    ALLOWED_METHODS,
    DEFAULT_OPTIONS,
    JSON_CONTENT_TYPE,
    URL_ENCODED_CONTENT_TYPE
} from './constants';

const JSON_ONLY_CONTENT_TYPE = JSON_CONTENT_TYPE.split(';')[0];

export default class RestClient {
    constructor(host, options) {
        this.setHost(host);
        this.setOptions(assign(DEFAULT_OPTIONS, options));
    }
    getHost() {
        return this._host;
    }
    setHost(host) {
        if (!isString(host)) {
            throw new Error('You MUST pass string as "host"');
        }

        this._host = host.replace(END_SLASH, '');
    }
    getOptions() {
        return this._options;
    }
    setOptions(options) {
        if (!isObject(options)) {
            throw new Error('You MUST pass object as "options"');
        }

        this._options = assign(this._options || {}, options);
    }
    resource(path) {
        if (!isString(path)) {
            throw new Error('You MUST pass string as "path" to resource');
        }

        return new RestClientResource(this, path);
    }
    request(method, url, body = null, headers = {}, fetchOptions = {}) {
        if (!isString(method)) {
            throw new Error('You MUST pass string as "method",');
        }

        const uppercasedMethod = method.toUpperCase();

        if (ALLOWED_METHODS.indexOf(uppercasedMethod) === -1) {
            throw new Error(`
                You are trying use unsupported request method: ${method}.
                Supported methods: ${ALLOWED_METHODS.join(', ')}
            `.replace(/^\s*/, ''));
        }

        if (!isString(url)) {
            throw new Error('You must pass string as "url"');
        }

        if (!isObject(headers)) {
            throw new Error('You must pass object as "headers"');
        }

        if (!isObject(headers)) {
            throw new Error('You must pass object as "headers"');
        }

        let request = {
            url: START_SLASH.test(url) ? `${this._host}${url}` : url,
            options: Object.assign({}, this._options.fetch, fetchOptions, {
                method: uppercasedMethod,
                headers: Object.assign({}, this._options.headers, headers)
            })
        };

        if (body) {
            const contentType = request.options.headers.contentType;

            if (
                (window.ArrayBuffer && body instanceof window.ArrayBuffer)
                || (window.Blob && body instanceof window.Blob)
                || (window.FormData && body instanceof window.FormData)
            ) {
                if (contentType) {
                    delete request.options.headers.contentType;
                }

                request.options.body = body;
            } else if (contentType && contentType === JSON_CONTENT_TYPE) {
                request.options.body = JSON.stringify(body);
            } else if (contentType && contentType === URL_ENCODED_CONTENT_TYPE) {
                request.options.body = encodeUrl(body);
            } else {
                request.options.body = body;
            }
        }

        if (this._options.interceptors && isArray(this._options.interceptors.request)) {
            this._options.interceptors.request.forEach(interceptor => {
                request = interceptor(request);
            });
        }

        request.options.headers = this._formatRequestHeaders(request.options.headers);

        return fetch(request.url, request.options)
            .then(this._prepareResponse.bind(this, request))
            .then(response => {
                if (this._options.interceptors && isArray(this._options.interceptors.response)) {
                    this._options.interceptors.response.forEach(interceptor => {
                        response = interceptor(response); // eslint-disable-line no-param-reassign
                    });
                }

                return response;
            });
    }
    _formatRequestHeaders(headers) {
        const resultHeaders = {};

        Object.keys(headers).forEach(header => {
            resultHeaders[startCase(header).replace(' ', '-')] = headers[header];
        });

        return resultHeaders;
    }
    _formatResponseHeaders(headers) {
        const resultHeaders = {};

        for (const pair of headers.entries()) {
            resultHeaders[camelCase(pair[0])] = pair[1];
        }

        return resultHeaders;
    }
    _prepareResponse(request, response) {
        const headers = this._formatResponseHeaders(response.headers);
        const isJson = headers.contentType
            && headers.contentType.indexOf(JSON_ONLY_CONTENT_TYPE) !== -1
            && request.options.method !== 'DELETE';

        return response[isJson ? 'json' : 'text']().then(parsedBody => ({
            request,
            status: response.status,
            statusText: response.statusText,
            headers,
            body: parsedBody
        }));
    }
}
