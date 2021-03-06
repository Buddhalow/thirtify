(function() {
    module.factory('Google', function () {
        return {
            search() {
                fetch(

            }
        }
    });
}
class Google {
    constructor(apikeys) {

        this.apikeys = apikeys
    }

    search(q, site, fields, cx, exclude, offset) {
        var self = this;
        return new Promise((resolve, reject) => {
            var url =
            if (cache.isCached(url)) {
                var result = cache.load(url);
                resolve(result);
                return;
            }
            request({
                url
            }, (err, response, body) => {
                if (err) {
                    reject(err);
                    return;
                }
                ;
                var result = JSON.parse(body);
                if (!('items' in result)) {
                    result.items = [];
                }
                result.service = {
                    id: 'google',
                    name: 'Google',
                    type: 'google',
                    uri: 'bungalow:service:google'
                };
                cache.save(url, result);
                resolve(result);
            });
        });
    }

    createServer() {
        return express()
    }
}