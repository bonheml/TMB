import React from 'react'
import {FlatList, View, Button} from 'react-native';
import BirdItem from './BirdItem'
import { loadBirdsFromList } from "../API/WikiAPI";

class BirdResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = { birds : [] }
    }

    _loadBirdInfo() {
        let bird_list = ["Bubo_bubo", "Falco_tinnunculus"];
        loadBirdsFromList(bird_list)
            .then((birds) => {
                this.setState({ birds, })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <View>
                <Button
                    onPress={() => this._loadBirdInfo()}
                    title="Load birds info"
                    color="#841584"
                    accessibilityLabel="Load birds info"
                />
                <FlatList
                    data={this.state.birds}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <BirdItem bird={item}/>}
                />
            </View>
        )
    }
}

export default BirdResults