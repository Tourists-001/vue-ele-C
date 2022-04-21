// 设置页面的rem的比，响应式，可以监听页面的缩放比
(function(doc, win) {
    var docEl = doc.documentElement,
        // orientationchange 事件在设备的纵横方向改变时触发
        // 判断是在移动端还是在pc端，通过监听不同的事件，改变rem的比例
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
        };
    if (!doc.addEventListener) return;
    // 该方法的第三个参数是泡沫获取，是一个布尔值：当为false时表示由里向外，true表示由外向里
    win.addEventListener(resizeEvt, recalc, false);
    // 当纯HTML被完全加载以及解析时，
    // DOMContentLoaded 事件会被触发，而不必等待样式表，图片或者子框架完成加载。
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);