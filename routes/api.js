
const express = require("express");
const router = express();
const admins = require("./../models/admins");

module.exports = (() => {
  
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
    console.log('selected by id')
    admins.selectByColumns({ 'id': request.params.id }).then(
      (result) => response.status(200).json(result),
      (error) => response.status(204).json(error)
    );
  });
  
  return router;
});