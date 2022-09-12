function __switch__(cur, len) {
    let res = -1;
    do {
        res = Math.floor(Math.random() * len)
    } while (cur === res)
    return res;
}

const random = {
    icon: "fa-random",
    next(cur, len) {
        return __switch__(cur, len)
    },
    previous(cur, len) {
        return __switch__(cur, len)
    },
    onAfterPlay(cur, len) {
        return __switch__(cur, len)
    }
}

export default random