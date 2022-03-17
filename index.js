const express =require('express')
const { MongoClient } = require('mongodb');
const objectId=require('mongodb').ObjectId;
require('dotenv').config()
const cors=require('cors')
const app=express();
const fileUpload=require('express-fileupload')
const port=process.env.PORT||5000;


app.use(cors())
app.use(express.json())
app.use(fileUpload())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rh3cx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/',(req,res)=>{

    res.send('get the response')
})
async function run(){
    try{
    await client.connect();
    const database=client.db("Op22");
    const  imagesCollection=database.collection('images');
   
  
    
    app.post('/images',async(req,res)=>{
       
   
  
      const image=req.files.image
      const imageData=image.data
      const encodedPic=imageData.toString('base64')
      const imgBuffer=Buffer.from(encodedPic,'base64')
      
      const services ={
       
        image:imgBuffer
      
      }
        
      const result= await imagesCollection.insertOne(services)
      console.log(result)
      res.json(result)
       // res.send('post hitted')
    })
    
    app.get('/images',async(req,res)=>{
      const cursor=imagesCollection.find({})
      const images= await cursor.toArray();
      res.send(images)
  })


  app.get('/images/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:objectId(id)}
    const images=await imagesCollection.findOne(query)
    res.json(images)
  })


    }
    finally{
       // await client.close();
    }
    }
    
    run().catch(console.dir);
    app.listen(port,()=>{
        console.log('listen to the port',port)
    })