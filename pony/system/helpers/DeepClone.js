'use strict';

const _checkIfCustomObject = Symbol('checkIfCustomObject');
const _deepClone = Symbol('deepClone');
const _newObject = Symbol('newObject');

class DeepClone {
 
  [_checkIfCustomObject](object) {
    if (object instanceof Array || object instanceof Function || object instanceof Date)
      return true;
    return false;
  }

  [_deepClone](initial, key, path) {
    'use strict';
    const object = initial[key] || initial;

    if ((typeof initial[key] !== 'object' || this[_checkIfCustomObject](initial[key])) && key !== undefined && key !== null) {
      eval(`this[_newObject]${path.join('')}=initial[key]`);
      return ;
    }

    for (const property in object) {
      path.push(`['${property}']`);
      if (typeof object[property] === 'object' && !this[_checkIfCustomObject](object[property]))
        eval(`this[_newObject]${path.join('')}={}`);
      this[_deepClone](object, property, path);
      path.splice(path.length - 1, 1);
    }
  }

  newObject(initial) {
    if (initial === undefined || initial === null)
      return {};
    
    this[_newObject] = {};
    this[_deepClone](initial, null, []);
    
    return this[_newObject];
  }
}

module.exports = DeepClone;