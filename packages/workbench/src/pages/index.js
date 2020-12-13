import { Home } from "./home";
import { Resolver } from "./resolver";

import { Unextractable } from './unextractable'

export const routes = [
  { path: "/", exact: true, component: Home },
  { path: "/unextractable", exact: true, component: Unextractable },
  { path: "/:did", exact: true, component: Resolver },

];
