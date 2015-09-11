import React, { Component } from 'react';
import { connect } from 'react-redux';
// import DocumentMeta from 'react-document-meta';
import WorkspaceList from '../components/WorkspaceList';

@connect((state) => ({ workspaces: state.workspaces }))
class WsList extends Component {
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
    return (
      <div>
        { /*<DocumentMeta {...meta}/> */ }
        <WorkspaceList workspaces= { workspaces } />
      </div>
    );
  }
}
export default WsList;
