import {
    getStyle
} from '@/config/nUtils';
export default {
    loadMore: {
        bind: (el, binding) => {
            let windowHeight = window.screen.height;
            let height;
            let setTop;
            let paddingBottom;
            let marginBottom;
            let requestFram;
            let oldScrollTop;
            let scrollEl;
            let heightEl;
            let scrollType = el.attributes.type && el.attributes.type.value; // 父节点下面的子节的个数
            let scrollReduce = 2;
            if (scrollType == 2) {
                // 获取到第一个
                scrollEl = el;
                heightEl = el.children[0];
                // console.log(heightEl);
            } else {
                scrollEl = document.documentElement;
                // console.log(scrollEl.scrollTop);
                heightEl = el;
            }
            // 监听
            el.addEventListener('touchstart', () => {
                height = heightEl.clientHeight;
                if (scrollType == 2) {
                    height = height
                }
                // 滚动距离 false 阻止事件冒泡
                setTop = el.offsetTop;
                paddingBottom = getStyle(el, 'paddingBottom');
                marginBottom = getStyle(el, 'marginBottom');
            }, false)
            el.addEventListener('touchmove', () => {
                loadMore();
            }, false)
            el.addEventListener('touchend', () => {
                oldScrollTop = scrollEl.scrollTop;
                moveEnd();
            }, false)
            const moveEnd = () => {
                // 让动画更加细腻
                requestFram = requestAnimationFrame(() => {
                    if (scrollEl.scrollTop != oldScrollTop) {
                        oldScrollTop = scrollEl.scrollTop;
                        moveEnd()
                    } else {
                        // 停止
                        cancelAnimationFrame(requestFram);
                        height = heightEl.clientHeight;
                        // 加载数据
                        loadMore();
                    }
                })
            }
            const loadMore = () => {
                // 滚动条到达底部
                if (scrollEl.scrollTop + windowHeight >=
                    height + setTop + paddingBottom + marginBottom - scrollReduce) {
                    binding.value();
                }
            }
        }
    },
}