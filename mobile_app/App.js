import React from "react";
import {Provider} from "react-redux";
import {SplashScreen, AppLoading, Asset} from 'expo';
import {Image, View} from 'react-native';
import Navigation from "./Navigation/Navigation";
import {store, persistor} from "./Store/configureStore";
import {PersistGate} from "redux-persist/lib/integration/react";
import LoadingView from "./Components/LoadingView";


export default class App extends React.Component {

    state = {
        isSplashReady: false,
        isAppReady: false,
    };

    render() {
        if (!this.state.isSplashReady) {
            return (
                <AppLoading
                    startAsync={this._cacheSplashResourcesAsync}
                    onFinish={() => this.setState({isSplashReady: true})}
                    onError={console.warn}
                    autoHideSplash={false}
                />
            );
        }

        if (!this.state.isAppReady) {
            return (
                    <Image
                        source={require('./assets/splash.gif')}
                        onLoad={this._cacheResourcesAsync}
                        style={{flex:1, width: null, height: null}}
                        fadeDuration={0}
                        resizeMode="contain"
                    />
            );
        }

        return (
            <Provider store={store}>
                <PersistGate loading={<LoadingView/>} persistor={persistor}>
                    <Navigation/>
                </PersistGate>
            </Provider>
        );
    }

    _cacheSplashResourcesAsync = async () => {
        const gif = require('./assets/splash.gif');
        return Asset.fromModule(gif).downloadAsync()
    };

    _cacheResourcesAsync = async () => {
        SplashScreen.hide();
        setTimeout(() => {
            this.setState({isAppReady: true});
        }, 4000);
    }

}
