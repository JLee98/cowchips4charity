import { authTokenName } from '@/config/auth'

export default class localStorage {
  static setCookie(name,value,days) {
    let expires = ""
    if (days) {
      let date = new Date()
      date.setTime(date.getTime() + (days*24*60*60*1000))
      expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/"
  }
  static getCookie(name) {
    let nameEQ = name + "="
    let ca = document.cookie.split(';')
    for(let i=0;i < ca.length;i++) {
      let c = ca[i]
      while (c.charAt(0)==' ') c = c.substring(1,c.length)
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length)
    }
    return null
  }
  static eraseCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  }
  static isUserLoggedIn() {
    return !!localStorage.getCookie(authTokenName)
  }
}
