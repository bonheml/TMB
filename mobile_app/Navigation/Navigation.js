// Navigation/Navigation.js

import { createStackNavigator, createAppContainer } from 'react-navigation'
import BirdList from '../Components/BirdList'
import BirdResults from "../Components/BirdResults";
import PhotoUpload from "../Components/PhotoUpload";
import RecordUpload from "../Components/RecordUpload";
import BirdDetail from "../Components/BirdDetail";

const BirdStackNavigator = createStackNavigator({
    List: {
        screen: BirdList,
        navigationOptions: {
          title: 'Mes oiseaux'
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
    PhotoUpload: {
        screen: PhotoUpload,
        navigationOptions: {
            title: 'Ajouter une photo'
        }
    },
    RecordUpload: {
        screen: RecordUpload,
        navigationOptions: {
            title: 'Ajouter un enregistrement'
        }
    }
});

export default createAppContainer(BirdStackNavigator)