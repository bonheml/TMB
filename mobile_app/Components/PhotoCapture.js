import React from 'react'
import {StyleSheet, View, Platform, TouchableOpacity} from 'react-native'
import {Camera, Permissions} from 'expo'
import {Icon} from 'native-base'

class PhotoCapture extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: false,
            type: Camera.Constants.Type.back,
            flashMode: Camera.Constants.FlashMode.off,
            autoFocus: Camera.Constants.AutoFocus.on,
            zoom: 0,
            whiteBalance: Camera.Constants.WhiteBalance.auto,
            focusDepth: 0,
            ratio: '16:9',
        }
    }

    _displayUnauthorised() {
        if (this.state.hasCameraPermission !== true) {
            return <View style={styles.container}/>
        }
    }

    _displayCamera() {
        const {
            hasCameraPermission,
            type,
            flashMode,
            zoom,
            whiteBalance,
            focusDepth
        } = this.state;

        return (
            <View style={styles.container}>
                <Camera style={styles.container}
                        ref={ref => (this._cameraInstance = ref)}
                        type={type}
                        flashMode={flashMode}
                        zoom={zoom}
                        whiteBalance={whiteBalance}
                        focusDepth={focusDepth}
                />
                <View style={styles.button_container}>
                    <TouchableOpacity onPress={this._takePictureButtonPressed}
                                      style={styles.button}
                    >
                        <Icon name="camera" style={styles.icon}/>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }


    render() {
        return (
            <View style={styles.container}>
                {this._displayUnauthorised()}
                {this._displayCamera()}
            </View>
        )
    }

    async componentDidMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});

        if (Platform.OS === 'android') {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            this.setState({hasCameraPermission: status === 'granted'});
        }
    }

    _takePictureButtonPressed = async () => {
        if (this._cameraInstance) {
            const photo = await this._cameraInstance.takePictureAsync();
            this.props.navigation.navigate("PhotoEdit", {photo: photo});
        }
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
    }
});

export default PhotoCapture;
