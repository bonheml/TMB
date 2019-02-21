import React from 'react'
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native'
import {Icon} from 'native-base'

class PhotoEdit extends React.Component {
    render() {
        const photo = this.props.navigation.state.params.photo;
        return (
            <View style={styles.image_container}>
                <Image style={styles.container}
                       source={{uri: photo.uri.toString()}}/>
                <View style={styles.icon_container}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon android="md-trash"
                              ios="ios-trash"
                              style={{fontSize: 50, color: '#522'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon android="md-checkmark-circle-outline"
                              ios="ios-checkmark-circle-outline"
                              style={{fontSize: 50, color: '#241'}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    icon_container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(185, 197, 213, 0.4)'
    },
    image_container: {
        flex: 1,
        alignItems: 'stretch'
    }
});

export default PhotoEdit;