import React from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
    ActivityIndicator
} from 'react-native';
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

    _recorderCallback({durationMillis, isRecording, isDoneRecording}) {
        state = this.state;
        state.durationMillis = durationMillis;
        this.setState(state);
    }

    async componentDidMount() {
        await this.setState({isLoading: true});
        const {status} = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        this.setState({
            hasRecordPermission: status === 'granted',
            isLoading: false
        });
    }

    async _stopRecord() {
        try {
            await this.state.recorderInstance.stopAndUnloadAsync();
            await this.setState({
                recorderInstance: undefined,
                isLoading: false,
                durationMillis: 0,
            });
            this.props.navigation.navigate('RecordEdit',
                {recordURI: this.recordURI,});
        } catch (error) {
            console.log(error);
        }
    }

    async _startRecord() {
        try {
            const recorderInstance = new Audio.Recording();
            recorderInstance.setOnRecordingStatusUpdate(this._recorderCallback.bind(this));
            recorderInstance.setProgressUpdateInterval(200);
            await recorderInstance.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY);
            this.recordURI = recorderInstance.getURI();
            await recorderInstance.startAsync();
            this.setState({
                recorderInstance: recorderInstance,
                isLoading: false,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async _toggleRecord() {
        await this.setState({isLoading: true});
        if (this.state.recorderInstance === undefined) {
            await this._startRecord();
        }
        else {
            await this._stopRecord();
        }
    }

    _getToggleColor() {
        return (this.state.recorderInstance ? "#8b575b" : "#587175");
    }

    _displayLoading() {
        return (
            <View style={styles.loading_container}>
                <ActivityIndicator size='large'/>
            </View>
        )
    }

    _displayUnauthorised() {
        return (
            <View style={styles.container}>
                <Text>Vous devez autoriser l'enregistrement pour afficher
                    cette page</Text>
            </View>
        )
    }

    _displayRecord() {
        return (
            <View style={styles.container}>
                <View style={styles.timer_container}>
                    <View style={styles.timer_wrapper}>
                        <Text style={styles.timer}>
                            {moment.utc(this.state.durationMillis).format("mm:ss.SS")}
                        </Text>
                    </View>
                </View>
                <View
                    style={[styles.button_container,
                        {backgroundColor: this._getToggleColor()}]}>
                    <View style={styles.button_wrapper}>
                        <TouchableHighlight style={styles.button}
                                            onPress={() => {
                                                this._toggleRecord()
                                            }}>
                            <Icon name={'md-square'}
                                  style={{
                                      color: this._getToggleColor(),
                                      fontSize: 50
                                  }}/>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        if (this.state.isLoading) {
            return (this._displayLoading());
        } else if (!this.state.hasRecordPermission) {
            return (this._displayUnauthorised());
        } else {
            return (this._displayRecord());
        }
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