import React from "react";
import {FlatList, View, TouchableOpacity, StyleSheet} from "react-native";
import {Icon} from "native-base";
import BirdItem from "./BirdItem";
import {connect} from "react-redux";

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

    _removeObservedBird = (bird) => {
         const action = { type: "REMOVE_OBSERVATION", value: bird };
         this.props.dispatch(action);
    };

    render() {
        const buttonAction = {function: this._removeObservedBird,
                              title: "Supprimer des oiseaux observés",
                              color: "#587175"};
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.props.observedBirds}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <BirdItem bird={item}
                                                      displayBirdDetail={this._displayBirdDetail}
                                                      buttonAction={buttonAction}/>}
                />
                <View style={styles.icon_container}>
                    <TouchableOpacity onPress={() => this._addPhoto()}>
                        <Icon android="md-camera" ios="ios-camera"
                              style={{fontSize: 50, color: "#2a2428"}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._addRecord()}>
                        <Icon android="md-mic" ios="ios-mic"
                              style={{fontSize: 50, color: "#2a2428"}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    observedBirds: state.observedBirds
  }
};

const styles = StyleSheet.create({
    icon_container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "rgba(0, 0, 0, 0)"
    },
    container: {
        flex: 1,
        backgroundColor: "#e2e5ec"
    }
});

export default connect(mapStateToProps)(BirdList)
