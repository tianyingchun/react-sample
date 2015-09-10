// maybe we need to install globally.
require("babel/register")({stage: 0});

import path from 'path';
import express from 'express';
import cors  from  'cors';
import favicon from 'serve-favicon';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Router from 'react-router';
import Location from 'react-router/lib/Location';

import configureStore from './workspace/stores/configureStore';
import fetchComponentData from './utils/fetchComponentData';
import Head from './workspace/views/Head';

const app = express();
const port = process.env.PORT || 40000;

app.use(favicon(path.join(__dirname, './public/favicon.ico')));

// Use this middleware to serve up static files built into the dist directory
app.use("/public", cors(), express.static(path.join(__dirname, './public')));

// This is fired every time the server side receives a request
app.use(handleRender);

// We are going to fill these out in the sections to follow
function handleRender(req, res) {
  console.log(req.url, req.path, req.query);

  const location = new Location(req.path, req.query);
  const store = configureStore();

  var  routes = require('./workspace/routes/member');

  Router.run(routes(), location, (error, routeState, transition) => {

    const head = React.renderToString(React.createFactory(Head)());

    function renderView() {
      const InitialView = (
        <Provider store={store}>
          {() =>
            <Router {...routeState} />
          }
        </Provider>
      );

      const componentHTML = React.renderToString(InitialView);

      const initialState = store.getState();

      const HTML = `
        <!DOCTYPE html>
        <html>
          ${head}
          <body>
            <link rel="stylesheet" type="text/css" href="http://localhost:3000/public/workspace/member/bundle.css">
            <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};</script>
            <div id="react-view">${componentHTML}</div>
            <script src="http://localhost:3000/public/browser-polyfill.js"></script>
            <script src="http://localhost:3000/public/reactkits.js"></script>
            <script src="http://localhost:3000/public/workspace/member/bundle.js"></script>
          </body>
        </html>
      `;

      return HTML;
    }

    fetchComponentData(store.dispatch, routeState.components, routeState.params)
      .then(renderView)
      .then(html => res.end(html))
      .catch(err => res.end(err.message));
  });
}

var server = app.listen(port, function () {
  console.log('===Express server listening on port %d ===', server.address().port);
});
