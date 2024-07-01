"use client"
import { useEffect, useState } from "react";

export default function Home() {

  const [patient,setPatient]=useState([]);
  console.log(patient)
    useEffect(()=>{
      const getPatient=async()=>{
        try{
          const res=await fetch(`/api/patient`,{
              method:"GET",
              headers:{
                "Content-Type":"application/json",
              },
            });
            const x=await res.json();
          setPatient(x);
        }
        catch(err)
        {
          console.log(err)
        }
      }
      getPatient();
    },[]);

    const handleSubmit=async(e)=>{
      e.preventDefault();
      const name=e.target[0].value;
      const dob=e.target[1].value;
      const gender=e.target[2].value;
      const contact=e.target[3].value;
      setPatient((prev)=>([...prev,{
            name,dob,gender,contact}]))
            e.target[0].value="";
            e.target[1].value="";
            e.target[2].value="";
            e.target[3].value="";
            try{
                await fetch(`/api/patient`,{
                  method:"POST",
                  body:JSON.stringify({
                  name,
                  dob,
                  gender,
                  contact
            }),
          }); 
      }
      catch(err){
        console.log(err)
      }
    }

  return (
    <div className="flex flex-col justify-center px-5">
      <h1 className="text-center py-5 text-lg md:text-2xl font-semibold">Patients&apos; Data</h1>
      <div className="border-[1px] border-gray-500 text-[8px] md:text-base">
        <div className="grid grid-cols-5 justify-center">
          <div className="border-[1px] border-gray-500 p-1">Index</div>
          <div className="border-[1px] border-gray-500 p-1">Name</div>
          <div className="border-[1px] border-gray-500 p-1">DOB</div>
          <div className="border-[1px] border-gray-500 p-1">Gender</div>
          <div className="border-[1px] border-gray-500 p-1">Contact</div>
        </div>
        {patient?.map((pt,index)=>(
          <div key={pt._id} className="grid grid-cols-5">
          <div className="border-[1px] border-gray-500 p-1">{index+1}</div>
          <div className="border-[1px] border-gray-500 p-1">{pt.name}</div>
          <div className="border-[1px] border-gray-500 p-1">{pt.dob}</div>
          <div className="border-[1px] border-gray-500 p-1">{pt.gender}</div>
          <div className="border-[1px] border-gray-500 p-1">{pt.contact}</div>
        </div>))}
        <form onSubmit={handleSubmit} className="relative grid grid-cols-5">
          <div className="border-[1px] border-gray-500 p-1">{patient.length+1}</div>
          <input className="bg-transparent outline-none border-[1px] border-gray-500 p-1" placeholder="Name"></input>
          <input className="bg-transparent outline-none border-[1px] border-gray-500 p-1" placeholder="DOB"></input>
          <input className="bg-transparent outline-none border-[1px] border-gray-500 p-1" placeholder="Gender"></input>
          <input className="bg-transparent outline-none border-[1px] border-gray-500 p-1" placeholder="Contact"></input>
          <button className="absolute -bottom-6 md:-bottom-10 right-0 bg-slate-600 p-1 px-2 rounded-md" >Submit</button>
        </form>
      </div>
    </div>
  );
}
// yVHerJm9InQBNXMh