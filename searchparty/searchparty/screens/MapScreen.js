import firebaseApp from '../firebase.js';
import React, { Fragment } from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, Animated, Text, View, TextInput, TouchableOpacity, Image, StatusBar } from 'react-native';
import MapView, { Marker, Heatmap, Polyline, AnimatedRegion } from 'react-native-maps';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import newId from '../utils/newid';
import AppIntroSlider from 'react-native-app-intro-slider';
import reduceGeoPoints from '../utils/reduceGeoPoints';

import { Button } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import Tutorial from '../components/Tutorial'

var database = firebaseApp.database();
const { height, width } = Dimensions.get('window');
const LATITUDE_DELTA = 0.28;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);



export default class MapScreen extends React.Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
            show_Main_App: false,

            //defaults to SF
            currentLocation: {
                latitudeDelta: 0.04,
                longitudeDelta: 0.05,
                latitude: 37.78825,
                longitude: -122.4324
            },
            coordinate: new MapView.AnimatedRegion({
                latitude: 27.983730,
                longitude: -81.952161,
                latitudeDelta: 0.04,
                longitudeDelta: 0.05
            }),
            markers: [],
            sessionMarkers: [],
            sessionLines: [],
            // partyName: props.navigation.state.params['partyName'],
            // username: props.navigation.state.params['username'],
            username: 'tpatr77',
            partyName: '12345',
            ready: true,
            startStopSearching: 'Start Searching',
            startStopSearchingIcon: 'md-search',
            mapType: 'satellite'


        }

        // call saveCoordinates to test function
        // this.saveCoordinates("username", "12345", -82.410005, 28.063291 );

        // var lineCoordinates =
        //     [
        //         {
        //             "date": 1586292321380,
        //             "latitude": 27.983529273112982,
        //             "longitude": -81.95241679957044,
        //         },
        //         {
        //             "date": 1586292323381,
        //             "latitude": 27.983525136002118,
        //             "longitude": -81.95242860052792,
        //         }
        //     ]



        // this.saveCoordinates("tpatr77", "12345", lineCoordinates);
        // this.renderMarkersFromDB(this.state.partyName);
        // console.log(this.state.markers);
        // console.log("before:");
        // var x = this.state.markers[0];
        // console.log(x);
        // console.log("after:");
    }


    // this._map.animateToCoordinate(r, 1);
    // this.mapView.root.animateToRegion(r, 2000);


    async componentDidMount() {
        // const { coordinate } = this.state.currentLocation;
        let first = true;
        this.watchID = navigator.geolocation.watchPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const newCoordinate = {
                    latitude,
                    longitude,
                };
                let tempLocation = {
                    // latitudeDelta: 0.04,
                    // longitudeDelta: 0.05,
                    latitude: parseFloat(position.coords.latitude),
                    longitude: parseFloat(position.coords.longitude)
                };

                // console.log(tempLocation.latitude);
                this.state.coordinate.timing(tempLocation, 1000).start();
                this.setState({
                    currentLocation: tempLocation
                });
                // this.currentLocation = tempLocation;
                // console.log("got net location");
                // animate to currentLocation as soon as location is found for first time
                if (first) {
                    this.animateToCurrLocation();
                    first = false;
                }

            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

        // load markers pertaining to partyName
        // var markersObject = await this.getMarkersFromDB(this.state.partyName);
        // this.setState({ markers: markersObject });

        this.renderMarkersFromDB(this.state.partyName);
        this.timer = setInterval(() => this.renderMarkersFromDB(this.state.partyName), 1000 * 30); // update markers every 30 secs
        // console.log(this.state.markers);
    }

    render() {

        // if (this.state.show_Main_App) {

        // console.log("TEST.......");

        var tempCoordinate = this.state.coordinate;
        // tempCoordinate['latitude'] = tempCoordinate['latitude'] + 0.00001;
        // this.setState({coordinate: tempCoordinate});
        return (
            // <View style={styles.container}>
            <Fragment>
                <MapView style={styles.map}
                    initialRegion={this.state["currentLocation"]}
                    ref={map => this.map = map}
                    mapType={this.state.mapType}
                >

                    {/* <Marker>
                        <Image source={require('../images/glow_green.png')} style={{
                            height: 45, width: 45, borderRadius: 200,
                            overflow: 'hidden',
                            // tintColor: '#FAED27' //yellow
                            // tintColor: '#FF8D75' //red
                        }} />
                    </Marker> */}
                    {/* ))} */}

                    <MapView.Marker.Animated
                        coordinate={this.state.coordinate}
                        ref={marker => { this.marker = marker; }}
                    >
                        <Image source={require('../images/curr_location.png')} style={{ height: 20, width: 20 }} />
                    </MapView.Marker.Animated>


                    {this.state.markers.map(x => (
                        // console.log(x); 
                        <View key={newId()}>

                            <Polyline key={newId()} coordinates={x} strokeWidth={5} strokeColor={this.determineColor(x[0].date)} />

                        </View>
                    ))}


                    {
                        this.state.sessionLines.map(x => (
                            <Polyline key={newId()} coordinates={x} strokeWidth={5} strokeColor="#39FF14" />
                        ))
                    }

                    <Polyline key={newId()} coordinates={this.state.sessionMarkers} strokeWidth={5} strokeColor="#39FF14" />

                </MapView>

                <ActionButton buttonColor="rgba(231,76,60,1)">
                    <ActionButton.Item buttonColor='#9b59b6' title={this.state.startStopSearching} onPress={() => this.startStopSearching()}>
                        <Icon name={this.state.startStopSearchingIcon} style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Current Location" onPress={() => this.animateToCurrLocation()}>
                        <Icon name="md-locate" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#fbbc05' title="Map type" onPress={() => this.switchMapType()}>
                        <Icon name="md-map" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='red' title="Help" onPress={() => this.handleOpen()}>
                        <Icon name="md-help" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#1abc9c' title="Log Out" onPress={() => this.logout()}>
                        <Icon name="md-log-out" style={styles.actionButtonIcon} />
                    </ActionButton.Item>

                </ActionButton>

                {/* <Button title="Show" onPress={this.handleOpen} style={{top: 100}}/> */}
                {/* <SCLAlert
                        theme="info"
                        show={this.state.show}
                        title="How to use:"
                        subtitle="Tap the 'Start Searching' button to begin recording your search. When you finish, tap the 'Stop Searching' button."
                        subtitleContainerStyle={{ height: 100 }}
                        subtitleStyle={{ flex: 1, flexWrap: 'wrap' }}
                        onRequestClose={() => { }}
                    >

                        {/* <Text>Text</Text> */}
                {/* <SCLAlertButton theme="info" onPress={this.handleClose}>Done</SCLAlertButton> */}
                {/* </SCLAlert> */}

            </Fragment >
        );
        // }
        // else{
        //     return <Tutorial></Tutorial>
        // }
    }

    handleOpen = () => {
        this.setState({ show: true })
    }

    handleClose = () => {
        this.setState({ show: false })
    }


    recordLocation = () => {
        // console.log("recordLocation...");

        // save currentlocation into local variable
        var currLoc = this.state.currentLocation;
        // console.log(this.state.currentLocation);

        // push current location onto NEW 'searching session' of this.state.markers
        var updated = this.state['markers'].concat(currLoc);
        this.setState({ markers: updated });

        // console.log(this.state['markers']);

        // save current location into database
        this.saveCoordinates(this.state.username, this.state.partyName, currLoc['longitude'], currLoc['latitude']);


    }

    saveCoordinates = async (username, PID, lineCoordinates) => {
        lineCoordinates = reduceGeoPoints(lineCoordinates);

        var key1 = database.ref('search/' + PID + '/' + username).push().key;
        // console.log("Line coordinates: " + lineCoordinates);
        for (const coord of lineCoordinates) {
            database.ref('search/' + PID + '/' + username + '/' + key1).push(coord);
        }
    }

    logout = () => {
        this.props.navigation.navigate('LoginScreen');
    }

    switchMapType = () => {
        this.setState({ mapType: this.state.mapType === 'satellite' ? 'standard' : 'satellite' });
    }

    renderMarkersFromDB(partyName) {
        var markersList;
        var ref = database.ref('/search/' + partyName);
        ref.once("value").then((data) => {
            markersList = data.toJSON();
            var polylines = [];

            for (const user of Object.keys(markersList)) {
                for (const search of Object.keys(markersList[user])) {
                    let temp = []

                    for (const point of Object.keys(markersList[user][search])) {
                        temp.push(markersList[user][search][point]);
                    }
                    polylines.push(temp);
                }
            }
            this.setState({ markers: polylines });
            // console.log("this.state.markers..............");
            // console.log(this.state.markers);
            // console.log("=========");
            // console.log(this.state.markers);
        });
    }

    startStopSearching = () => {

        if (this.state.startStopSearching == "Start Searching") {
            this.setState({ startStopSearching: "Stop Searching", startStopSearchingIcon: 'md-pause' })

            var thisPolyline = [];
            // empty this.state.sessionMarkers
            this.setState({ sessionMarkers: [] });

            // console.log("loop");

            var loop = setInterval(() => {
                if (this.state.startStopSearching == "Start Searching") {
                    clearInterval(loop);
                }

                var currentLocation = JSON.parse(JSON.stringify(this.state.currentLocation));
                delete currentLocation.longitudeDelta;
                delete currentLocation.latitudeDelta;
                currentLocation['date'] = Date.now();
                var joined = this.state.sessionMarkers.concat(currentLocation);
                this.setState({ sessionMarkers: joined });
                // console.log(this.state.sessionMarkers);

            }, 3000);
        }
        else {
            this.setState({ startStopSearching: "Start Searching", startStopSearchingIcon: 'md-search' })
            var sessionLines = this.state.sessionLines.concat([this.state.sessionMarkers]);
            this.setState({ sessionLines: sessionLines });

            // save this.state.sessionMarkers to database
            this.saveCoordinates(this.state.username, this.state.partyName, this.state.sessionMarkers);
        }

    }

    animateToCurrLocation() {
        this.map.animateToRegion(
            this.state.currentLocation, 500);
    }

    determineColor(polyLineTimestamp) {
        var diff = (Date.now() - polyLineTimestamp) / 1000;

        // return red if diff is more than a week
        if (diff >= 604800)
            return '#ff073a';

        // return yellow if diff is between a day and week
        else if (diff > 86400 && diff < 604800)
            return '#ffff00';

        // return green if diff is 1 day or less
        else if (diff <= 86400)
            return '#39FF14';

        else
            return '#39FF14'
    }
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        // backgroundColor: "#FFD700",
        // borderRadius: 50,
        // overflow: 'hidden',
        width: '100%',
        height: 40,
        padding: 1,
        margin: 5,
        bottom: 10,
        right: 5
    },
    buttonContainer: {
        flex: 1,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    MainContainer: {
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    title: {
        fontSize: 26,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    text: {
        color: '#fff',
        fontSize: 20,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain'
    }
});
