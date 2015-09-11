import React from 'react';
import Route from 'react-router';
import App from '../../views/App';
import Home from '../../views/Home';
import About from '../../views/About';
import Product from '../../views/Product';

export default function () {
  return (
    <Route component={App}>
      <Route path='/' component={Home} />
      <Route path='/about' component={About} />
      <Route path='/product' component={Product} />
    </Route>
  );
}
