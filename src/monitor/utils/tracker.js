const host = 'cn-beijing.log.aliyuncs.com';
const project = 'zhufengmoitor';
const logStore = 'zhufengmonitor-store';
let userAgent = require('user-agent');

function getExtraData() {
    return {
        title: document.title,
        url: location.href,
        timestamp: Date.now(),
        userAgent: userAgent.parse(navigator.userAgent),
    };
}

class SendTracker {
    constructor() {
        this.url = `${project}.${host}/logstores/${logStore}/track`; //上报中心
        this.xhr = new XMLHttpRequest();
    }

    send(data = {}) {
        let extraData = getExtraData();
        let log = { ...extraData, ...data };
        for (const key in object) {
            if (Object.hasOwnProperty.call(object, key)) {
                if (typeof log[key] === 'number') {
                    log[key] = `${log[key]}`;
                }
            }
        }

        this.xhr.open('POST', this.url, true);
        // let bodoy = JSON.stringify(log);
        let body = JSON.stringify({
            __logs__: [log],
        });

        this.xhr.setRequestHeader('Content-Type', 'application/json');
        this.xhr.setRequestHeader('x-log-apiversion', '0.6.0');
        this.xhr.setRequestHeader('x-log-bodyrawsize', bodoy.length);
        this.xhr.onload = function () {
            console.log(this.xhr.response);
        };
        this.xhr.onerror = function (error) {
            console.log(error);
        };

        this.xhr.send(bodoy);
    }
}
export default new SendTracker();
