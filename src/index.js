import { JSON_CONTENT_TYPE, URL_ENCODED_CONTENT_TYPE } from './constants';
import RestClient from './rest-client';

export default RestClient;
export { RestClient as RestClient };
export { default as fetch } from 'isomorphic-fetch';
export { buildUrl } from './utils';
export const contentTypes = {
    JSON: JSON_CONTENT_TYPE,
    URL_ENCODED: URL_ENCODED_CONTENT_TYPE
};
