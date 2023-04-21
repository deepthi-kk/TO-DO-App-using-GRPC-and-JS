const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto",{});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server()

server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(`Failed to start server: ${err}`);
  } else {
    console.log(`Server started on port ${port}`);
    server.start();
  }
});

server.addService(todoPackage.Todo.service,
  {
    "CreateTodo":CreateTodo,
    "ReadTodo":ReadTodo,
    "ReadTodoSream": ReadTodoSream
  });

const todos = [];

function CreateTodo(call,callback){
  const todoItem ={
    "id":todos.length +1,
    "text":call.request.text
  }
  todos.push(todoItem);
  callback(null, todoItem);
}

function ReadTodo(call,callback){
  callback(null,{"items":todos})
}

function ReadTodoSream(call, callback){
    todos.forEach(t => call.write(t));
    call.end();
}


