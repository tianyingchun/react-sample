export function getProductById () {
  return {
    type: 'GET_PRODUCT',
    promise: Promise.resolve({ data:'teststeeste' })
  };
}
