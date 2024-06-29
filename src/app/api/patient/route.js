import Patient from "../../../../models/Patient";
import connect from "../../../../utils/db";
import { NextResponse } from "next/server";

export const POST =async(request)=>{
    const {name,dob,gender,contact}=await request.json();
    await connect();
    const newPatient=new Patient({
        name,
        dob,
        gender,
        contact
    })

    try{
       await newPatient.save();
       return new NextResponse("Patient has been created",{
        status:201. 
       })
    }catch(err){
        return new NextResponse(err.message,{
            status:500,
        })
    }
}

export const GET = async (request) => {
    await connect();
    
    try {
        const patients = await Patient.find({});
        return new NextResponse(JSON.stringify(patients), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        return new NextResponse(err.message, {
            status: 500,
        });
    }
};