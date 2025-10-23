/**
 * Created by liqs on 2022/01/25
 */
const common = {}
/**
 * 字符串是否为空
 * @param str 字符串
 */
common.isNull = function(str) {
    return null == str || typeof(str) == "undefined" || "" == str || "null" == str || str.length == 0;
}

common.isObjectNull = function(obj) {
    return undefined == obj || null == obj
}

common.isNumber = function(val){

    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}

common.copyArr = function(arr){
    return arr.map(function(e){
        if(typeof e === 'object'){
            return Object.assign({},e)
        }else{
            return e
        }
    })
}

common.copyObj = function(obj){
    var result={};
    for (var key in obj) {
        result[key] = typeof obj[key]==='object'?copyObj(obj[key]): obj[key];
    }
    return result;
}

common.copyNotEmptyObj = function(obj){
  var result={};
  for (var key in obj) {
    if(obj[key] != '')
       result[key] = typeof obj[key]==='object'?common.copyObj(obj[key]): obj[key];
  }
  return result;
}




/**
 * 对象深拷贝
 */
export const deepClone = data => {
  var type = getObjType(data);
  var obj;
  if (type === 'array') {
    obj = [];
  } else if (type === 'object') {
    obj = {};
  } else {
    //不再具有下一层次
    return data;
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
};
export const getObjType = obj => {
  var toString = Object.prototype.toString;
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  if (obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
};


export default common
