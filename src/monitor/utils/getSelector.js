function getSelectors(path) {
    return path
        .reverse()
        .filter((element) => {
            return element !== document && element !== window;
        })
        .map((elememt) => {
            let selector = '';
            if (elememt.id) {
                return `#${elememt.tagName.toLowerCase()}#${element.id}}`;
            } else if (
                elememt.className &&
                typeof elememt.className === 'string'
            ) {
                return `${elememt.tagName.toLowerCase()}.${elememt.className}}`;
            } else {
                selector = elememt.nodeName.toLowerCase();
            }

            return selector;
        })
        .join(' ');
}

export default function (path) {
    if (Array.isArray(path)) {
        return getSelectors(path);
    } else {
        let pathArr = [];
        while (path) {
            pathArr.push(path);
            path = path.parentNode;
        }

        return getSelectors(pathArr);
    }
}
