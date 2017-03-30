'use strict';

const uglifyJS = require('uglify-js');
const uglifyCSS = require('uglifycss');
const path = require('path');
const fs = require('fs');

const jsName = 'output.min.js';
const cssName = 'output.min.css';

class Minify {
  constructor(js, css ) {
    this.js = js || null;
    this.css = css || null;
  }
  
  getFile(folder, name) {
    fs.readdir(folder, (error, files) => {
      if (error)
        throw error;
      
      if (files.indexOf(jsName) >= 0)
        files.splice(files.indexOf(jsName), 1);

      files = files.map(item => path.join(folder, item));

      const minifiedJS = uglifyJS.minify(files);
      console.log('line 29: ', minifiedJS);

      fs.writeFile(path.join(folder, jsName), minifiedJS.code, (err) => {
        if (err) {
          console.log('Could not minify file: %s:', name);
          return ;
        }
        
        console.log('File was succesfully minified');
      }); 
    });
  }
  
  minify() {
    if (this.js)
      this.getFile(this.js, jsName);
  }
}

module.exports = Minify;