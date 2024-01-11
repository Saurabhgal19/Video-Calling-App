import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider';
import { useNavigate } from 'react-router-dom';

export const Lobby = () => {

  const [email , setEmail] = useState("");
  const [room ,setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();
  
  //console.log(socket)

  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();
    socket.emit("room:join", {email , room});
  },
  [email,room, socket]);

  const handleJoinRoom = useCallback((data) => {
      const {email ,room} = data;

      //console.log("Email and Room", email , room);

      //navigate to Room Page 
      navigate(`/room/${room}`)
  },[])


  useEffect(()=>{
    //room:join=> Event
    socket.on('room:join', handleJoinRoom);
    return () => {
      socket.off('room:join', handleJoinRoom)
    }
  },[socket, handleJoinRoom]);

  return (
    <div className='flex flex-col justify-center items-center h-full '>
        <h1 className='text-[45px] text-richblack-100 font-bold capitalize m-4'>Enter the Lobby</h1>
        
        <div className='border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14'>

        <form onSubmit={handleSubmitForm} className='flex flex-col gap-4'
              style={{ width: '400px' }} >

          <label htmlFor="email" className='text-4xl leading-10 font-semibold text-richblack-5 pb-3'> Email ID </label>
          <input type='email' 
          id='email' 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          className='rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none' 
           />
          <br/>
          
          <label htmlFor='room' className='text-4xl leading-10 font-semibold text-richblack-5 '> Room Number</label>
          <input type='text' 
          id='room'
          value={room}
          onChange={e => setRoom(e.target.value)}
          className='rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none' 
          />

          <br/>
          <button className='bg-yellow-100 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 '>Join</button>
        </form>
        </div>
    </div>
  )
}
