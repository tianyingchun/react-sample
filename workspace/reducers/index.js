import memberRecuder from './member';
import wslistRecuder from './wslist';

export default function findReducers (moduleName) {

  if (!moduleName) {
    throw new Error('we must specific `moduleName` to construct corresponding final reducers');
  }
  switch (moduleName) {

    case 'member':
      return memberRecuder;

    case 'wslist':
      return wslistRecuder;

    default:
      throw new Error(`can not find '${moduleName}' final reducers`);

  }
}
