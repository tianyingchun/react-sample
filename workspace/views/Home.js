import React, { Component/*, PropTypes*/} from 'react';
import * as ProductActions from '../actions/ProductAtions';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';

if (process.env.BROWSER) {
  require('../stylesheets/sample-less.less');
}

export default class Home extends Component {

  render () {
    const meta = {
      title: 'SNS Platform',
      description: 'SNS Platform',
      canonical: 'http://example.com/product-fashion-women-clothing',
      meta: {
        name: {
          keywords: 'keywords 1, keywords 3'
        }
      }
    };
    return (
      <div>
        <DocumentMeta {...meta}/>
        <div> Home </div>
      </div>
    );
  }
}

