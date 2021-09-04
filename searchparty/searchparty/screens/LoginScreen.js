import firebaseApp from '../firebase.js';
import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

var database = firebaseApp.database();

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            partyName: "", username: "", num: 0,
            invalidPartyName: "", invalidUsername: "", usernameExists: ""
        }
    }

    render() {
        return (
            <View style={styles.container}>

                <Text style={styles.welcome}>Welcome to Search Party</Text>
                <TextInput
                    style={styles.input}
                    placeholder=" Enter Party Name"
                    onChangeText={(partyName) => this.setState({ partyName })}>
                </TextInput>

                <TextInput
                    style={styles.input}
                    placeholder=" Create Username"
                    onChangeText={(username) => this.setState({ username })}>
                </TextInput>


                <TouchableOpacity style={styles.button} onPress={this.onPressJoin}>
                    <Text style={styles.buttonText}>Join Party</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.onPressCreate}>
                    <Text style={styles.buttonText}>Create Party</Text>
                </TouchableOpacity>

                <Text style={{ color: 'white' }}>
                    <Text onPress={() => this.existingLogin()} >Already in a party?</Text>
                    <Text onPress={() => this.existingLogin()} style={{ fontWeight: "bold" }}> Login</Text>
                </Text>

                <View>
                    <Text>{this.state.invalidPartyName}</Text>
                    <Text>{this.state.invalidUsername}</Text>
                    <Text>{this.state.usernameExists}</Text>
                </View>
            </View>
        );
    }

    existingLogin = () => {
        this.props.navigation.navigate('ExistingLoginScreen');
    }

    // onPress of 'Create Party' button
    onPressCreate = () => {
        this.props.navigation.navigate('CreatePartyScreen');
    }

    // onPress of 'Join' button
    onPressJoin = async () => {
        let inviteReady = false;
        let usernameReady = false;
        if (this.state.partyName == "") {
            console.log("Error: Please enter party name")
            this.setState({ invalidPartyName: "*Please enter party name" });
            this.render()
        }
        else if (!(/^[a-z0-9]+$/i.test(this.state.partyName))) {
            console.log("Error: Party name must be numeric")
            this.setState({ invalidPartyName: "*Party name must be alphanumeric" });
            this.render()
        }
        else {
            this.setState({ invalidPartyName: "" });
            inviteReady = true;
            this.render()
        }

        if (this.state.username == "") {
            console.log("Error: Please create a username")
            this.setState({ invalidUsername: "*Please create a username" });
            this.render()
        }
        else if (!(/^[a-z0-9]+$/i.test(this.state.username))) {
            console.log("Error: Username must be alphanumeric")
            this.setState({ invalidUsername: "*Username must be alphanumeric" });
            this.render()
        }
        else {
            this.setState({ invalidUsername: "" });
            usernameReady = true;
            this.render()
        }

        // if invite code and username are valid and party exists in db
        if (inviteReady && usernameReady) {
            if (await this.partyExists(this.state.partyName)) {
                console.log("inviteReady, usernameReady, and party exists");
                // if username exists in party already
                if (await this.usernameExistsInParty(this.state.partyName, this.state.username)) {
                    console.log("username already exists in this party.");
                }
                else {
                    // save username to db
                    let entry = {};
                    let data = { "PID": this.state.partyName };
                    entry[this.state.username] = data;
                    // console.log(entry);
                    database.ref('member/' + this.state.username).set(data);
                    // navigate to map screen
                    this.props.navigation.navigate('MapScreen', { partyName: this.state.partyName , username: this.state.username});
                }
            }
        }
    }

    partyExists = async (partyName) => {
        // check if party exists w same invite code 
        // and if user already exists w same username in party
        var found = false;
        const ref = firebaseApp.database().ref('party/' + partyName);
        const snapshot = await ref.once('value')
            .then(function (snapshot) {
                if (snapshot.exists()) {
                    // console.log(partyName + " found");
                    found = true;
                    this.setState({ invalidPartyName: "" });
                }
                else {
                    // console.log(partyName + " not found");
                    this.setState({ invalidPartyName: "*Party not found" });
                }

            }.bind(this));

        this.render();
        // console.log(found);
        return found;
    }


    usernameExistsInParty = async (partyName, username) => {
        // check if username already exists in party 
        var found = false;
        const ref = firebaseApp.database().ref('member/' + username + '/PID');
        const snapshot = await ref.once('value')
            .then(function (snapshot) {
                if (snapshot.val() == partyName) {
                    // console.log(partyName + " found");
                    found = true;
                    this.setState({ usernameExists: "*Username taken. Choose another username." });
                }
                else {
                    // console.log(partyName + " not found");
                    this.setState({ usernameExists: "" });
                }

            }.bind(this));

        this.render();
        console.log("exists already: " + found);
        return found;
    }
}

const styles = StyleSheet.create({
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