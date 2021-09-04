// import * as firebase from 'firebase';
// var firebase = require('firebase');
const haversine = require('haversine')

export default function reduceGeoPoints(line) {
    var newPoints = []
    newPoints[0] = line[0];

    // compare adjacent points
    for (let i = 1; i < line.length; i++) {

        // play around with distance number
        var distance = haversine(newPoints[newPoints.length - 1], line[i], { unit: 'meter' })
        
        // play around with threshold number
        if (distance > 5) {
            // remove point at index i
            newPoints.push(line[i]);
        }
    }

    return newPoints;
}
