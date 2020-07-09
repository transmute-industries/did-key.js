import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { routerMiddleware } from "connected-react-router";
import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import withReduxEnhancer from "addon-redux/enhancer";

import rootReducer from ".";
import history from "./history";

export default (appReducers = {}) => {
  // Persistance configuration
  const persistConfig = {
    key: "root",
    whitelist: ["wallet"],
    storage,
  };

  const middlewares = [thunk, routerMiddleware(history)];

  // TODO: refactor for production
  if (process.env.NODE_ENV !== "production") {
    // const reduxListener = createStorybookListener();
    // middlewares.push(reduxListener);
  }

  // Store.
  const store = createStore(
    persistReducer(
      persistConfig,
      combineReducers({ ...rootReducer, ...appReducers })
    ),
    composeWithDevTools(
      compose(applyMiddleware(...middlewares), withReduxEnhancer)
    )
  );

  // Persistor.
  const persistor = persistStore(store);
  return {
    store,
    persistor,
    history,
  };
};
