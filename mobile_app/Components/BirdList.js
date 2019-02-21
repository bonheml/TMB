import React from 'react'
import {FlatList, View, TouchableOpacity, StyleSheet} from 'react-native'
import {Icon} from 'native-base'
import BirdItem from './BirdItem'
import birds from '../Helpers/birdData'

class BirdList extends React.Component {
    _displayBirdDetail = (bird_name) => {
        this.props.navigation.navigate("Detail", {bird_name: bird_name})
    };

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
                <View style={styles.icon_container}>
                    <TouchableOpacity onPress={() => this._addPhoto()}>
                        <Icon android="md-camera" ios="ios-camera" style={{fontSize: 50, color: '#2a2428'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._addRecord()}>
                        <Icon android="md-mic" ios="ios-mic" style={{fontSize: 50, color: '#2a2428'}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    icon_container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    container: {
        flex: 1,
        backgroundColor:"#e2e5ec"
    }
});

export default BirdList