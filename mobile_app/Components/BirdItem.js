import React from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native'

// Component/BirdItem.js

class BirdItem extends React.Component {
    render() {
        const {bird, displayBirdDetail} = this.props;
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
                        <Text style={styles.title_text}>{bird.common_name}</Text>
                    </View>
                    <View style={styles.description_container}>
                        <Text style={styles.description_text}
                              numberOfLines={5}>{bird.overview}</Text>
                    </View>
                    {bird.viewDate && (
                        <View style={styles.date_container}>
                            <Text style={styles.date_text}>Observé le {bird.view_date}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        height: 190,
        flexDirection: 'row'
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