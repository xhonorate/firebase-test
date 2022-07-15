import cookies from 'js-cookie'

export const getUserFromCookie = () => {
    const cookie = cookies.get('auth')
    if (!cookie) {
        return
    }
    try {
      return JSON.parse(cookie)
    } catch (error) {
      alert(error)
      return;
    }
}

export const setUserCookie = (user) => {
    cookies.set('auth', JSON.stringify(user), {
        // firebase id tokens expire in one hour
        // set cookie expiry to match
        expires: 1 / 24,
    })
}

export const removeUserCookie = () => cookies.remove('auth')