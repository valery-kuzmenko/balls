/**
 * @returns {Error}
 */
function abstractMethod(){
    throw new Error("Abstract method!");
}

/**
 * @syntax inherit(prototype_obj)
 * @param {Object} prototype_obj 
 * @returns {Object}
 */
function inherit(prototype_obj){
    if(prototype_obj == null){
        throw TypeError();
    }
    if(Object.create){
        return Object.create(prototype_obj);
    }
    
    var type = typeof prototype_obj;
    if(type == 'object' && type != 'function'){
        function f(){};
        f.prototype = prototype_obj;
    }
    
    return new f();
}

Object.defineProperty(Object.prototype, "extend", {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function(obj){
        var names = Object.getOwnPropertyNames(obj);
        for(var i=0; i < names.length; i++){
            var desc = Object.getOwnPropertyDescriptor(obj, names[i]);
            Object.defineProperty(this, names[i], desc);
        }
    }
});

/**
 * @syntax defineClass(constructor, [ methods ], [ statics ]) <br> define class using Java style
 * @param {Function} constructor constructor - initialize propertys of current item
 * @param {Object} methods methods of objects
 * @param {Object} statics methods of class
 * @return {Function} returns function constructor
 */
function defineClass(constructor, methods, statics){
    if(methods){
        constructor.prototype.extend(methods);
    }
        
    if(statics){
        constructor.extend(statics);
    }
    
    return constructor;
}

/**
 * @syntax defineSubclass(superclass, constructor, [ methods ], [ statics ])
 *  <br> imitation inheritance using Java style
 * @param {Function} superclass
 * @param {Function} constructor constructor - initialize propertys of current item
 * @param {Object} methods methods of objects
 * @param {Object} statics methods of class
 * @return {Function} returns function constructor
 */
function defineSubclass(superclass, constructor, methods, statics){
    constructor.prototype = inherit(superclass.prototype);
    constructor.prototype.constructor = constructor;
    
    if(methods){
        constructor.prototype.extend(methods);
    }
    
    if(statics){
        constructor.extend(statics);
    }
    
    return constructor;
}
/**
 * @syntax get_type(object)
 * @param {Object} object
 * @return {string} type of current object 
 * */
function get_type(object){
    var t, c, n; // type, class, name
    if (object === null){
        return 'null';
    } 
    if(object !== object){
        return 'nan';
    }
    if((t = typeof object) !== 'object'){
        return t;
    }
    if((c = classof(object)) != 'Object'){
        return c;
    }
    if(object.constructor && typeof object.constructor === 'function' && (n = object.constructor.getName()))
        return n;
    
    return 'Object';
    
}

/**
 * @syntax classof(object)
 * @param {Object} object
 * @return {string} class of current object | for standart js objects
 * */
function classof(object){
    if (object === null){
        return 'Null';
    }
    if (object === undefined){
        return 'Undefined';
    }
    
    return Object.prototype.toString.call(object).slice(8,-1);
}
/**
 * @return {string} name of current function
 * */
Function.prototype.getName = function(){
    return this.name || this.toString().match(/function\s*([~(]*)\(/)[1]; 
};

window.requestAnimationFrame = (function() {
    return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
})();

function test_show_point(i,j){
    (new HandleCanvas()).getContext().strokeStyle = "#000";
    (new HandleCanvas()).getContext().moveTo( i, j );
    (new HandleCanvas()).getContext().lineTo( i+1, j+1 );
    (new HandleCanvas()).getContext().stroke();
};
/**
 * This function caches all results of function<br>
 * and returns result from cache
 * @syntax cache_results(func)
 * @param {Function} func function for cashe
 * @return {mixed} returns result of current function
 * */
function cache_results(func){
    var cash = {};
    
    return function(){
        var key = arguments.length + Array.prototype.join.call(arguments, ',');
        if(key in cash){
            return cash[key];
        }else{
            return cash[key] = func.apply(this, arguments);
        }
    };
}
