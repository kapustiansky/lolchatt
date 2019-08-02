var api = {
    _q: function (url, method, data, callback) {
        callback = callback || function () { };
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && [200, 201].indexOf(this.status) != -1) {
                if (this.responseText) {
                    callback(JSON.parse(this.responseText));
                }
            }
        };

        xhr.open(method, url, true);
        
        if (method != 'DELETE') {
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        }
        xhr.send(JSON.stringify(data) || '');
    },
    get: function (url, cb) {
        return this._q(url, 'GET', [], cb);
    },
    post: function (url, data, cb) {
        return this._q(url, 'POST', data, cb);
    },
    put: function (url, data, cb) {
        return this._q(url, 'PUT', data, cb);
    },
    delete: function (url, cb) {
        return this._q(url, 'DELETE', null, cb);
    },
}