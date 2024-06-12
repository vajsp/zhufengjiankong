import tracker from '.../utils/tracker';
import onload from '../utils/onload';

export function blankScreen() {
    let wrapperElements = ['html', 'body', '#container', '.content'];
    let emptyPoints = 0;
    function getSelector(element) {
        if (element.id) {
            return '#' + element.id;
        } else if (element.className) {
            //a b c
            const name = element.className
                .split(' ')
                .filter((item) => !!item)
                .join('.');
            return '.' + name;
        } else {
            return element.nodeName.toLowerCase();
        }
    }

    function isWrapper(element) {
        let selector = getSelector(element);
        if (wrapperElements.indexOf(selector) != -1) {
            emptyPoints++;
        }
    }

    onload(function () {
        for (let i = 0; i < 9; i++) {
            let xElemnt = document.elementFromPoint(
                (window.innerWidth * i) / 10,
                window.innerHeight / 2
            );

            let yElemnt = document.elementFromPoint(
                window.innerWidth / 2,
                (window.innerHeight * i) / 10
            );

            isWrapper(xElemnt);
            isWrapper(yElemnt);
        }

        if (emptyPoints > 16) {
            // 白点超过16个认为是白屏
            let centerElements = document.elementsFromPoint(
                window.innerWidth / 2,
                window.innerHeight / 2
            );

            tracker.send({
                kind: 'stability',
                type: 'blank',
                emptyPoints,
                screen: window.screen.width + '*' + window.screen.height,
                viewPoint: window.innerWidth + 'X' + window.innerHeight,
                selector: getSelector(centerElements[0]),
            });
        }
    });
}
