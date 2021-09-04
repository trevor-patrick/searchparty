import firebaseApp from '../firebase.js';
import React, { Fragment } from 'react';
import { StyleSheet, Animated, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';

var database = firebaseApp.database();

export default class ExistingPartyScreen extends React.Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
            invalidUsername: "",
            username: "",
            invalidPartyName: "",
            partyName: "",
            wrongCreds: ""
        }
    }


    render() {
        return (
            <View style={styles.container}>

                <Text style={styles.welcome}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder=" Enter party name"
                    onChangeText={(partyName) => this.setState({ partyName })}>
                </TextInput>

                <TextInput
                    style={styles.input}
                    placeholder=" Enter Username"
                    onChangeText={(username) => this.setState({ username })}>
                </TextInput>

                <TouchableOpacity style={styles.button} onPress={this.onPressVerify}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <Text>{this.state.invalidPartyName}</Text>
                <Text>{this.state.invalidUsername}</Text>
                <Text>{this.state.wrongCreds}</Text>

            </View>
        );
    }

    // onPress of 'Login' button
    onPressVerify = async () => {

        if (this.state.partyName == "") {
            console.log("Error: Please enter your party name")
            this.setState({ invalidPartyName: "*Please enter your party name" });
            this.render()
        }
        else {
            this.setState({ invalidPartyName: "" });
            this.render()
        }

        if (this.state.username == "") {
            console.log("Error: Please enter your username")
            this.setState({ invalidUsername: "*Please enter your username" });
            this.render()
        }
        else {
            this.setState({ invalidUsername: "" });
            this.render()
        }

        if (this.state.partyName != "" && this.state.username != "") {
            console.log("Talking to db...");

            // verify that 'member/username/partyName' reference exists in database
            console.log('member/' + this.state.username);
            const ref = firebaseApp.database().ref('member/' + this.state.username);
            const snapshot = await ref.once('value')
                .then(function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.exists()) {
                        if (snapshot.val()['PID'] == this.state.partyName) {
                            console.log("Creds found");
                            this.setState({ wrongCreds: "" });

                            // navigate to map screen
                            this.props.navigation.navigate('MapScreen', { partyName: this.state.partyName, username: this.state.username});
                        }
                        else {
                            console.log("Creds not found");
                            this.setState({ wrongCreds: "*Incorrecct party name or username" });
                        }
                    }
                    else {
                        console.log("Creds not found");
                        this.setState({ wrongCreds: "*Incorrecct party name or username" });
                    }

                }.bind(this));
        }
    }
}


const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject

    },
    container: {
        flex: 1,
        backgroundColor: '#47CAFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcome: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
        color: 'white'
    },
    input: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 10,
        borderRadius: 200,
        overflow: 'hidden',
    },
    button: {
        backgroundColor: "#FFD700",
        padding: 4,
        marginBottom: 10,
        width: "90%",
        borderRadius: 200,
        overflow: 'hidden',
        // height: "5%"
    },
    buttonText: {
        fontSize: 18,
        textAlign: "center"
    }
});