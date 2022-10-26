(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SmartSkin = factory());
})(this, (function () { 'use strict';

    var SmartSkin = /** @class */ (function () {
        function SmartSkin(options) {
            var _this = this;
            this._setupDarkModeDebugger = function () {
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
                var canMove = false;
                function moveStart(event) {
                    event.stopPropagation(); // 阻止冒泡
                    event.preventDefault(); // 阻止默认事件
                    canMove = true;
                }
                button.addEventListener('mousedown', moveStart);
                button.addEventListener('touchstart', moveStart);
                function moveEnd() {
                    canMove = false;
                }
                document.documentElement.addEventListener('mouseup', moveEnd);
                document.documentElement.addEventListener('touchend', moveEnd);
                document.documentElement.addEventListener('mousemove', function (ev) {
                    if (canMove) {
                        window.requestAnimationFrame(function () {
                            button.style.left = ev.x - 15 + 'px';
                            button.style.top = ev.y - 15 + 'px';
                        });
                    }
                });
                document.documentElement.addEventListener('touchmove', function (ev) {
                    if (canMove) {
                        window.requestAnimationFrame(function () {
                            button.style.left = ev.changedTouches[0].pageX - 15 + 'px';
                            button.style.top = ev.changedTouches[0].pageY - 15 + 'px';
                        });
                    }
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
            this.options.debugger && this._setupDarkModeDebugger();
        };
        /**
         * @description: 有一些历史页面没有黑白皮肤的时候，需要把skinClass移除
         * @return {*}
         */
        SmartSkin.prototype.removeAllSkinType = function () {
            document.documentElement.setAttribute('data-theme', '');
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
                document.documentElement.setAttribute('data-theme', this.options.currentSkin);
            }
        };
        SmartSkin.prototype._followUpSystem = function (ev) {
            // 跟随系统
            this.changeSkinType(ev.matches ? this.options.darkSkinType : this.options.lightSkinStype);
        };
        return SmartSkin;
    }());

    return SmartSkin;

}));
