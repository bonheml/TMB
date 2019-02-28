import React from "react"
import {
    FlatList,
    View,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {Icon} from "native-base";
import {connect} from "react-redux";
import BirdItem from "./BirdItem"
import {loadBirdsFromList} from "../API/WikiAPI";
import {predictBirds} from "../API/TmbAPI";
import moment from 'moment';


class BirdResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {birds: undefined, results: undefined, isLoading: false}
    }

    async componentDidMount() {
        await this.setState({isLoading: true});
        const media = this.props.navigation.state.params.mediaURI;
        const mediaType = this.props.navigation.state.params.mediaType;
        const oldResults = this.props.navigation.state.params.results;
        console.log(oldResults, media, mediaType);
        try {
            const {hasError, results, bird_list} = await predictBirds(media, mediaType, oldResults);
            if (hasError) {
                console.log(results);
            }
            else {
                loadBirdsFromList(bird_list).then((birds) => {
                    this.setState({birds, results, isLoading: false})
                }).catch((error) => {
                    console.log(error);
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    _displayBirdDetail = (bird_name) => {
        this.props.navigation.navigate("Detail", {bird_name: bird_name})
    };

    _displayLoading() {
        return (
            <View style={styles.loading_container}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    _addPhoto() {
        this.props.navigation.navigate("PhotoCapture");
    }

    _addRecord() {
        this.props.navigation.navigate("Record");
    }

    _addObservedBird = (bird) => {
         bird['view_date'] = moment().format('DD-MM-YYYY');
         const action = { type: "ADD_OBSERVATION", value: bird };
         this.props.dispatch(action);
         this.props.navigation.navigate("List");
    };

    render() {
        if (this.state.isLoading) {
            return (this._displayLoading())
        }
        const buttonAction = {function: this._addObservedBird,
                              title: "Ajouter aux oiseaux observés",
                              color: "#587175"};
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.birds}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <BirdItem bird={item}
                                                      displayBirdDetail={this._displayBirdDetail}
                                                      buttonAction={buttonAction}/>}
                />
                <View style={styles.icon_container}>
                    <TouchableOpacity onPress={() => this._addPhoto()}>
                        <Icon android="md-camera" ios="ios-camera"
                              style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._addRecord()}>
                        <Icon android="md-mic" ios="ios-mic"
                              style={styles.icon}/>
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
    container: {
        flex: 1,
        backgroundColor: "#e2e5ec"
    },
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
    icon: {
        fontSize: 50,
        color: "#2a2428",
    },
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

export default connect(mapStateToProps)(BirdResults);