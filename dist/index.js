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
            var options = {
                bottom: '32px',
                right: '32px',
                left: 'unset',
                buttonColorDark: '#100f2c',
                buttonColorLight: '#fff',
                label: '🌓',
            };
            var css = "\n                .darkmode-toggle {\n                    background: ".concat(options.buttonColorDark, ";\n                    width: 1rem;\n                    height: 1rem;\n                    position: fixed;\n                    border-radius: 50%;\n                    border:none;\n                    right: ").concat(options.right, ";\n                    bottom: ").concat(options.bottom, ";\n                    left: ").concat(options.left, ";\n                    cursor: pointer;\n                    transition: all 0.5s ease;\n                    display: flex;\n                    justify-content: center;\n                    align-items: center;\n                    z-index:9999;\n                  }\n                  .darkmode-toggle--white {\n                    background: ").concat(options.buttonColorLight, ";\n                  }\n            ");
            var button = document.createElement('button');
            button.innerHTML = options.label;
            button.classList.add('darkmode-toggle');
            button.addEventListener('click', function () {
                var index = _this.options.skinTypeList.findIndex(function (item) { return item === _this.options.currentSkin; });
                index = (index + 1) % _this.options.skinTypeList.length;
                _this.changeSkinType(_this.options.skinTypeList[index]);
            });
            document.body.insertBefore(button, document.body.firstChild);
            addStyle(css);
        };
        this.options = options;
        this.options.currentSkin =
            this.options.currentSkin || this.options.skinTypeList[0];
    }
    SmartSkin.prototype.initSkin = function () {
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
    // 有一些历史页面没有黑白皮肤的时候，需要把skinClass移除
    SmartSkin.prototype.removeAllSkinType = function () {
        var _a;
        (_a = document.body.classList).remove.apply(_a, this.options.skinTypeList);
    };
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
