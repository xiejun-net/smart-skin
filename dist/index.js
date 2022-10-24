var SmartSkin = /** @class */ (function () {
    function SmartSkin(options) {
        var _this = this;
        this.setupDarkModeDebugger = function () {
            var isExistButton = document.querySelector('.darkmode-toggle');
            if (isExistButton)
                return;
            var addStyle = function (css) {
                var linkElement = document.createElement('link');
                linkElement.setAttribute('rel', 'stylesheet');
                linkElement.setAttribute('type', 'text/css');
                linkElement.setAttribute('href', 'data:text/css;charset=UTF-8,' + encodeURIComponent(css));
                document.head.appendChild(linkElement);
            };
            var css = "\n                .darkmode-toggle {\n                    background: #100f2c;\n                    width: 40px;\n                    height: 40px;\n                    position: fixed;\n                    border-radius: 50%;\n                    border:none;\n                    cursor: pointer;\n                    display: flex;\n                    justify-content: center;\n                    align-items: center;\n                    z-index:9999;\n                  }\n            ";
            var button = document.createElement('button');
            button.innerHTML = '🌓';
            button.classList.add('darkmode-toggle');
            button.style.left = document.documentElement.clientWidth - 80 + 'px';
            button.style.top = document.documentElement.clientHeight - 80 + 'px';
            button.addEventListener('click', function () {
                var index = _this.options.skinTypeList.findIndex(function (item) { return item === _this.options.currentSkin; });
                index = (index + 1) % _this.options.skinTypeList.length;
                _this.changeSkinType(_this.options.skinTypeList[index]);
            });
            document.body.appendChild(button);
            var moveFlag = false;
            button.addEventListener('mousedown', function () {
                console.log('mousedown');
                moveFlag = true;
            });
            document.documentElement.addEventListener('mousemove', function (ev) {
                if (moveFlag) {
                    console.log(1);
                    window.requestAnimationFrame(function () {
                        button.style.left = ev.x - 15 + 'px';
                        button.style.top = ev.y - 15 + 'px';
                    });
                }
            });
            document.documentElement.addEventListener('mouseup', function (ev) {
                console.log('mouseup');
                moveFlag = false;
            });
            button.addEventListener('touchstart', function () {
                console.log('mousedown');
                moveFlag = true;
            });
            document.documentElement.addEventListener('touchmove', function (ev) {
                console.log(ev);
                if (moveFlag) {
                    window.requestAnimationFrame(function () {
                        button.style.left = ev.changedTouches[0].pageX - 15 + 'px';
                        button.style.top = ev.changedTouches[0].pageY - 15 + 'px';
                    });
                }
            });
            document.documentElement.addEventListener('touchend', function (ev) {
                console.log('mouseup');
                moveFlag = false;
            });
            addStyle(css);
        };
        this.options = options;
        this.options.currentSkin =
            this.options.currentSkin || this.options.skinTypeList[0];
    }
    SmartSkin.prototype.init = function () {
        if (this.options.skinTypeList.length === 0) {
            console.error("skinTypeList cannot be empty");
            return;
        }
        if (this.options.currentSkin) {
            this.changeSkinType(this.options.currentSkin);
        }
        // 监听系统深色模式,安卓无效，不用判断，本身不会触发
        if (this.options.followUpSystem) {
            var matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
            this._followUpSystem(matchMedia);
            matchMedia.addEventListener('change', this._followUpSystem);
        }
        this.options.debugger && this.setupDarkModeDebugger();
    };
    /**
     * @description: 有一些历史页面没有黑白皮肤的时候，需要把skinClass移除
     * @return {*}
     */
    SmartSkin.prototype.removeAllSkinType = function () {
        var _a;
        (_a = document.body.classList).remove.apply(_a, this.options.skinTypeList);
    };
    /**
     * @description: change Skin type
     * @param {string} skinType
     * @return {*}
     */
    SmartSkin.prototype.changeSkinType = function (skinType) {
        if (skinType) {
            this.options.currentSkin = skinType;
            this.removeAllSkinType();
            document.body.classList.add(skinType);
        }
    };
    SmartSkin.prototype._followUpSystem = function (ev) {
        // 跟随系统
        this.changeSkinType(ev.matches ? this.options.darkSkinType : this.options.lightSkinStype);
    };
    return SmartSkin;
}());

export { SmartSkin };
