// import { Spectrum } from './player/spectrum/index.js'
// import { Lyric } from './player/lyric/index.js'
import { format } from './utils/time.js'
import { ajax } from './utils/ajax.js'
import { loading } from './utils/loading.js'
import loop from './mode/loop.js';
import order from './mode/order.js'
import random from './mode/random.js'

const modes = [loop, order, random]

class QLYPlayer {
    static instance = null;
    static url = "/api/list.json"
    actions = {
        play: () => {
            this.actions.pause()
            this.audio.play()
            this.elements.get("#play-btn").className = "fa fa-pause"
            const diskEl = this.elements.get(".disk")
            const progressEl = this.elements.get("#progress")
            const currentEl = this.elements.get(".current")
            const totalEl = this.elements.get(".total")
            const animateCallback = () => {
                diskEl.style.transform = `rotate(${this.appearance.diskDegree += 0.1}deg)`
                progressEl.style.backgroundImage = `linear-gradient(90deg, #0075ff 0%, #0075ff ${this.status.progress}%, #132336 0%, #132336 100%)`
                currentEl.innerText = this.status.currentText
                totalEl.innerText = this.status.totalText
                this.#animate = requestAnimationFrame(animateCallback)
            }
            this.#animate = requestAnimationFrame(animateCallback)
        },
        pause: () => {
            this.elements.get("#play-btn").className = "fa fa-play"
            cancelAnimationFrame(this.#animate)
            this.audio.pause()
        },
        changePlayMode: () => {
            let next = modes.findIndex(item => item === this.mode)
            next = next + 1 === modes.length ? 0 : next + 1
            this.mode = modes[next]
            this.elements.get("#mode-btn").className = `lite fa ${this.mode.icon}`
        },
        switch: async (index) => {
            this.elements.getListItem(this.playing.index).classList.remove("playing")
            this.playing = this.list[index]
            this.playing.index = index;
            this.elements.getListItem(this.playing.index).classList.add("playing")
            await this.#load()
            this.actions.play()
        },
        next: async () => {
            const next = this.mode.next(this.playing.index, this.list.length)
            this.actions.switch(next)
        },
        previous: async () => {
            const prev = this.mode.previous(this.playing.index, this.list.length)
            this.actions.switch(prev)
        },
        changeProgress: (progress) => {

        }
    }
    list = []
    mode = order
    status = {
        paused: () => {
            return this.audio.paused
        },
        get progress() {
            return this.current() / this.total() * 100
        },
        set progress(progress) {

        },
        current: () => {
            return this.audio.currentTime
        },
        get currentText() {
            return format(this.current())
        },
        set currentText(val) {

        },
        total: () => {
            return this.audio.duration
        },
        get totalText() {
            return format(this.total())
        },
        set totalText(val) {

        },
    }
    audio = new Audio()
    playing = {

    }
    appearance = {
        diskDegree: 0,
        themeColor: "88c967",
    }
    elements = {
        list: [],
        get(key) {
            return this[key] || (this[key] = document.querySelector(key))
        },
        getListItem(index) {
            return this.list[index]
        }
    }

    #animate = null

    async #init() {
        loading.begin("加载歌单中")
        let data;
        try {
            data = await ajax(QLYPlayer.url)
        } catch {
            loading.error("加载歌单失败");
            return
        }
        try {
            this.list = JSON.parse(data)
        } catch (e) {
            loading.error("解析歌单数据失败");
            return
        }

        const listEl = this.elements.get("#list")
        this.list.forEach((item, index) => {
            const itemEl = document.createElement("li")
            if (index == 0) {
                itemEl.classList.add("playing")
            }
            item.element = itemEl
            itemEl.addEventListener("click", () => {
                this.list[this.playing.index].element.classList.remove("playing")
                this.actions.switch(index)
                itemEl.classList.add("playing")
                this.elements.get("#aside-toggle-btn").parentNode.classList.toggle("hidden")
            })
            itemEl.innerText = item["title"]
            this.elements.list[index] = itemEl;
            listEl.appendChild(itemEl)
        })
        this.playing = this.list[0]
        this.playing.index = 0;
        await this.#load()

        this.elements.get("#play-btn").addEventListener("click", () => {
            if (this.status.paused()) {
                this.actions.play()
            } else {
                this.actions.pause()
            }
        })
        this.elements.get("#prev-btn").addEventListener("click", () => {
            this.actions.previous()
        })
        this.elements.get("#next-btn").addEventListener("click", () => {
            this.actions.next()
        })
        this.elements.get("#aside-toggle-btn").addEventListener("click", (e) => {
            e.target.parentNode.classList.toggle("hidden")
        })
        this.elements.get("#mode-btn").addEventListener("click", () => {
            this.actions.changePlayMode()
        })
        this.elements.get("#lyric-btn").addEventListener("click", () => {
            this.elements.get(".lyric-container").classList.toggle("hidden")
        })

    }

    async #load() {
        loading.begin("加载封面与歌曲中")
        this.appearance.diskDegree = 0;
        //读取信息
        const p = this.playing
        document.querySelector("#inf-title").innerText = p["title"] || ""
        document.querySelector("#inf-desc").innerText = p["description"] || ""
        document.querySelector("#inf-art").innerText = p["artist"] + " - " + p["album"]
        this.appearance.themeColor = this.playing["themeColor"]

        //更换封面
        const coverPromise = new Promise((resolve, reject) => {
            const cover = new Image()
            document.querySelector("#cover").src = ""
            document.querySelector("#bg-img").src = ""
            cover.onload = () => {
                document.querySelector("#cover").src = cover.src
                document.querySelector("#bg-img").src = cover.src
                resolve()
            }
            cover.src = this.playing["coverSrc"]
            cover.onerror = reject
        })

        //读取音乐
        const musicPromise = new Promise((resolve, reject) => {
            this.audio.src = this.playing["audioSrc"]
            this.audio.oncanplay = () => {
                this.playing.current = 0
                this.playing.total = this.audio.duration
                this.playing.total = this.audio.total
                resolve()
            }
            this.audio.onerror = reject
        })
        await Promise.all([musicPromise, coverPromise])
        loading.end()

    }

    static async create(url) {
        url && (QLYPlayer.url = url);
        if (QLYPlayer.instance) {
            return QLYPlayer.instance
        }
        const instance = new QLYPlayer()
        QLYPlayer.instance = instance
        await QLYPlayer.instance.#init()
        return instance
    }
}

const player = await QLYPlayer.create()
// const player = await QLYPlayer.create("/api/list.json")