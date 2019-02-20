import React from 'react'
import {FlatList, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import BirdItem from './BirdItem'
import birds from '../Helpers/birdData'

class BirdList extends React.Component {
    _displayBirdDetail = (bird_name) => {
        this.props.navigation.navigate("Detail", {bird_name: bird_name})
    };

    _displayIcon(sourceImage) {
        return (
          <Image
            style={styles.icon}
            source={sourceImage}
          />
        )
    }

    _addPhoto() {
        this.props.navigation.navigate("PhotoCapture")
    }

    _addRecord() {
        this.props.navigation.navigate("Record")
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={birds}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <BirdItem bird={item}
                                                      displayBirdDetail={this._displayBirdDetail}/>}
                />
                <View style={styles.icons_container}>
                    <TouchableOpacity onPress={() => this._addPhoto()}>
                        {this._displayIcon(require('../Images/camera.png'))}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._addRecord()}>
                        {this._displayIcon(require('../Images/record.png'))}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    icon: {
        width: 60,
        height: 60,
    },
    icons_container: {
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
        justifyContent: 'space-between',
    },
    container: {
        flex: 1
    }
});

export default BirdList