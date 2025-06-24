import { createContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {connect, io} from "socket.io-client";
import { set } from "date-fns";


const backendUrl=import.meta.env.VITE_BACKEND_URL ;
axios.defaults.baseURL=backendUrl;
export const AuthContext=createContext();
export const AuthProvider=({children})=>{
    const [token,setToken]=useState(localStorage.getItem('token') || null);
    const [authUser,setAuthUser]=useState(null);
    const [onlineUsers,setOnlineUsers]=useState([]);
    const [socket,setSocket]=useState(null);

    //check if user is authenticated
    const checkAuth=async()=>{
        try{
            await axios.get("api/auth/check");
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    //login function
    const login=async(state,credentials)=>{
        try{
            const {data}=await axios.post(`/api/auth/${state}`,credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
                setToken(data.token);
                localStorage.setItem("token",data.token);
                toast.success(data.message);
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            }
            else{
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    //logout function
    const logout=async()=>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        delete axios.defaults.headers.common["Authorization"];
        toast.success("Logged out successfully");
        socket.disconnect();
    }

    //update profile function to handle profile updates
    const updateProfile=async(body)=>{
        try{
            const {data}=await axios.put("/api/auth/update-profile",body);
            if(data.success){
                setAuthUser(data.user);
                toast.success(data.message);
            }
            else{
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    //connect socket function
    const connectSocket=(userData)=>{
        if(!userData||socket?.connected) return;
        const newSocket=io(backendUrl,{
            query:{
                userId:userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);
        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })
    }
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        }
        checkAuth();
    },[token])
    const value={
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}