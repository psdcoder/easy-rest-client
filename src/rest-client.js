import fetch from 'isomorphic-fetch';
import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';
import isArray from 'lodash/isArray';

import RestClientResource from './resource';
import { trimSlashes, encodeUrl, buildUrl } from './utils';
import * as validators from './validators';
import { START_SLASH, DEFAULT_OPTIONS, JSON_CONTENT_TYPE, URL_ENCODED_CONTENT_TYPE } from './constants';

const JSON_ONLY_CONTENT_TYPE = JSON_CONTENT_TYPE.split(';')[0];

export default class RestClient {
    constructor(host, options) {
        this.setHost(host);
        this.setOptions(Object.assign(DEFAULT_OPTIONS, options));
    }
    getHost() {
        return this._host;
    }
    setHost(host) {
        validators.isValidHost(host);
        this._host = trimSlashes(host, false, true);
    }
    getOptions() {
        return this._options;
    }
    setOptions(options) {
        validators.isValidRestClientOptions(options);
        this._options = Object.assign(this._options || {}, options);
    }
    resource(path) {
        validators.isValidResource(path);
        return new RestClientResource(this, path);
    }
    request(urlParam, options) {
        validators.isValidRequestUrlParam(urlParam);
        validators.isValidRequestOptions(options);

        const urlParamIsArray = isArray(urlParam);
        const queryParams = urlParamIsArray ? urlParam[1] : null;
        let url = urlParam;

        if (urlParamIsArray) {
            url = START_SLASH.test(urlParam[0]) ? `${this._host}${urlParam[0]}` : urlParam[0];
        }

        let request = {
            url: buildUrl(url, queryParams, this._options.trailing),
            options: Object.assign(
                {},
                this._options.fetch,
                { headers: this._options.headers },
                options,
                { method: options && options.method ? options.method.toUpperCase() : 'GET' }
            )
        };

        if (options && 'body' in options) {
            const contentType = request.options.headers.contentType;

            if (
                (window.ArrayBuffer && options.body instanceof window.ArrayBuffer)
                || (window.Blob && options.body instanceof window.Blob)
                || (window.FormData && options.body instanceof window.FormData)
            ) {
                if (contentType) {
                    delete request.options.headers.contentType;
                }

                request.options.body = options.body;
            } else if (contentType && contentType === JSON_CONTENT_TYPE) {
                request.options.body = JSON.stringify(options.body);
            } else if (contentType && contentType === URL_ENCODED_CONTENT_TYPE) {
                request.options.body = encodeUrl(options.body);
            } else {
                request.options.body = options.body;
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
    _formatResponseHeaders(headers) {
        const resultHeaders = {};

        headers.forEach((value, name) => {
            resultHeaders[camelCase(name)] = value;
        });

        return resultHeaders;
    }
}
