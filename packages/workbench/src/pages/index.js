import { Home } from './home';
import { Resolver } from './resolver';

export const routes = [
  { path: '/', exact: true, component: Home },
  { path: '/:did', exact: true, component: Resolver },
];
