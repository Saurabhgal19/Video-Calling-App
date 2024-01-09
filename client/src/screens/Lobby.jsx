import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider';

export const Lobby = () => {

  const [email , setEmail] = useState("");
  const [room ,setRoom] = useState("");

  const socket = useSocket();
  
  //console.log(socket)

  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();
    socket.emit("room:join", {email , room});
  },
  [email,room, socket]);

  const handleJoinRoom = useCallback((data) => {
      const {email ,room} = data
  },[])


  useEffect(()=>{
    //room:join=> Event
    socket.on('room:join', data => {
      console.log(`Data from Backend ${data}`);
    });
  },[socket, handleJoinRoom]);

  return (
    <div>
        <h1>Lobby</h1>
        <form onSubmit={handleSubmitForm}>

          <label htmlFor="email"> Email ID</label>
          <input type='email' 
          id='email' 
          value={email} 
          onChange={e => setEmail(e.target.value)}
           />
          <br/>
          
          <label htmlFor='room'> Room Number</label>
          <input type='text' 
          id='room'
          value={room}
          onChange={e => setRoom(e.target.value)} 
          />

          <br/>
          <button>Join</button>
        </form>
    </div>
  )
}
