export const config = {
    set(key, value) {
        window.localStorage.setItem(key, value)
    },
    get(key) {
        return window.localStorage.getItem(key)
    }
}