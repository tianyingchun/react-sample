import React from 'react';
import { Provider } from 'react-redux';
import Router from 'react-router';
import { history } from '../../../utils/browserHistory';
import configureStore from '../../stores/configureStore';
import routes from './routes';

const initialState = window.__INITIAL_STATE__;

const store = configureStore(initialState);
const rootElement = document.getElementById('react-view');
React.render(
  <Provider store={store}>
    {() => <Router children={routes()} history={history}/>}
  </Provider>,
  rootElement
);
