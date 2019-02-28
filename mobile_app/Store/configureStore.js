import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import updateObservedBirds from "./Reducers/observedBirdsReducer";

const persistConfig = {
 key: 'root',
 storage: storage,
 stateReconciler: autoMergeLevel2
};

const pReducer = persistReducer(persistConfig, updateObservedBirds);

export const store = createStore(pReducer);
export const persistor = persistStore(store);