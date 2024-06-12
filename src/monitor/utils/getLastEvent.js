let lastEvent;

['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach(
    (eventType) => {
        document.addEventListener(
            eventType,
            (event) => {
                lastEvent = event;
            },
            {
                capture: true, //捕获阶段
                passive: true, // 默认不组织默认事件
            }
        );
    }
);

export default function (params) {
    return lastEvent;
}
