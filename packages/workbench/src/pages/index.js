import { Home } from "./home";
import { Resolver } from "./resolver";
// import { Workbench } from "./workbench";
// import { PdfDemo } from "./pdf";
// import { Videos } from "./videos";
import { Unextractable } from './unextractable'

export const routes = [
  { path: "/", exact: true, component: Home },
  { path: "/:did", exact: true, component: Resolver },
  { path: "/unextractable", exact: true, component: Unextractable },

  // { path: "/workbench", exact: true, component: Workbench },
  // { path: "/offline", exact: true, component: PdfDemo },
  // { path: "/videos", exact: true, component: Videos },
];
