import React from 'react'
import {View, Image, StyleSheet, TouchableHighlight} from 'react-native'
import {Icon} from 'native-base'

class PhotoEdit extends React.Component {
    _sendRecord() {
        const photo = this.props.navigation.state.params.photo;
        this.props.navigation.navigate('Results',
            { mediaURI: photo.uri.toString(),
              mediaType: 'image',
             results: this.props.navigation.state.params.results
            });
    }

    render() {
        const photo = this.props.navigation.state.params.photo;
        return (
            <View style={styles.container}>
            <View style={styles.image_container}>
                <Image style={styles.container}
                       source={{uri: photo.uri.toString()}}/>
            </View>
            <View style={styles.button_container}>
                <View style={styles.button_wrapper}>
                    <TouchableHighlight style={styles.button} onPress={() => this.props.navigation.goBack()}>
                        <Icon name={'md-trash'}
                              style={{color: "#522", fontSize: 40}}/>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.button} onPress={() => {this._sendRecord()}}>
                        <Icon name={"md-checkmark"}
                              style={{color: "#241", fontSize: 40}}/>
                    </TouchableHighlight>
                </View>
            </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button_container: {
        flex: 1,
        backgroundColor:"#587175",
    },
    button: {
        height: 60,
        width: 60,
        borderRadius: 40,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    button_wrapper: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingTop:15
    },
    image_container: {
        flex: 6,
        alignItems: 'stretch'
    }
});

export default PhotoEdit;