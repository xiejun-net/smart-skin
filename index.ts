export interface IOptions {
    skinTypeList: Array<string> // 多种颜色情况下所有的主题class
    currentSkin: string // 传入默认皮肤主题
    followUpSystem?: boolean // 是否跟随系统
    darkSkinType?: string // 跟随系统深色模式
    lightSkinStype?: string // 跟随系统浅色模式
    debugger?: boolean // 是否开启调试
}
export class SmartSkin {
    options: IOptions
    constructor(options: IOptions) {
        this.options = options
        this.options.currentSkin =
            this.options.currentSkin || this.options.skinTypeList[0]
    }
    init() {
        if (this.options.skinTypeList.length === 0) {
            console.error(`skinTypeList cannot be empty`)
            return
        }
        if (this.options.currentSkin) {
            this.changeSkinType(this.options.currentSkin)
        }
        // 监听系统深色模式,安卓无效，不用判断，本身不会触发
        if (this.options.followUpSystem) {
            const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')
            this._followUpSystem(matchMedia)
            matchMedia.addEventListener('change', this._followUpSystem)
        }
        this.options.debugger && this.setupDarkModeDebugger()
    }
    /**
     * @description: 有一些历史页面没有黑白皮肤的时候，需要把skinClass移除
     * @return {*}
     */
    removeAllSkinType() {
        document.body.classList.remove(...this.options.skinTypeList)
    }
    /**
     * @description: change Skin type
     * @param {string} skinType
     * @return {*}
     */
    changeSkinType(skinType: string | undefined) {
        if (skinType) {
            this.options.currentSkin = skinType
            this.removeAllSkinType()
            document.body.classList.add(skinType)
        }
    }
    private _followUpSystem(ev: MediaQueryListEvent | MediaQueryList) {
        // 跟随系统
        this.changeSkinType(
            ev.matches ? this.options.darkSkinType : this.options.lightSkinStype
        )
    }
    setupDarkModeDebugger = () => {
        const isExistButton = document.querySelector('.darkmode-toggle')
        if (isExistButton) return
        const addStyle = (css: string) => {
            const linkElement = document.createElement('link')
            linkElement.setAttribute('rel', 'stylesheet')
            linkElement.setAttribute('type', 'text/css')
            linkElement.setAttribute(
                'href',
                'data:text/css;charset=UTF-8,' + encodeURIComponent(css)
            )
            document.head.appendChild(linkElement)
        }
        const css = `
                .darkmode-toggle {
                    background: #100f2c;
                    width: 40px;
                    height: 40px;
                    position: fixed;
                    border-radius: 50%;
                    border:none;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index:9999;
                  }
            `
        const button = document.createElement('button')
        button.innerHTML = '🌓'
        button.classList.add('darkmode-toggle')
        button.style.left = document.documentElement.clientWidth - 80 + 'px'
        button.style.top = document.documentElement.clientHeight - 80 + 'px'
        button.addEventListener('click', () => {
            let index = this.options.skinTypeList.findIndex(
                (item) => item === this.options.currentSkin
            )
            index = (index + 1) % this.options.skinTypeList.length
            this.changeSkinType(this.options.skinTypeList[index])
        })
        document.body.appendChild(button)
        let moveFlag = false
        button.addEventListener('mousedown', () => {
            moveFlag = true
        })
        document.documentElement.addEventListener('mousemove', (ev) => {
            if (moveFlag) {
                console.log(1)
                window.requestAnimationFrame(() => {
                    button.style.left = ev.x - 15 + 'px'
                    button.style.top = ev.y - 15 + 'px'
                })
            }
        })
        document.documentElement.addEventListener('mouseup', (ev) => {
            moveFlag = false
        })
        button.addEventListener('touchstart', () => {
            moveFlag = true
        })
        document.documentElement.addEventListener('touchmove', (ev) => {
            if (moveFlag) {
                window.requestAnimationFrame(() => {
                    button.style.left = ev.changedTouches[0].pageX - 15 + 'px'
                    button.style.top = ev.changedTouches[0].pageY - 15 + 'px'
                })
            }
        })
        document.documentElement.addEventListener('touchend', (ev) => {
            moveFlag = false
        })
        addStyle(css)
    }
}
