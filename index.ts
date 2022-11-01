export interface IOptions {
    skinTypeList: Array<string> // 多种颜色情况下所有的主题class
    currentSkin: string // 传入默认皮肤主题
    followUpSystem?: boolean // 是否跟随系统
    darkSkinType?: string // 跟随系统深色模式
    lightSkinStype?: string // 跟随系统浅色模式
    debugger?: boolean // 是否开启调试
}
export default class SmartSkin{
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
        this.options.debugger && this._setupDarkModeDebugger()
    }
    /**
     * @description: 有一些历史页面没有黑白皮肤的时候，需要把skinClass移除
     * @return {*}
     */
    removeAllSkinType() {
        document.documentElement.setAttribute('data-theme', '')
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
            document.documentElement.setAttribute('data-theme', this.options.currentSkin)
        }
    }
    private _followUpSystem(ev: MediaQueryListEvent | MediaQueryList) {
        // 跟随系统
        this.changeSkinType(
            ev.matches ? this.options.darkSkinType : this.options.lightSkinStype
        )
    }
    private _setupDarkModeDebugger = () => {
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
        let changeSkin = () => {
            let index = this.options.skinTypeList.findIndex(
                (item) => item === this.options.currentSkin
            )
            index = (index + 1) % this.options.skinTypeList.length
            this.changeSkinType(this.options.skinTypeList[index])
        }
        button.addEventListener('click', () => {
            changeSkin()
        })
        let touchStartTime = new Date().getTime()
        let isMoving = false
        button.addEventListener('touchstart', () => {
            touchStartTime = new Date().getTime()
        })
        document.body.appendChild(button)
        let canMove = false
        function moveStart(event: TouchEvent | MouseEvent) {
            event.stopPropagation() // 阻止冒泡
            event.preventDefault() // 阻止默认事件
            canMove = true
        }
        button.addEventListener('mousedown', moveStart)
        button.addEventListener('touchstart', moveStart)
        function moveEnd() {
            canMove = false
        }
        document.documentElement.addEventListener('mouseup', moveEnd)
        document.documentElement.addEventListener('touchend', () => {
            canMove = false
            if (isMoving) {
                isMoving = false
                return
            }
            if (new Date().getTime() - touchStartTime < 100) {
                changeSkin()
            }
        })

        document.documentElement.addEventListener('mousemove', (ev) => {
            if (canMove) {
                window.requestAnimationFrame(() => {
                    button.style.left = ev.x - 15 + 'px'
                    button.style.top = ev.y - 15 + 'px'
                })
            }
        })
        document.documentElement.addEventListener('touchmove', (ev) => {
            console.log('isMoving', ev)
            isMoving = true
            if (canMove) {
                window.requestAnimationFrame(() => {
                    button.style.left = ev.changedTouches[0].pageX - 15 + 'px'
                    button.style.top = ev.changedTouches[0].pageY - 15 + 'px'
                })
            }
        })
        addStyle(css)
    }
}
