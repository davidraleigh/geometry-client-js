// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
//
// Copyright 2017 Echo Park Labs
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// For additional information, contact:
//
// email: info@echoparklabs.io
//
'use strict';
var grpc = require('grpc');
var geometry_operators_pb = require('./geometry_operators_pb.js');

function serialize_geometry_OperatorRequest(arg) {
  if (!(arg instanceof geometry_operators_pb.OperatorRequest)) {
    throw new Error('Expected argument of type geometry.OperatorRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_geometry_OperatorRequest(buffer_arg) {
  return geometry_operators_pb.OperatorRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_geometry_OperatorResult(arg) {
  if (!(arg instanceof geometry_operators_pb.OperatorResult)) {
    throw new Error('Expected argument of type geometry.OperatorResult');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_geometry_OperatorResult(buffer_arg) {
  return geometry_operators_pb.OperatorResult.deserializeBinary(new Uint8Array(buffer_arg));
}


//
// gRPC Interfaces for working with geometry operators
var GeometryOperatorsService = exports.GeometryOperatorsService = {
  // Execute a single geometry operation
  executeOperation: {
    path: '/geometry.GeometryOperators/ExecuteOperation',
    requestStream: false,
    responseStream: false,
    requestType: geometry_operators_pb.OperatorRequest,
    responseType: geometry_operators_pb.OperatorResult,
    requestSerialize: serialize_geometry_OperatorRequest,
    requestDeserialize: deserialize_geometry_OperatorRequest,
    responseSerialize: serialize_geometry_OperatorResult,
    responseDeserialize: deserialize_geometry_OperatorResult,
  },
  streamOperations: {
    path: '/geometry.GeometryOperators/StreamOperations',
    requestStream: true,
    responseStream: true,
    requestType: geometry_operators_pb.OperatorRequest,
    responseType: geometry_operators_pb.OperatorResult,
    requestSerialize: serialize_geometry_OperatorRequest,
    requestDeserialize: deserialize_geometry_OperatorRequest,
    responseSerialize: serialize_geometry_OperatorResult,
    responseDeserialize: deserialize_geometry_OperatorResult,
  },
  streamOperationsEx: {
    path: '/geometry.GeometryOperators/StreamOperationsEx',
    requestStream: true,
    responseStream: true,
    requestType: geometry_operators_pb.OperatorRequest,
    responseType: geometry_operators_pb.OperatorResult,
    requestSerialize: serialize_geometry_OperatorRequest,
    requestDeserialize: deserialize_geometry_OperatorRequest,
    responseSerialize: serialize_geometry_OperatorResult,
    responseDeserialize: deserialize_geometry_OperatorResult,
  },
};

exports.GeometryOperatorsClient = grpc.makeGenericClientConstructor(GeometryOperatorsService);
