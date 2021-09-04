import firebaseApp from '../firebase.js';
import React, { Fragment } from 'react';
import { StyleSheet, Animated, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';

var database = firebaseApp.database();

export default class CreatePartyScreen extends React.Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
            invalidUsername: "",
            username: "",
            invalidPartyName: "",
            partyName: ""
        }
    }


    render() {
        return (
            <View style={styles.container}>

                <Text style={styles.welcome}>Welcome to Search Party</Text>

                <TextInput
                    style={styles.input}
                    placeholder=" Create Party Name"
                    onChangeText={(partyName) => this.setState({ partyName })}>
                </TextInput>

                <TextInput
                    style={styles.input}
                    placeholder=" Create Username"
                    onChangeText={(username) => this.setState({ username })}>
                </TextInput>

                <TouchableOpacity style={styles.button} onPress={this.onPressCreate}>
                    <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>

                <Text>{this.state.invalidPartyName}</Text>
                <Text>{this.state.invalidUsername}</Text>

            </View>
        );
    }

    createPartyInDB = async (PID) => {
        data = {}
        var timestamp = new Date();
        var date = new Date(timestamp)
        database.ref('party/' + PID + '/').set({ startDate: Date.now() });
    }

    partyExists = async (partyName) => {
        // check if party exists w same partyName
        var found = false;
        const ref = firebaseApp.database().ref('party/' + partyName);
        const snapshot = await ref.once('value')
            .then(function (snapshot) {
                if (snapshot.exists()) {
                    found = true;
                    this.setState({ invalidInvite: "" });
                }
                else {
                    this.setState({ invalidInvite: "Party not found" });
                }

            }.bind(this));

        this.render();
        // console.log(found);
        return found;
    }

    // onPress of 'Create Party' button
    onPressCreate = async () => {
        let partyNameReady = false;
        let usernameReady = false;

        if (this.state.partyName == "") {
            console.log("Error: Please create a party name")
            this.setState({ invalidPartyName: "Please create a party name" });
            this.render()
        }
        else if (!(/^[a-z0-9]+$/i.test(this.state.partyName))) {
            console.log("Error: Party name must be alphanumeric")
            this.setState({ invalidPartyName: "Party name must be alphanumeric" });
            this.render()
        }
        else if (await this.partyExists(this.state.partyName)) {
            this.setState({ invalidPartyName: "Party name taken" });
            this.render()
        }
        else {
            this.setState({ invalidPartyName: "" });
            partyNameReady = true;
            this.render()
        }

        if (this.state.username == "") {
            console.log("Error: Please create a username")
            this.setState({ invalidUsername: "Please create a username" });
            this.render()
        }
        else if (!(/^[a-z0-9]+$/i.test(this.state.username))) {
            console.log("Error: Username must be alphanumeric")
            this.setState({ invalidUsername: "Username must be alphanumeric" });
            this.render()
        }
        else {
            this.setState({ invalidUsername: "" });
            usernameReady = true;
            this.render()
        }

        // if invite code and username are valid and party does not exist in db
        if (usernameReady && partyNameReady && !await this.partyExists(this.state.partyName)) {
            console.log("partyNameReady, usernameReady, and party does not exist");

            // create party in DB
            this.createPartyInDB(this.state.partyName);

            // save username to db
            let entry = {};
            let data = { "PID": this.state.partyName };
            entry[this.state.username] = data;
            // console.log(entry);
            database.ref('member/' + this.state.username).set(data);
            // navigate to map screen
            // this.props.navigation.navigate('MapScreen');
            this.props.navigation.navigate('MapScreen', { partyName: this.state.partyName, username: this.state.username});

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