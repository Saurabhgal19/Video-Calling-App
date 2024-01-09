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
    socket.on("room:join", data => {
        const{email ,room}=data
        emailToSocketIdMap.set(email, socket.id)
        socketIdtoEmailMap.set(socket.id , email);

        io.to(socket.id).emit("room:join" , data)
    })
})