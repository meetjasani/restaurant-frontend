import API_LOCAL from './api-local';
import API_PROD from './api-prod';
let hostname;
let port;
let isLocalApi =  +port >= 3000;

if (typeof window !== 'undefined') {
    hostname = window.location.hostname;
    port = window.location.port;
 }

export const API =
    (hostname === 'localhost' && isLocalApi) ? API_LOCAL : API_PROD