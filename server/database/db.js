import mongoose from 'mongoose';

const Connection = async (URL)=>{
    
  try{
   await mongoose.connect(URL);//,{useNewUrlParser:true}
    console.log('Database is connected successfully');
  }
  catch(error){
    console.log('Connection not successful ' , error);
  }
}

export default Connection;