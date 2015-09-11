import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as WsListActions from '../actions/WsListActions';
// import DocumentMeta from 'react-document-meta';
import WorkspaceList from '../components/WorkspaceList';
import ReactButton from '../components/Button';

@connect((state) => ({ workspaces: state.workspaces }))
class WsList extends Component {
  constructor(...args) {
    super(...args);
    console.log('constructor');
  }
  render () {
    let { workspaces, dispatch } = this.props;
    // place meta in all individule module root view.
    // const meta = {
    //   title: 'SNS Platform',
    //   description: 'SNS Platform',
    //   canonical: 'http://example.com/product-fashion-women-clothing',
    //   meta: {
    //     name: {
    //       keywords: 'keywords 1, keywords 3'
    //     }
    //   }
    // };
    //
    let isLoading = workspaces.isLoading;
    let loadingTxt = isLoading ? 'LOADING.....': 'INIIAL';
    let action = bindActionCreators(WsListActions, dispatch);

    console.log('loading: ', loadingTxt);

    // manully dispatch action.
    // dispatch(action.getExistedWsList());
    return (
      <div>
        <ReactButton loading={ loadingTxt }/>
        { /*<DocumentMeta {...meta}/> */ }
        <WorkspaceList workspaces= { workspaces.list || workspaces } />
        <button onClick={() => action.getExistedWsList('workspaceId')}>trigger add</button>
      </div>
    );
  }
}
export default WsList;
