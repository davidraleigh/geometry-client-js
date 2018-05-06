```bash
npm install -g grpc-tools
npm install nodeunit -g
npm install
```

followed instructions listed here:
https://github.com/grpc/grpc/blob/v1.6.x/examples/node/static_codegen/README.md
```bash
cd ./proto
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../static_codegen/ --grpc_out=../static_codegen/ --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` ./geometry_operators.proto
```

