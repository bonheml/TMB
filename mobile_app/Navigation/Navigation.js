// Navigation/Navigation.js

import { createStackNavigator, createAppContainer } from 'react-navigation';
import BirdList from "../Components/BirdList";
import BirdResults from "../Components/BirdResults";
import PhotoCapture from "../Components/PhotoCapture";
import Record from "../Components/Record";
import BirdDetail from "../Components/BirdDetail";
import PhotoEdit from "../Components/PhotoEdit";
import RecordEdit from "../Components/RecordEdit";

const BirdStackNavigator = createStackNavigator({
    List: {
        screen: BirdList,
        navigationOptions: {
          title: "Mes oiseaux",
            headerStyle: {
                backgroundColor: '#46653c',
            },
            headerTintColor: '#e2e5ec',
        }
      },
    Detail: {
        screen: BirdDetail,
        navigationOptions: {
          title: "Détails",
            headerStyle: {
                backgroundColor: '#46653c',
            },
            headerTintColor: '#e2e5ec',
        }
    },
    Results: {
        screen: BirdResults,
        navigationOptions: {
            title: 'Résultats',
            headerStyle: {
                backgroundColor: '#46653c',
            },
            headerTintColor: '#e2e5ec',
        }
    },
    PhotoCapture: {
        screen: PhotoCapture,
        navigationOptions: {
            title: "Prendre une photo",
            headerStyle: {
                backgroundColor: '#46653c',
            },
            headerTintColor: '#fff',
        }
    },
    Record: {
        screen: Record,
        navigationOptions: {
            title: "Enregistrer un chant",
            headerStyle: {
                backgroundColor: '#46653c',
            },
            headerTintColor: '#e2e5ec',
        }
    },
    PhotoEdit: {
        screen: PhotoEdit,
        navigationOptions: {
            title: "Envoyer la photo",
            headerStyle: {
                backgroundColor: '#46653c',
            },
            headerTintColor: '#e2e5ec',
        }
    },
    RecordEdit: {
        screen: RecordEdit,
        navigationOptions: {
            title: "Envoyer l'enregistrement",
            headerStyle: {
                backgroundColor: "#46653c",
            },
            headerTintColor: "#e2e5ec",
        }
    }
});

export default createAppContainer(BirdStackNavigator)