

const express = require('express');
const app = express();
const fs = require("fs");
const path = require("path");
const ejs = require("ejs-locals");

const utils = require("./utils/utils");
const root = utils.root;
const api = require('./routes/api');

app.set('case sensvitive routing', false);
app.set('view engine', 'ejs');
app.set('views', path.join(root, 'views'));
app.set('layout extractScripts', true);
app.engine('ejs', ejs);

app.use('/public', express.static(path.join(root, 'public')));
app.use('/api', api());

const listener = app.listen(process.env.PORT, process.env.IP, () => {
  console.log(`Server up and running on http://${listener.address().address}:${listener.address().port}`);
});