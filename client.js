const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto",{});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;
const text = process.argv[2];
const client = new todoPackage.Todo("localhost:40000",grpc.credentials.createInsecure())

client.CreateTodo(
    {
        "id":-1,
        "text":text
    }, (err,response) => {
        console.log("Recieved from server"+ JSON.stringify(response))
    }
)
client.ReadTodo({},(err,response) => {
    console.log("Read the Todo items from server"+ JSON.stringify(response))
})

const call = client.ReadTodoSream()
call.on("data",item => {
    console.log("recieved item from server" +JSON.stringify(item))
})

call.on("end",e =>console.log("server done!"))