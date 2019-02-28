import React from "react";
import { Provider }  from "react-redux";
import Navigation from "./Navigation/Navigation";
import {store, persistor} from "./Store/configureStore";
import { PersistGate } from "redux-persist/lib/integration/react";
import LoadingView from "./Components/LoadingView";

export default class App extends React.Component {
  render() {
      return (
          <Provider store={store}>
              <PersistGate loading={<LoadingView/>} persistor={persistor}>
                  <Navigation/>
              </PersistGate>
          </Provider>
      );
  }
}
