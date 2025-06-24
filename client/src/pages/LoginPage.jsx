import React, { useContext } from 'react'
import assets from '../assets/assets'
import { useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [currState, setCurrState] = useState("sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const {login}=useContext(AuthContext);

  const onSubmitHandler=(event)=>{
    event.preventDefault();
    if(currState=="sign up" && !isDataSubmitted){
      setIsDataSubmitted(true);
      return;
    }

    login(currState==="sign up"?'signup':'login',{fullName, email, password, bio})

  }
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
    <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]"/>
    <form onSubmit={onSubmitHandler} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
    <h2 className="font-medium text-2xl flex justify-between items-center">
      {currState}
      {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className="w-5 cursor-pointer"/>}
      
    </h2>
    {currState === "sign up" && !isDataSubmitted && (<input type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)} className="p-2 border border-gray-500 rounded-md focus:outline-none" placeholder="Full Name" required/>)}
    
    {!isDataSubmitted && (
      <input type="email" className="p-2 border border-gray-500 rounded-md focus:outline-none" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
    )}
    
    {!isDataSubmitted && (
      <input type="password" className="p-2 border border-gray-500 rounded-md focus:outline-none" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
    )}

    {
      currState==="sign up" && isDataSubmitted && (
        <textarea rows={4} value={bio} onChange={(e)=>setBio(e.target.value)} className="p-2 border border-gray-500 rounded-md focus:outline-none" placeholder="Provide a short bio" required></textarea>
      )
    }

    <button type="submit" className="py-3 bg-gradient-to-r from purple-400 to violet-600 text-white rounded-md cursor-pointer">
      {currState==="sign up"?"Create Account":"Login now"}
    </button>
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <input type="checkbox" name="" id="" />
      <p>Agree to the terms of use.</p>
    </div>

    <div className="flex flex-col gap-2">
      {currState==="sign up"?(
        <p className="text-sm text-gray-600">Already have an account?<span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} className="font-medium text-violet-500 cursor-pointer">Login here</span></p>
      ):(
        <p className="text-sm text-gray-600">Create an account <span onClick={()=>{setCurrState("sign up")}} className="font-medium text-violet-500 cursor-pointer">Click here</span></p>
      )}
    </div>
    </form>
    </div>
  )
}

export default LoginPage