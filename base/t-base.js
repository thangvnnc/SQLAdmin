module.exports = (function () {
    function _objectPropertyCase(object, toUpperCase) {
        var key, keys = Object.keys(object);
        var n = keys.length;
        var newObject={};
        var newKey = '';
        var infoObject = '';
        while (n--) {
            key = keys[n];
            if (toUpperCase === true) {
                newKey = key.toUpperCase();
            }
            else {
                newKey = key.toLowerCase();
            }
            newObject[newKey] = object[key];
            infoObject += newKey + " : " + object[key] + '\n';
        }
        newObject['T_INFO_OBJECT']= infoObject;
        return newObject;
    }

    function _arrayObjectPropertyCase(arrayObject, toUpperCase) {
        var arrayObjectCase = [];
        arrayObject.forEach(object => {
            arrayObjectCase.push(_objectPropertyCase(object, toUpperCase));
        });
        return arrayObjectCase;
    }
    
    return {
        objectPropertyCase: _objectPropertyCase,
        arrayObjectPropertyCase: _arrayObjectPropertyCase,
    };
})();