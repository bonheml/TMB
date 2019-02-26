import React from 'react'
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

class RecordEdit extends React.Component {
    constructor(props) {
        super(props);
        this.recordURI = "";
        this.state = {
            hasRecordPermission: false,
            playerInstance: undefined,
            isLoading: false,
            playerStatus: undefined,
            positionMillis: 0
        };
    }

    _playerCallback = playbackStatus => {
        this.setState({positionMillis: playbackStatus.positionMillis,
                    playerStatus: playbackStatus,
                    isLoading: false})
    };

    async componentDidMount() {
        const {status} = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        this.recordURI = this.props.navigation.state.params.recordURI.toString();
        const playerInstance = new Audio.Sound();
        await playerInstance.loadAsync({uri: this.recordURI});
        playerInstance.setOnPlaybackStatusUpdate(this._playerCallback.bind(this));
        playerInstance.setProgressUpdateIntervalAsync(200);
        const playerStatus = await playerInstance.getStatusAsync();
        await this.setState({hasRecordPermission: status === 'granted',
            playerInstance: playerInstance, playerStatus: playerStatus});
    }

    _displayUnauthorised() {
        if (!this.state.hasRecordPermission) {
            return (
                <View style={styles.container}>
                    <Text>Vous devez autoriser l'enregistrement pour afficher
                        cette page</Text>
                </View>
            )
        }
    }

    async _stopPlayer() {
        try {
            await this.state.playerInstance.stopAsync();
        } catch (error) {
            console.log(error);
        }
    }

    async componentWillUnmount() {
        this.state.playerInstance.setOnPlaybackStatusUpdate(null);
        await this.state.playerInstance.unloadAsync();
    }

    async _startPlayer() {
        try {
            if (this.state.positionMillis !== 0) {
                await this.state.playerInstance.setPositionAsync(0);
            }
            await this.state.playerInstance.playAsync();
        } catch (error) {
            console.log(error);
        }
    }

    async _togglePlay() {
        if (!this.state.playerStatus.isPlaying && !this.state.playerStatus.isBuffering) {
            await this._startPlayer();
        }
        else {
            await this._stopPlayer();
        }
    }

    _getToggleColor() {
        return (this.state.playerStatus && this.state.playerStatus.isPlaying
            ? "#8b575b" : "#587175");
    }

    _getToggleIcon() {
        return (this.state.playerStatus && this.state.playerStatus.isPlaying
            ? "md-square" : "md-play")
    }

    _displayLoading() {
        return (
            <View style={styles.loading_container}>
                <ActivityIndicator size='large'/>
            </View>
        )
    }

    _sendRecord() {
        this._stopPlayer();
        console.log(this.recordURI, this.props.navigation.state.params.results);
        this.props.navigation.navigate('Results',
            {
                mediaURI: this.recordURI,
                mediaType: 'audio',
                results: this.props.navigation.state.params.results
            });
    }

    _cancel() {
        this._stopPlayer();
        this.props.navigation.goBack();
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
                        <Text
                            style={styles.timer}>{moment.utc(this.state.positionMillis).format("mm:ss.SS")}</Text>
                    </View>
                </View>
                <View
                    style={[styles.button_container, {backgroundColor: this._getToggleColor()}]}>
                    <View style={styles.button_wrapper}>
                        <TouchableHighlight style={styles.button}
                                            onPress={() => this._cancel()}>
                            <Icon name={'md-trash'}
                                  style={{color: "#522", fontSize: 50}}/>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.button}
                                            onPress={() => {
                                                this._togglePlay()
                                            }}>
                            <Icon name={this._getToggleIcon()}
                                  style={{
                                      color: this._getToggleColor(),
                                      fontSize: 50
                                  }}/>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.button}
                                            onPress={() => {
                                                this._sendRecord()
                                            }}>
                            <Icon name={'md-checkmark'}
                                  style={{color: "#241", fontSize: 50}}/>
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
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingTop: 15
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

export default RecordEdit;