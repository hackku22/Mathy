let isLoggedIn = false
export const checkLoggedIn = () => {
    return isLoggedIn
}
export const loggedIn = () => {
    isLoggedIn = true
}
export const loggedOut = () => {
    isLoggedIn = false
}
