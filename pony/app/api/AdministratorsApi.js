'use strict';

const Administrators = require('../models/Administrators');
const admins = new Administrators();

class AministratorsApi {
  get(request, response) {
    admins.selectAll((error, result, fields) => {
     if (error) {
      response.status(204).json(error);
      return ;
     }

      response.status(200).json(result);
    });
  }
  
  getById(request, response) {
    admins.selectAllByCondition({ 'id': request.params.id }, (error, result, fields) => {
     if (error) {
      response.status(204).json(error);
      return ;
     }

      response.status(200).json(result);
    });
  }
  
  post(request, response) {
    admins.insert({ 'name': request.body.name, 'password': request.body.password, 'email': request.body.email }, (error, result, fields) => {
     if (error) {
      response.status(204).json(error);
      return ;
     }

      response.status(200).end('Inserted row into table');
    });
  }
  
  put(request, response) {
    admins.update(request.body.what, request.body.where, (error, result, fields) => {
     if (error) {
      response.status(204).json(error);
      return ;
     }

      response.status(200).end(`Changes made. Affected rows: ${result.affectedRows}. ${result.message}`)
    });
  }
  
  delete(request, response) {
    admins.delete(request.body, (error, result, fields) => {
     if (error) {
      response.status(204).json(error);
      return ;
     }

      response.status(200).end('Row deleted')
    });
  }
}

module.exports = AministratorsApi;

