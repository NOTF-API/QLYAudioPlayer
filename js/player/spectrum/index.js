/*参考文档https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API*/

export class Spectrum {
    el = {
        canvas: null,
        audio: null
    }
    intervalId = null
    step = null
    count = null
    voiceHeight = null
    oW = null
    oH = null
    themeColor = null
    analyser = null
    ctx = null
    canvas = null

    constructor(canvasEl, audioEl) {
        this.el = {
            canvas: canvasEl,
            audio: audioEl
        }
    }

    init() {
        let canvas = (typeof this.el.canvas !== "string") ? this.el.canvas : document.querySelector(this.el.canvas)
        this.ctx = canvas.getContext("2d");
        let oCtx = new AudioContext();
        let audioSrc = oCtx.createMediaElementSource(this.el.audio);
        this.analyser = oCtx.createAnalyser();
        audioSrc.connect(this.analyser);
        this.analyser.connect(oCtx.destination);
        canvas.width = this.el.canvas.innerWidth;
        canvas.height = this.el.canvas.innerHeight;
        this.oW = canvas.width;
        this.oH = canvas.height;
        // 音频图的条数
        this.count = 40;
        this.voiceHeight = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(this.voiceHeight);
        // 自定义获取数组里边数据的频步
        this.step = Math.round(this.voiceHeight.length / this.count);
    }

    style() {

    }

    begin() {
        if (!this.analyser) {
            this.init()
        }
        this.draw();
    }

    stop() {
        clearInterval(this.intervalId)
    }

    draw() {
        this.analyser.getByteFrequencyData(this.voiceHeight);
        this.ctx.clearRect(0, 0, this.oW, this.oH);
        for (let i = 0; i < this.count; i++) {
            let audioHeight = this.voiceHeight[this.step * i];
            this.ctx.fillStyle = this.themeColor;
            this.ctx.fillRect(this.oW / 2 + 300 + (i * 20), this.oH, 14, -audioHeight * 2);
            this.ctx.fillRect(this.oW / 2 - 300 - (i * 20), this.oH, 14, -audioHeight * 2);
        }
        this.intervalId = window.requestAnimationFrame(this.draw);
    }
}