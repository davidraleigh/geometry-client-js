var testCase  = require('nodeunit').testCase;
var grpc = require('grpc');
var async = require('async');

var messages = require('../static_codegen/geometry_operators_pb');
var services = require('../static_codegen/geometry_operators_grpc_pb');

// var protoDescriptor = grpc.load(PROTO_PATH);
// The protoDescriptor object has the full package hierarchy
var client = new services.GeometryOperatorsClient('localhost:8980', grpc.credentials.createInsecure());


module.exports = testCase({
    // setUp: function (callback) {
    //     this.foo = 'bar';
    //     callback();
    // },
    // tearDown: function (callback) {
    //     // clean up
    //     callback();
    // },

    "Test Convex Hull Geometry From WKT": function(test) {
        var geometryBag = new messages.GeometryBagData();
        var polyline = "MULTILINESTRING ((0 0, -100 -55, -90 -63, 0 0, 1 1, 100 25, 170 45, 175 65))";
        geometryBag.addGeometryStrings(polyline);
        geometryBag.setGeometryEncodingType(messages.GeometryEncodingType.WKT);

        var requestOp = new messages.OperatorRequest();
        requestOp.setLeftGeometryBag(geometryBag);
        requestOp.setOperatorType(messages.ServiceOperatorType.CONVEXHULL);
        requestOp.setResultsEncodingType(messages.GeometryEncodingType.WKT);

        function requestCallback(error, operatorResult) {
            if (error) {
                console.log(error);
                test.ok(false);
                test.done();
                return;
            }

            var data = operatorResult.getGeometryBag().getGeometryStringsList()[0];

            // console.log('get wkt' + data);
            test.equal("MULTIPOLYGON (((-90 -63, 170 45, 175 65, 1 1, -100 -55, -90 -63)))", data);
            test.done();
        }

        client.executeOperation(requestOp, requestCallback);
    },

    "Test Project": function(test) {
        var inputSpatialReference = new messages.SpatialReferenceData();
        inputSpatialReference.setWkid(32632);

        var geometryBag = new messages.GeometryBagData();
        var polyline = "MULTILINESTRING ((500000 0, 400000 100000, 600000 -100000))";
        geometryBag.addGeometryStrings(polyline);
        geometryBag.setGeometryEncodingType(messages.GeometryEncodingType.WKT);
        geometryBag.setSpatialReference(inputSpatialReference);

        var outputSpatialReference = new messages.SpatialReferenceData();
        outputSpatialReference.setWkid(4326);

        var serviceProjectOp = new messages.OperatorRequest();
        serviceProjectOp.setLeftGeometryBag(geometryBag);
        serviceProjectOp.setOperatorType(messages.ServiceOperatorType.PROJECT);
        serviceProjectOp.setResultsEncodingType(messages.GeometryEncodingType.WKT);
        serviceProjectOp.setOperationSpatialReference(outputSpatialReference);

        function requestCallback(error, operatorResult) {
            if (error) {
                console.log(error);
                test.ok(false);
                test.done();
                return;
            }

            var data = operatorResult.getGeometryBag().getGeometryStringsList()[0];

            test.equal("MULTILINESTRING ((9 0, 8.101251062924646 0.904618578893133, 9.898748937075354 -0.904618578893133))", data);
            test.done();
        }

        client.executeOperation(serviceProjectOp, requestCallback);
    },

    "Test Crazy Nesting": function (test) {
        var polyline = "MULTILINESTRING ((-120 -45, -100 -55, -90 -63, 0 0, 1 1, 100 25, 170 45, 175 65))";

        var spatialReferenceWGS = new messages.SpatialReferenceData();
        spatialReferenceWGS.setWkid(4326);
        var spatialReferenceNAD = new messages.SpatialReferenceData();
        spatialReferenceNAD.setWkid(4269);
        var spatialReferenceMerc = new messages.SpatialReferenceData();
        spatialReferenceMerc.setWkid(3857);
        var spatialReferenceGall = new messages.SpatialReferenceData();
        spatialReferenceGall.setWkid(54016);

        var geometryBagLeft = new messages.GeometryBagData();
        geometryBagLeft.addGeometryStrings(polyline);
        geometryBagLeft.setGeometryEncodingType(messages.GeometryEncodingType.WKT);
        geometryBagLeft.setSpatialReference(spatialReferenceNAD);

        var geometryBagRight = new messages.GeometryBagData();
        geometryBagRight.addGeometryStrings(polyline);
        geometryBagRight.setGeometryEncodingType(messages.GeometryEncodingType.WKT);
        geometryBagRight.setSpatialReference(spatialReferenceNAD);

        var serviceOpLeft = new messages.OperatorRequest();
        serviceOpLeft.setLeftGeometryBag(geometryBagLeft);
        serviceOpLeft.setOperatorType(messages.ServiceOperatorType.BUFFER);
        serviceOpLeft.setBufferParams(new messages.BufferParams(distancesList = [.5]));

        var nestedLeft = new messages.OperatorRequest();

        var serviceOpRight = new messages.OperatorRequest();

        var nestedRight = new messages.OperatorRequest();


        test.done();
        /*

        OperatorRequest serviceOpLeft = OperatorRequest
                .newBuilder()
                .setLeftGeometryBag(geometryBagLeft)
                .setOperatorType(ServiceOperatorType.Buffer)
                .setBufferParams(OperatorRequest.BufferParams.newBuilder().addDistances(.5).build())

                .setResultSpatialReference(spatialReferenceWGS)
                .build();
        OperatorRequest nestedLeft = OperatorRequest
                .newBuilder()
                .setLeftNestedRequest(serviceOpLeft)
                .setOperatorType(ServiceOperatorType.ConvexHull)
                .setResultSpatialReference(spatialReferenceGall)
                .build();

        OperatorRequest serviceOpRight = OperatorRequest
                .newBuilder()
                .setLeftGeometryBag(geometryBagRight)
                .setOperatorType(ServiceOperatorType.GeodesicBuffer)
                .setBufferParams(OperatorRequest.BufferParams.newBuilder().addDistances(1000).setUnionResult(false).build())
                .setOperationSpatialReference(spatialReferenceWGS)
                .build();
        OperatorRequest nestedRight = OperatorRequest
                .newBuilder()
                .setLeftNestedRequest(serviceOpRight)
                .setOperatorType(ServiceOperatorType.ConvexHull)
                .setResultSpatialReference(spatialReferenceGall)
                .build();

        OperatorRequest operatorRequestContains = OperatorRequest
                .newBuilder()
                .setLeftNestedRequest(nestedLeft)
                .setRightNestedRequest(nestedRight)
                .setOperatorType(ServiceOperatorType.Contains)
                .setOperationSpatialReference(spatialReferenceMerc)
                .build();

        GeometryOperatorsGrpc.GeometryOperatorsBlockingStub stub = GeometryOperatorsGrpc.newBlockingStub(inProcessChannel);
        OperatorResult operatorResult = stub.executeOperation(operatorRequestContains);
        Map<Integer, Boolean> map = operatorResult.getRelateMapMap();

        assertTrue(map.get(0));
         */

    }


});
