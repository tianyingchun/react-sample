import React from 'react';
import { Route, Redirect } from 'react-router';
import RouteWrapper from '../../components/RouteWrapper';
import WsList from '../../views/WsList';
export default function () {
  return (
    <Route component={ RouteWrapper }>
      <Route path='workspace/list' component={ WsList } />
      <Redirect from="/" to="workspace/list" />
    </Route>
  );
}
