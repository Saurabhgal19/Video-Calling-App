import React, { useCallback, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { useSocket } from '../context/SocketProvider'
import peer from '../service/peer';

export const Room = () => {

    const socket = useSocket();
    const [remoteSocketId , setRemoteSocketId]= useState(null);
    const [myStream, setMyStream] =useState();
    const [remoteStream ,setRemoteStream] =useState();

    const handleUserJoined = useCallback(({email, id})=>{
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id);
    },[])

    const handleCallUser = useCallback (async () => {

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true, 
            video: true});

            const offer = await peer.getOffer();
            socket.emit("user:call", {to : remoteSocketId, offer });

            setMyStream(stream);
    },[remoteSocketId, socket]);



    const handleIncommingcall = useCallback(async ({from, offer}) => {
            setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true, 
            video: true});
            setMyStream(stream);
        console.log(`Incoming Call`, from , offer);
        const ans = await peer.getAnswer(offer);
        socket.emit('call:accepted' , {to: from, ans});
    },[socket]);

    // const sendStream = useCallback (() => {
    //     for(const track of myStream.getTracks()) {
    //         peer.peer.addTrack(track, myStream)
    //     }
    // },[myStream]);
    const sendStream = useCallback(() => {
        if (myStream) {
            myStream.getTracks().forEach((track) => {
                // Check if the track is not already added
                if (!peer.peer.getSenders().some((sender) => sender.track === track)) {
                    peer.peer.addTrack(track, myStream);
                }
            });
        }
    }, [myStream, peer.peer]);
    

    const handleCallAccepted = useCallback(({from ,ans}) => {
        peer.setLocalDescription(ans);
        console.log("Call Accepted");
        sendStream() ;

    },[sendStream]);

    const handleNegoNeeded = useCallback(( async () => {
        const offer = await peer.getOffer();
        socket.emit('peer:nego:needed', {offer , to: remoteSocketId });
    }),[remoteSocketId, socket])

    const handleNegoIncoming = useCallback( async({from , offer})=>{
        const ans = await peer.getAnswer(offer);
        socket.emit('peer:nego:done', { to: from, ans});
    },[socket]);

    const handleNegoNeedFinal = useCallback( async({ ans }) => {
           await peer.setLocalDescription(ans);

    },[])

    useEffect(()=> {
        peer.peer.addEventListener("negotiationneeded",handleNegoNeeded);

        //De-Register
        return () => {
            peer.peer.removeEventListener("negotiationneeded",handleNegoNeeded);
        };
    },[handleNegoNeeded])

    useEffect(()=> {
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream  = ev.streams;
            console.log('Got Tracks!!')
            setRemoteStream(remoteStream[0]);
        });
    }, [])



    useEffect(()=> {
        socket.on('user:joined', handleUserJoined);
        socket.on('incomming:call', handleIncommingcall );
        socket.on('call:accepted',handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoIncoming);
        socket.on("peer:nego:final", handleNegoNeedFinal);
        

        return () => {
            socket.off('user:joined', handleUserJoined);
            socket.off('incomming:call', handleIncommingcall);
            socket.off('call:accepted',handleCallAccepted);
            socket.off("peer:nego:needed", handleNegoIncoming);
            socket.on("peer:nego:final", handleNegoNeedFinal);
        }
    },[
     socket,
     handleUserJoined,
     handleIncommingcall, 
     handleCallAccepted,
     handleNegoIncoming, 
     handleNegoNeedFinal]);

    
   

  return (
    <div className='flex flex-col items-center h-full w-auto'>
        <h1 className='text-white text-[35px] flex  font-bold justify-center   w-full p-2'>{`Our Room`}</h1>
        <h4 className={`text-white-100 text-[20px] flex justify-center font-bold w-full ${remoteSocketId ? 'bg-caribbeangreen-700' : 'bg-pink-500 w-full justify-center items-center'}`}>
        {remoteSocketId ? "Connected" : "No one in room"}
        
        </h4>
       

        <div className='flex gap-3 m-4'>
        {
            myStream && <button onClick={sendStream}
            className='bg-yellow-100 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 mt-2'> 
            Send Stream
            </button>
        }
        {/* Calling Button */}
        {
            remoteSocketId && <button onClick={handleCallUser}
            className='bg-pink-900  text-white cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold mt-2'>Call</button>
        }
        </div>

        {/* Streaming */}
        
        {
            myStream && (
                <>
                <h1 className='text-[25px] font-inter font-bold'>My Stream</h1>
                <ReactPlayer
                    width={"300px"} 
                    height={"400px"}
                    playing
                    muted 
                    url={myStream}
                    
                     />
                     
                    </>
            )
        }
        {
            remoteStream && (
                <>
                <h1 className='text-[25px] font-inter font-bold'>Remote Stream</h1>
                <ReactPlayer
                    width={"300px"} 
                    height={"400px"}
                    playing
                    muted 
                    url={remoteStream} />
                    </>
            )
        }
            </div>
  )
}
