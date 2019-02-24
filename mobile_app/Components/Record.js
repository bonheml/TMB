import React from 'react';
import {View, StyleSheet, TouchableHighlight, Text, ActivityIndicator} from 'react-native';
import {Audio, Permissions} from 'expo';
import moment from 'moment';
import {Icon} from 'native-base';

class Record extends React.Component {
    constructor(props) {
        super(props);
        this.recordURI = undefined;
        this.state = {
            hasRecordPermission: false,
            recorderInstance: undefined,
            isLoading: false,
            durationMillis: 0,
        };

    }

    _recorderCallback({ durationMillis, isRecording, isDoneRecording }) {
        state = this.state;
        state.durationMillis = durationMillis;
        this.setState(state);
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

    async _stopRecord() {
        try {
                console.log("Stop recording");
                await this.state.recorderInstance.stopAndUnloadAsync();
                await this.setState({
                    recorderInstance : undefined,
                    hasRecordPermission: this.state.hasRecordPermission,
                    isLoading: false,
                });
                this.props.navigation.navigate('RecordEdit',
                    {recordURI: this.recordURI});
            } catch(error) {
                console.log(error);
            }
    }

    async _startRecord() {
        try {
                console.log("start recording");
                const recorderInstance = new Audio.Recording();
                recorderInstance.setOnRecordingStatusUpdate(this._recorderCallback.bind(this));
                recorderInstance.setProgressUpdateInterval(100);
                await recorderInstance.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY);
                this.recordURI = recorderInstance.getURI();
                await recorderInstance.startAsync();
                console.log(recorderInstance.isRecording);
                this.setState({
                    hasRecordPermission: this.state.hasRecordPermission,
                    recorderInstance: recorderInstance,
                    isLoading: false,
                });
            } catch(error) {
                console.log(error);
            }
    }

    async _toggleRecord() {
        console.log("toggle record");
        if (this.state.recorderInstance === undefined) {
            state = this.state;
            state.isLoading = true;
            await this.setState(state);
            await this._startRecord();
        }
        else {
            const recorderState = await this.state.recorderInstance.getStatusAsync();
            console.log(recorderState);
            state = this.state;
            state.isLoading = true;
            await this.setState(state);
            await this._stopRecord();
        }
    }

    _getToggleColor() {
        return (this.state.recorderInstance ? "#8b575b" : "#587175");
    }

    _displayLoading() {
        return (
            <View style={styles.loading_container}>
                <ActivityIndicator size='large' />
            </View>
        )
    }

    render() {
        if (!this.state.hasRecordPermission) {
            return (
                <View style={styles.container}>
                    {this._displayUnauthorised()}
                </View>
            )
        }
        if (this.state.isLoading) {
            return (
                this._displayLoading()
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.timer_container}>
                    <View style={styles.timer_wrapper}>
                        <Text style={styles.timer}>{moment.utc(this.state.durationMillis).format("mm:ss.SS")}</Text>
                    </View>
                </View>
                <View style={[styles.button_container, {backgroundColor: this._getToggleColor()}]}>
                    <View style={styles.button_wrapper}>
                        <TouchableHighlight style={styles.button} onPress={() => {this._toggleRecord()}}>
                            <Icon name={'md-square'}
                                  style={{color: this._getToggleColor(), fontSize: 50}}/>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e2e5ec"
    },
    timer_wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    timer: {
        fontSize: 60,
        fontWeight: "100",
    },
    timer_container: {
        flex: 5,
    },
    button_container: {
        flex: 1,
    },
    button: {
        height: 80,
        width: 80,
        borderRadius: 40,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    button_wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Record;