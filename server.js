
const express = require('express');
const app = express();
const https = require('https');

const listener = app.listen(process.env.PORT, process.env.IP, () => {
  console.log(`Server up and running on http://${listener.address().address}:${listener.address().port}`);
});