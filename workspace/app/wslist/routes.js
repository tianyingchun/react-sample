import React from 'react';
import { Route, Redirect } from 'react-router';
import RouteWrapper from '../../components/RouteWrapper';
import NoMatch from '../../components/NoMatch';
import WsList from '../../views/WsList';
export default function () {
  return (
    <Route path='/' component={ RouteWrapper }>
      <Route path='workspace/list' component={ WsList } />
      <Redirect from="/" to="/workspace/list" />
      <Route path="*" component={ NoMatch }/>
    </Route>
  );
}
