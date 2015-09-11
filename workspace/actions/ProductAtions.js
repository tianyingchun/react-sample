import * as types from '../constants/ProductActionTypes';

export function getProductById () {
  return {
    type: types.GET_PRODUCT,
    promise: new Promise((resolve, rejecet) => {
      resolve({
        title: 'SNS Platform product',
        description: 'SNS Platform product',
        canonical: 'http://example.com/product-fashion-women-clothing',
        meta: {
          name: {
            keywords: 'keywords 1, keywords 3, product'
          }
        }
      })
    })
  };
}
