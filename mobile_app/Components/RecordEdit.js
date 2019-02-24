import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Audio, Permissions} from 'expo'

class RecordEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasRecordPermission: false,
        }
    }

    async componentDidMount() {
        const {status} = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        this.setState({hasRecordPermission: status === 'granted'});
    }

    _displayUnauthorised() {
        if (!this.state.hasRecordPermission) {
            return (
                <View style={styles.container}>
                    <Text>Vous devez autoriser l'enregistrement pour afficher cette page</Text>
                </View>
            )

        }
    }

    _displayRecorder() {
        if (this.state.hasRecordPermission) {
            return (<View/>)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this._displayUnauthorised()}
                {this._displayRecorder()}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    timer_wrapper: {
        backgroundColor: "#fff",
        fontSize: 60,
        fontWeight: "100",
        alignSelf: 'center'
    },
    timer_container: {
        flex: 2,
    },
    button_container: {
        flex: 1,
        backgroundColor: "#e2e5ec",
        alignSelf: 'center'
    }
});

export default RecordEdit;