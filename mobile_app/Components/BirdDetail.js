import React from 'react';
import {WebView} from 'react-native';



class BirdDetail extends React.Component {

    render() {
        const bird_name = this.props.navigation.state.params.bird_name;
        const url = "https://fr.wikipedia.org/wiki/" + bird_name;
        return (
            <WebView source={{uri: url}}
             />
        )
    }
}


export default BirdDetail