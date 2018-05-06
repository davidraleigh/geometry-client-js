
var grpc = require('grpc');
var async = require('async');
var _ = require('lodash');

var messages = require('./static_codegen/geometry_operators_pb');
var services = require('./static_codegen/geometry_operators_grpc_pb');

// var protoDescriptor = grpc.load(PROTO_PATH);
// The protoDescriptor object has the full package hierarchy
var client = new services.GeometryOperatorsClient('localhost:8980', grpc.credentials.createInsecure());

var geometryBag = new messages.GeometryBagData();


/**
 * Run the getFeature demo. Calls getFeature with a point known to have a
 * feature and a point known not to have a feature.
 * @param {function} callback Called when this demo is complete
 */
function runGetFeature(callback) {
    var next = _.after(2, callback);
    function featureCallback(error, feature) {
        if (error) {
            callback(error);
            return;
        }
        if (feature.name === '') {
            console.log('Found no feature at ' +
                feature.location.latitude/COORD_FACTOR + ', ' +
                feature.location.longitude/COORD_FACTOR);
        } else {
            console.log('Found feature called "' + feature.name + '" at ' +
                feature.location.latitude/COORD_FACTOR + ', ' +
                feature.location.longitude/COORD_FACTOR);
        }
        next();
    }
    var point1 = {
        latitude: 409146138,
        longitude: -746188906
    };
    var point2 = {
        latitude: 0,
        longitude: 0
    };
    client.getFeature(point1, featureCallback);
    client.getFeature(point2, featureCallback);
}

/**
 * Run all of the demos in order
 */
function main() {
    async.series([]);
}

if (require.main === module) {
    main();
}