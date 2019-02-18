import React from 'react'
import {FlatList, View} from 'react-native';
import BirdItem from './BirdItem'
import birds from '../Helpers/birdData'

class BirdList extends React.Component {
    _displayBirdDetail = (bird_name) => {
        this.props.navigation.navigate("Detail", {bird_name: bird_name})
    };

    render() {
        return (
            <View>
                <FlatList
                    data={birds}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <BirdItem bird={item}
                                                      displayBirdDetail={this._displayBirdDetail}/>}
                />
            </View>
        )
    }
}

export default BirdList