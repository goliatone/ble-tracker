define('uuid', function(require){

    function getUUID() {
        function makeAndStore() {
            var uuid = makeUUID();
            localStorage.setItem('__uuid__', uuid);
            return uuid;
        }

        function makeUUID() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a, b) {
                return b = Math.random() * 16, (a == "y" ? b & 3 | 8 : b | 0).toString(16)
            });
        }

        return localStorage.getItem('__uuid__') || makeAndStore();
    }

    return {
        getUUID: getUUID
    };
});
