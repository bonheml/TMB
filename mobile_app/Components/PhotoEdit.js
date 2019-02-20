import React from 'react'
import {View, Image, StyleSheet} from 'react-native'

class PhotoEdit extends React.Component {
    render() {
        const photo = this.props.navigation.state.params.photo;
        return (
            <View style={styles.image_container}>
                <Image style={styles.container}
                       source={{uri: photo.uri.toString()}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    icon: {
        fontSize: 70,
        color: '#DADEDF'
    },
    button: {
        backgroundColor: 'transparent',
        padding: 5,
        marginHorizontal: 20
    },
    button_container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    image_container: {
        flex: 1,
        alignItems: 'stretch'
    }
});

export default PhotoEdit;