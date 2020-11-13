import { Home } from "./home";
// import { Workbench } from "./workbench";
// import { PdfDemo } from "./pdf";
// import { Videos } from "./videos";
import { Unextractable } from './unextractable'

export const routes = [
  { path: "/", exact: true, component: Home },
  { path: "/unextractable", exact: true, component: Unextractable },

  // { path: "/workbench", exact: true, component: Workbench },
  // { path: "/offline", exact: true, component: PdfDemo },
  // { path: "/videos", exact: true, component: Videos },
];
