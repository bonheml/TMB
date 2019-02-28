import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Button
} from 'react-native'

class BirdItem extends React.Component {
    _display_view_date() {
        const bird = this.props.bird;
        if (bird.view_date) {
            return (
                <View style={styles.date_container}>
                    <Text style={styles.date_text}>
                        Observé le {bird.view_date}
                    </Text>
                </View>
            )
        }
    }

    _display_button() {
        return (
            <View style={styles.button_wrapper}>
                <Button
                    onPress={() => this.props.buttonAction.function(this.props.bird)}
                    title={this.props.buttonAction.title}
                    color={this.props.buttonAction.color}
                    style={styles.button}
                />
            </View>
        )
    }

    _display_bird_card() {
        const bird = this.props.bird;
        const displayBirdDetail = this.props.displayBirdDetail;
        const bird_name = bird.scientific_name.replace(" ", "_");
        return (
            <TouchableOpacity style={styles.main_container}
                              onPress={() => displayBirdDetail(bird_name)}>
                <Image
                    style={styles.image}
                    source={{uri: bird.image_path.toString()}}
                />
                <View style={styles.content_container}>
                    <View style={styles.header_container}>
                        <Text
                            style={styles.title_text}>{bird.common_name}</Text>
                    </View>
                    <View style={styles.description_container}>
                        <Text style={styles.description_text}
                              numberOfLines={5}>{bird.overview}</Text>
                    </View>
                    {this._display_view_date(bird)}
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        if (this.props.buttonAction) {
            return (
                <View style={styles.container}>
                    <View styles={styles.bird_container}>
                        {this._display_bird_card()}
                    </View>
                    <View styles={styles.button_container}>
                        {this._display_button()}
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    {this._display_bird_card()}
                </View>
            )
        }

    }
}

const styles = StyleSheet.create({
    main_container: {
        height: 190,
        flexDirection: 'row'
    },
    container: {
        flex: 1,
    },
    bird_container: {
        flex: 5,
    },
    button_container: {
        flex: 1,
    },
    button_wrapper: {
        marginLeft: 5,
        marginRight: 5,
        marginBottom:10,
    },
    image: {
        width: 120,
        height: 180,
        margin: 5,
        backgroundColor: 'grey'
    },
    content_container: {
        flex: 1,
        margin: 5
    },
    header_container: {
        flex: 3,
        flexDirection: 'row'
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 20,
        flex: 1,
        flexWrap: 'wrap',
        paddingRight: 5
    },
    description_container: {
        flex: 7,
        textAlign: 'justify'
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666'
    },
    date_container: {
        flex: 1
    },
    date_text: {
        textAlign: 'right',
        fontSize: 14
    }
});

export default BirdItem