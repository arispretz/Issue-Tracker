'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const mongoose = require('mongoose');

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const issueSchema = new mongoose.Schema([
  {
    project: {
      type: String,
      required: true,
    },
    issue_title: {
      type: String,
      required: true,
    },
    issue_text: {
      type: String,
      required: true,
    },
    created_on: {
      type: String,
      required: true,
    },
    updated_on: {
      type: String,
      required: true,
    },
    created_by: {
      type: String,
      required: true,
    },
    assigned_to: {
      type: String,
      required: false,
    },
    open: {
      type: Boolean,
      required: true,
    },
    status_text: {
      type: String,
      required: false,
    },
  },
]);

const issueModel = mongoose.model('issue', issueSchema);

//Sample front-end
app.route('/:project/').get(function(req, res) {
  res.sendFile(process.cwd() + '/src/views/issue.html');
});

//Index page (static HTML)
app.route('/').get(function(req, res) {
  res.sendFile(process.cwd() + '/src/views/index.html');
});


//Routing for API
apiRoutes(app, issueModel);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404).type('text').send('Not Found');
});

//Start our server 
const listener = app.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app; //for testing
