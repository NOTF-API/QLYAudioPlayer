const loop = {
    icon: "fa-recycle",
    next(cur, len) {
        if (++cur === len) {
            cur = 0;
        }
        return cur
    },
    previous(cur, len) {
        if (--cur < 0) {
            cur = len - 1;
        }
        return cur
    },
    onAfterPlay(cur, len) {
        return cur
    }
}

export default loop