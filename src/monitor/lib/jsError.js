import getLastEvent from '../utils/getLastEvent';
import getSelector from '../utils/getSelector';
import tracker from '../utils/tracker';

export function injectJsError(params) {
    console.log('injectJsError');
    window.addEventListener(
        'error',
        function (event) {
            let lastEvent = getLastEvent(); //最后一个交互事件
            if (event.target && (event.target.src || event.target.href)) {
                let log = {
                    kind: 'stability', //架空指标的大类
                    type: 'error', //小类型 这是一个错误
                    errorType: 'resourceError', //js执行错误
                    url: '', //访问哪个路径 报错了
                    message: event.message, //报错信息
                    filename: event.target.src || event.target.href, //哪个文件报错了
                    tagName: event.target.tagName,
                    selector: getSelector(event.target), //
                };
                tracker.send(log);
            } else {
                let log = {
                    kind: 'stability', //架空指标的大类
                    type: 'error', //小类型 这是一个错误
                    errorType: 'jsError', //js执行错误
                    url: '', //访问哪个路径 报错了
                    message: event.message, //报错信息
                    filename: event.filename, //哪个文件报错了
                    postition: `${event.lineno}:${event.colno}`,
                    stack: getLines(event.error.stack),
                    selector: lastEvent ? getSelector(lastEvent) : '', //
                };
                tracker.send(log);
                console.log(log);
            }
        },
        true
    );

    window.addEventListener('unhandledrejection', function (event) {
        console.log(event);
        let message;
        let reason = event.reason;
        let filename;
        let line;
        let column;

        let lastEvent = getLastEvent();
        if (typeof event.reason === 'string') {
            message = event.reason;
        } else if (typeof event.reason === 'object') {
            if (reason.stack) {
                // at http://local:8080/:23:38
                let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
                filename = matchResult[1];
                line = matchResult[2];
                column = matchResult[3];
            }
            stact = getLines(reason.stack);
        }

        tracker.send({
            type: 'error', //小类型 这是一个错误
            errorType: 'promiseError', //js执行错误
            url: '', //访问哪个路径 报错了
            message: event.message, //报错信息
            filename: filename, //哪个文件报错了
            postition: `${line}:${column}`,
            stack: getLines(event.error.stack),
            selector: lastEvent ? getSelector(lastEvent) : '', //
        });
    });

    function getLines(stack) {
        return stack
            .split('\n')
            .slice(1)
            .map((item) => item.replace(/^\s+at\s+/g, ''))
            .join('^');
    }
}
