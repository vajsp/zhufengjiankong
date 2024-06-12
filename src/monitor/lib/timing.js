import tracker from '.../utils/tracker';
import onload from '../utils/onload';

export function Timing() {
    let FMP, LCP;

    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries();

        // 需要在dom上设置 elementting 属性，为最有意义的元素
        FMP = perfEntries[0];
        observer.disconnect();
    }).observe({ entryTypes: ['element'] });

    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries();
        LCP = perfEntries[0];
        observer.disconnect();
    }).observe({ entryTypes: ['largest-content-paint'] });

    new PerformanceObserver((entryList, observer) => {
        // let perfEntries = entryList.getEntries();
        // LCP = perfEntries[0];
        let firstInput = entryList.getEntries()[0];
        if (firstInput) {
            // processingStart开始处理时间，startTime开始点击时间，差值就是处理的延迟
            let inoutDaly = firstInput.processingStart - firstInput.startTime;
            let duration = firstInput.duration; // 处理耗时
            if (innputDelay > 0 || duration > 0) {
                tracker.send({
                    kind: 'experience',
                    type: 'firstInputDelay',
                    inputDelay, // 延时时间
                    duration, // 处理时间
                    startTime: firstInput.startTime,
                });
            }
        }

        observer.disconnect(); // 不再观察
    }).observe({ type: 'first-input', buffered: true });

    onload(function () {
        setTimeout(() => {
            const {
                fetchStart,
                connectStart,
                connectEnd,
                requestStart,
                responseStart,
                responseEnd,
                domInteractive,
                domContentLoadedEventStart,
                domContentLoadedEventEnd,
            } = performance.timing;

            tracker.send({
                kind: 'experience', // 用户体验指标
                type: 'timing', //统计每个阶段时间
                connectTime: connectEnd - connectStart, // 连接时间
                ttfbTime: responseStart - requestStart, // 首字节时间
                responseTime: responseEnd - responseStart, // 响应读取时间
                parseDOMTime: loadEventStart - domLoading, //dom解析时间
                domContentLoadedTime:
                    domContentLoadedEventEnd - domContentLoadedEventStart,
                timeToInteractive: domInteractive - fetchStart, //首次可交互时间
                loadTime: loadEventStart - fetchStart, //完整加载时间
            });

            let FP = performance.getEntriesByType('first-paint')[0];
            let FCP = performance.getEntriesByType('first-contentful-paint')[0];

            // 开始发送性能指标
            console.log('FP', FP);
            console.log('FCP', FCP);
            console.log('FMP', FMP);
            console.log('LCP', LCP);
        }, 3000);
    });
}
