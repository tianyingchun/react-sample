import path from 'path';
import express from 'express';
import cors  from  'cors';
import favicon from 'serve-favicon';
import execTime from 'exec-time';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { RoutingContext, match } from 'react-router';
import createLocation from 'history/lib/createLocation'
import configureStore from './workspace/app/configureStore';
import fetchComponentData from './utils/fetchComponentData';
import HtmlHead from './workspace/components/HtmlHead';

const app = express();
const NODE_ENV = app.get('env') || 'production';
const port = process.env.PORT || 40000;
const profiler = new execTime('[ISO]', NODE_ENV === 'development', 'ms');

app.use(favicon(path.join(__dirname, './public/favicon.ico')));

// Use this middleware to serve up static files built into the dist directory
app.use("/public", cors(), express.static(path.join(__dirname, './public')));

// This is fired every time the server side receives a request
app.use(handleRender);

// We are going to fill these out in the sections to follow
function handleRender(req, res) {

  let store = configureStore('wslist');
  let location = createLocation(req.url);
  let routes = require('./workspace/app/wslist/routes');
  // start profileing.
  profiler.beginProfiling();

  match({ routes: routes(), location: location }, (error, redirectLocation, renderProps) => {
    profiler.step('React-Router');

    if (redirectLocation){
      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
      return;
    }
    else if (error){
      res.send(500, error.message);
      return;
    }
    else if (renderProps == null){
      res.send(404, 'Not found');
      return;
    }

    const links = [
      'http://localhost:3000/public/workspace/wslist/bundle.css'
    ];
    const head = React.renderToString(React.createFactory(HtmlHead)({links}));

    function renderView() {

      profiler.step('fetchComponentData');

      const InitialView = (
        <Provider store={store}>
          {() =>
            <RoutingContext {...renderProps} />
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
            <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};</script>
            <div id="react-view">${componentHTML}</div>
            <script src="http://localhost:3000/public/browser-polyfill.js"></script>
            <script src="http://localhost:3000/public/reactkits.js"></script>
            <script src="http://localhost:3000/public/workspace/wslist/bundle.js"></script>
          </body>
        </html>
      `;
      profiler.step('renderFullPageHtml');

      return HTML;
    }

    fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
      .then(renderView)
      .then(html => res.end(html))
      .catch(err => res.end(err.message));
  });
}

var server = app.listen(port, function () {
  console.log('===Express server listening on port %d ===', server.address().port);
});
