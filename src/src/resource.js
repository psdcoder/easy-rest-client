import { buildUrl } from './utils';
import { END_SLASH, START_SLASH } from './constants';

export default class RestClientResource {
    constructor(restClient, path) {
        const preparedPath = path.replace(END_SLASH, '');

        this._restClient = restClient;
        this._path = START_SLASH.test(preparedPath) ? preparedPath : `/${preparedPath}`;
    }
    getClient() {
        return this._restClient;
    }
    resource(path) {
        return new RestClientResource(this._restClient, path);
    }
    list(queryParams, options) {
        return this._restClient.request(
            'GET',
            buildUrl(this._path, queryParams, this._restClient.getOptions().trailing),
            null,
            options && options.headers,
            options && options.fetch
        );
    }
    get(id, queryParams, options) {
        return this._restClient.request(
            'GET',
            buildUrl([this._path, id], queryParams, this._restClient.getOptions().trailing),
            null,
            options && options.headers,
            options && options.fetch
        );
    }
    create(body, queryParams, options) {
        return this._restClient.request(
            'POST',
            buildUrl(this._path, queryParams, this._restClient.getOptions().trailing),
            body,
            options && options.headers,
            options && options.fetch
        );
    }
    update(id, body, queryParams, options) {
        return this._restClient.request(
            'PUT',
            buildUrl([this._path, id], queryParams, this._restClient.getOptions().trailing),
            body,
            options && options.headers,
            options && options.fetch
        );
    }
    remove(id, queryParams, options) {
        return this._restClient.request(
            'DELETE',
            buildUrl([this._path, id], queryParams, this._restClient.getOptions().trailing),
            null,
            options && options.headers,
            options && options.fetch
        );
    }
}
