import React, { Component } from 'react';
import { connect } from 'react-redux';
import WorkspaceList  from '../components/WorkspaceList';

@connect((state) => ({ workspaces: state.workspaces }))
class WsList extends Component {
  render () {
    let { workspaces, dispatch } = this.props;
    return (
      <WorkspaceList workspaces= { workspaces } />
    );
  }
}
export default WsList;
