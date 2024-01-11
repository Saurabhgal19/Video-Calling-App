const { Server } = require("socket.io");

const io = new Server(4000, {
    cors: true,
});

const emailToSocketIdMap = new Map();

//findout the email from SocketIDMap
const socketIdtoEmailMap = new Map();

io.on("connection", (socket) => {
    //Send message to the client
    console.log(`Socket Connected`, socket.id);
    socket.on("room:join", (data) => {

        const{email ,room}=data;
        emailToSocketIdMap.set(email, socket.id);
        socketIdtoEmailMap.set(socket.id , email);
        //Before joining the room --> exisiting user
        io.to(room).emit('user:joined', {email , id: socket.id});
        socket.join(room);
        io.to(socket.id).emit("room:join" , data);
    });

    socket.on("user:call" , ({ to , offer}) => {
        io.to(to).emit('incomming:call', {from: socket.id, offer });
    })

    socket.on("call:accepted", ({to ,ans}) => {
        console.log("call:accepted", ans);
        io.to(to).emit('call:accepted', {from: socket.id, ans });
    })
    socket.on("peer:nego:needed", ({to, offer}) => {
        console.log("peer:nego:needed", offer);
        io.to(to).emit('peer:nego:needed', {from: socket.id, offer });
    })

    socket.on("peer:nego:done", ({to ,ans}) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit('peer:nego:final', {from: socket.id, ans });
    })
})