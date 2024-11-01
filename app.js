const express=require("express");
const socket=require("socket.io")
const http=require("http");
const {Chess}=require("chess.js");
const app=express();
const server=http.createServer(app);
const io=socket(server);
const path=require("path")

const chess=new Chess();
let players={};
let currentPlayer='W';

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.render("index",{title:"Chess Game"});
})

io.on("connection",function(uniquesocket){
     console.log("User Connected");
})

server.listen(8000,()=>{
    console.log("Listening on port 8000");
});