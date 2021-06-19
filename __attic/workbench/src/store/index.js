import { connectRouter } from 'connected-react-router';

import history from './history';

export default {
  router: connectRouter(history),
};
