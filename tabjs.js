function tab2json(text, param) {
    if (param == undefined) param = {}
    if (param.cr == undefined) param.cr = '\r\n';
    if (param.value == undefined) param.value = 'text';
    if (param.subnodes == undefined) param.subnodes = 'objarray';
    if (param.onError == undefined)
        param.onError = function(lineNumber) {
            return { lineNumber }
        }

    let lines = text.split(param.cr);
    let i = -1;
    return processlines(0);

    function tabcount(i) {
        if (i >= lines.length) return 0;
        let line = lines[i];
        if (line.trim().length == 0) return 0;
        return (line.match(/^\t*/))[0].length;
    }

    function getline(i) {
        if (i >= lines.length) return "";
        return lines[i].trim();
    }

    function processlines(d) {
        let obj = [];
        i++;
        while (i < lines.length && tabcount(i) == d) {
            obj.push({
                [param.value]: getline(i)
            });
            let l = tabcount(i + 1);
            if (l > d + 1) throw param.onError(i + 2);

            if (l == d + 1)
                obj[obj.length - 1][param.subnodes] = processlines(d + 1);
            else
                i++;
        }
        return obj;
    };
}
