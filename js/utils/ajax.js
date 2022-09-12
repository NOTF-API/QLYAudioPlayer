export async function ajax(url, data) {
    if (!url) {
        throw new Error("empty URL error")
    }
    const xhr = new XMLHttpRequest()
    return new Promise((resolve, reject) => {
        if (data && data instanceof Object) {
            url += '?'
            const qs = []
            Object.entries(data).forEach(([key, value]) => {
                qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            })
            return qs.join('&')
        }
        xhr.open('get', url, true)
        xhr.onload = function () {
            if (xhr.status == 200 || xhr.status == 304) {
                resolve(xhr.response)
            } else {
                reject(xhr.status)
            }
        }
        // xhr.onprogress=function(){

        // }
        // xhr.ontimeout=function(){

        // }
        xhr.onerror = function (error) {
            reject(error)
        }
        xhr.send(null);
    })
}