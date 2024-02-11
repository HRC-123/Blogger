import express from 'express';
import Connection from './database/db.js';
import dotenv from 'dotenv';
import Router from './routes/route.js'
import cors from 'cors';
import bodyParser  from 'body-parser';
import path from 'path';
const app = express();


const __dirname = path.resolve();
app.use(cors({
    origin:[""],
  methods:["POST","GET"],
  credentials:true
}));
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use('/',Router);



// app.use(express.static(path.join("__dirname","./client/build")));

// app.get('*',function(_,res){
//     res.sendFile(path.join(__dirname,"./client/build/index.html"),function(err){
//         res.status(500).send(err);
//     })
// })


dotenv.config();
const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>console.log(`Server Started on port ${PORT}`));

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const URL = process.env.MONGODB_URI || `mongodb+srv://${username}:${password}@blog.mdfccbh.mongodb.net/?retryWrites=true&w=majority`;

Connection(URL);
