// src/utils/cookieService.js
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const setCookie = (name, value, options) => {
    // console.log(`Set Cookie "${name}"`);
    cookies.set(name, value, options);
};

export const getCookie = (name) => {
    // console.log(`Get Cookie "${name}":`, cookies.get(name));
    return cookies.get(name);
};

export const removeCookie = (name, options) => {
    // console.log(`Remove Cookie "${name}"`);
    cookies.remove(name, options);
};
