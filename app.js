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
let currentPlayer='w';

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.render("index",{title:"Chess Game"});
})

io.on("connection",function(uniquesocket){
     console.log("User Connected");
     
     if(!players.white){
        players.white=uniquesocket.id;
        uniquesocket.emit("playerRole",'w');
     }
     else if(!players.black){
          players.black=uniquesocket.id;
          uniquesocket.emit("playerRole",'b');
     }
     else{
        uniquesocket.emit("spectatorRole")
     }

     uniquesocket.on("disconnect",function(){
         if(uniquesocket.id===players.white){
            delete players.white;
         }
         else if(uniquesocket.id===players.black){
            delete players.black;
         }
     });
    uniquesocket.on("move",(move)=>{
        try{
            if(chess.turn()==='w' && uniquesocket.id!==players.white){
                return;
            }
            if(chess.turn()==='b' && uniquesocket.id!==players.black){
                return;
            }

            const result=chess.move(move);
            if(result){
                currentPlayer=chess.turn();
                io.emit("move",move);
                io.on("boardState",chess.fen())
            }
            else{
                console.log("Something Went Wrong");
                uniquesocket.emit(`Invalid move ${move}`);
            }
        }
        catch(e){
             console.log(e);
             uniquesocket.emit("Invalid Move",move);
        }
    })
}) 

server.listen(8000,()=>{
    console.log("Listening on port 8000");
});