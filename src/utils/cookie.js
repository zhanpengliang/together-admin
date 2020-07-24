/*
import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
*/

export const _loginToken = "loginToken";
export const _phoneNumber = "phoneNumber";
export const _organizerId = "organizerId";

//设置cookie
export function setCookie(cname, cvalue, expireUTCTime) {
    var expires = new Date(expireUTCTime);
    document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";expires=" + expires.toUTCString() + ";path=/";
}
//删除cookies
export function deleteCookie(cname) {
    var expires = new Date();
    expires.setTime(expires.getTime() - 10000);

    var cvalue = getCookie(cname);

    if(cvalue !== null) {
        document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";expires=" + expires.toUTCString() + ";path=/";
    }
}

//获取cookie
export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


export function deleteALLCookie() {
  deleteCookie(_loginToken);
  deleteCookie(_phoneNumber);
  deleteCookie(_organizerId);
}

//设置登陆token
export function setLoginCookie(loginToken, phoneNumber, organizerId, expireMillisecond) {
  setCookie(_loginToken, loginToken, expireMillisecond);
  setCookie(_phoneNumber, phoneNumber, expireMillisecond);
  setCookie(_organizerId, organizerId, expireMillisecond);
}

//得到登陆token
export function getToken() {
  return getCookie(_loginToken);
}

//得到登陆token
export function getPhoneNumber() {
  return getCookie(_phoneNumber);
}

//得到登陆token
export function getOrganizerId() {
  return getCookie(_organizerId);
}
