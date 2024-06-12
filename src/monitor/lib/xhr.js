import tracker from '.../utils/tracker';

export function injectXHR() {
    let XMLHttpRequest = window.XMLHttpRequest;
    let oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async) {
        if (!url.match(/logstores/)) {
            this.logData = { method, url, async };
        }
        return oldOpen.apply(this, arguments);
    };
    let oldSend = XMLHttpRequest.prototype.send;

    let startTime;
    XMLHttpRequest.prototype.send = function (body) {
        if (this.logData) {
            let startTime = Date.now(); //发送直线记录下开始时间

            let handler = (type) => (event) => {
                let duration = Date.now() - startTime;
                let status = this.status;
                let statusText = this.statusText;

                tracker.send({
                    kind: 'stability',
                    type: 'xhr',
                    eventType: event.type, //load
                    pathname: this.logData.url, //请求路径
                    status: status + '-' + statusText, //状态码
                    duration, //持续时间
                    response: this.response
                        ? JSON.stringify(this.response)
                        : '', // 响应体
                    params: body || '',
                });
            };

            this.addEventListener('load', handler('load'), false);
            this.addEventListener('error', handler('error'), false);
            this.addEventListener('abort', handler('load'), false);
        }

        return oldSend.apply(this, arguments);
    };
}
