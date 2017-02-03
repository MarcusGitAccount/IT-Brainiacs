
module.exports = (() => {
  const express = require("express");
  const router = express();
  const admins = require("./../models/admins");
  const parser = require('body-parser');
  
  router.use(parser.urlencoded({ 'extended': true}));
  router.use(parser.json());
  
  router.get('/', (request, response) => {
    response.status(200).end('Web api for serving this project');
  });
  
  router.get('/admins', (request, response) => {
    admins.selectAll().then(
      (result) => response.status(200).json(result),
      (error) => response.status(204).json(error)
    );
  });
  
  router.get('/admins/:id', (request, response) => {
    admins.selectByColumns({ 'id': request.params.id }).then(
      (result) => response.status(200).json(result),
      (error) => response.status(204).json(error)
    );
  });
  
  router.post('/admins', (request, response) => {
    admins.insert({ 'name': request.body.name, 'password': request.body.password, 'email': request.body.email }).then(
      (result) => response.status(200).end(`Row succesfully inserted at position ${result.insertId}`),
      (error) => response.json(error)
    );
  });
  
  router.put('/admins', (request, response) => {
    admins.update(request.body.what, request.body.where).then().then(
      (result) => response.status(200).end(`Changes made. Affected rows: ${result.affectedRows}. ${result.message}`),
      (error) => response.json(error)
    );
  });
  
  router.delete('/admins', (request, response) => {
    console.log(request.body);
    admins.delete(request.body).then(
      (result) => response.status(200).end(`Changes made. Affected rows: ${result.affectedRows}.`),
      (error) => response.json(error)
    );
  });
  
  return router;
});