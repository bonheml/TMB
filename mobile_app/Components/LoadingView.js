import React from 'react'
import {View, ActivityIndicator, StyleSheet} from 'react-native'

class LoadingView extends React.Component {
    render() {
        return (
            <View style={styles.loading_container}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loading_container: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e2e5ec"
    }
});

export default LoadingView;