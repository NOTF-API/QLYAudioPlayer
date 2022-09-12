import { ajax } from '../../utils/ajax.js'
// import { format } from './utils/time.js'

export const Lyric = {
    timeline: [],
    async load(src) {
        this.timeline = []
        if (!src) {
            return Promise.reject("不合法的歌词链接")
        }
        let lyricText = await ajax(src)
        let regExp = /\[(\d{2}):(\d{2})\.(\d{2,3})](.*)/g;
        while (result = regExp.exec(lyricText)) {
            let microseconds =
                parseInt(result[1]) * 60 * 1000 +
                parseInt(result[2]) * 1000 +
                parseInt(result[3]) * 1000;
            this.timeline.push([microseconds, result[4]]);
        }
        return this.timeline
    }
}