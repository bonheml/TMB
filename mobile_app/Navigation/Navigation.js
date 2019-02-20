// Navigation/Navigation.js

import { createStackNavigator, createAppContainer } from 'react-navigation'
import BirdList from '../Components/BirdList'
import BirdResults from "../Components/BirdResults";
import PhotoCapture from "../Components/PhotoCapture";
import Record from "../Components/Record";
import BirdDetail from "../Components/BirdDetail";
import PhotoEdit from "../Components/PhotoEdit";

const BirdStackNavigator = createStackNavigator({
    List: {
        screen: BirdList,
        navigationOptions: {
          title: "Mes oiseaux"
        }
      },
    Detail: {
      screen: BirdDetail
    },
    Results: {
        screen: BirdResults,
        navigationOptions: {
            title: 'Résultats'
        }
    },
    PhotoCapture: {
        screen: PhotoCapture,
        navigationOptions: {
            title: "Prendre une photo"
        }
    },
    Record: {
        screen: Record,
        navigationOptions: {
            title: "Enregistrer un chant"
        }
    },
    PhotoEdit: {
        screen: PhotoEdit,
        navigationOptions: {
            title: "Envoyer la photo"
        }
    }
});

export default createAppContainer(BirdStackNavigator)