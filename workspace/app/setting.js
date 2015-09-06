import React from 'react';
import Route from 'react-router';
import App from '../widgets/App';
import Home from '../widgets/Home';
import About from '../widgets/About';

export default function () {
  return (
    <Route component={App}>
      <Route path='/' component={Home} />
      <Route path='/about' component={About} />
    </Route>
  );
}
