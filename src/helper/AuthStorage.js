import STORAGEKEY from "../config/APP/app.config";
import { getCookie } from "./util";
// import { getCookie } from "./utils";

class AuthStorage {

    static setStorageData(key, data, keepMeLoggedIn) {
        console.log("keepMeLoggedIn", keepMeLoggedIn);
        keepMeLoggedIn ? localStorage.setItem(key, data) : sessionStorage.setItem(key, data);
    }

    static setStorageJsonData(key, data, keepMeLoggedIn) {
        keepMeLoggedIn ? localStorage.setItem(key, JSON.stringify(data)) : sessionStorage.setItem(key, JSON.stringify(data));
    }

    static getStorageData(key) {
        return localStorage.getItem(key) ? localStorage.getItem(key) : sessionStorage.getItem(key);
    }

    static getStorageJsonData(key) {
        const data = localStorage.getItem(key) ? localStorage.getItem(key) : sessionStorage.getItem(key);
        return JSON.parse(data);
    }

    static getToken() {
        return localStorage.getItem(STORAGEKEY.token) ? localStorage.getItem(STORAGEKEY.access_token) : sessionStorage.getItem(STORAGEKEY.access_token);
    }

    static getUserId() {
        return localStorage.getItem(STORAGEKEY.user_id) ? localStorage.getItem(STORAGEKEY.user_id) : sessionStorage.getItem(STORAGEKEY.user_id);
    }

    static isUserAuthenticated() {
        return (localStorage.getItem(STORAGEKEY.access_token) !== null || sessionStorage.getItem(STORAGEKEY.access_token) !== null);
    }

    static deauthenticateUser() {
        localStorage.removeItem(STORAGEKEY.refresh_token);
        localStorage.removeItem(STORAGEKEY.userData);
        localStorage.removeItem(STORAGEKEY.access_token);

        sessionStorage.removeItem(STORAGEKEY.refresh_token);
        sessionStorage.removeItem(STORAGEKEY.userData);
        sessionStorage.removeItem(STORAGEKEY.access_token);
    }

    static deleteKey(key) {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    }

    static getLang() {
        return localStorage.getItem(STORAGEKEY.lang) || getCookie('i18next') || "ko";
    }
}

export default AuthStorage;
