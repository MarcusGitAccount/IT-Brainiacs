'use strict';

const express = require('express');
const parser = require('body-parser');
const session = require('client-sessions');
const csrf = require('csurf');

const middleware = require('./Middleware');

const _router = Symbol('_router');

class BaseRouter {
  constructor() {
    this[_router] = express.Router();
    this[_router].use(parser.urlencoded({ extended: true, limit: '35mb'}));
    this[_router].use(parser.json({limit: '15mb'}));
  }
  
  get authRouter() {
    this[_router].use(session(middleware.sessionObject));
    this[_router].use(csrf());
    
    return this[_router];
  }
  
  get controllerRouter() {
    this[_router].use(session(middleware.sessionObject));
    this[_router].use(csrf());
    this[_router].use(middleware.checkSession);
    
    return this[_router]
  }
  
  get apiRouter() {
    return this[_router];
  }
}

module.exports = new BaseRouter();