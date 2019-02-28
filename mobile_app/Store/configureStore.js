import {createStore} from "redux";
import {persistStore, persistCombineReducers} from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import updateObservedBirds from "./Reducers/observedBirdsReducer";
import updatePreviousResults from "./Reducers/previousResultsReducer"

const persistConfig = {
    key: "root",
    storage: storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ["updateObservedBirds"]
};

const rootReducer = {
    updateObservedBirds,
    updatePreviousResults
};

const pReducer = persistCombineReducers(persistConfig, rootReducer);

export const store = createStore(pReducer);
export const persistor = persistStore(store);