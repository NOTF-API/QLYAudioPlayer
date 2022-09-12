const loadingEl = document.querySelector(".loading-mask")
const loadingIcon = document.querySelector("#smart-icon")
const loadingText = document.querySelector(".loading-text")
const diskEl = document.querySelector(".disk-container")

export const loading = {
    _text: "加载中",
    begin(text) {
        diskEl.classList.add("hidden")
        loadingIcon.className = "fa fa-spinner"
        loadingEl.style.display = "flex"
        if (text) {
            this.text = text
        }
    },
    end() {
        loadingEl.style.display = "none"
        this._text = "加载中"
        diskEl.classList.remove("hidden")
    },
    error(msg) {
        loadingEl.style.display = "flex"
        loadingIcon.className = "fa fa-warning"
        this.text = msg
    },
    get text() {
        return this._text
    },
    set text(text) {
        this._text = text || "加载中"
        loadingText.innerText = this._text
    }
}