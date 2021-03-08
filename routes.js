const express = require('express')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const Database = require("@replit/database")

const router = express.Router()

//@POST REQUEST: CREATE SNIPPET
router.post('/snippets',async(req, res)=>{
  const {name,expires_in,snippet,password} = req.body
  const db = new Database()
  try{
    //encrypt the password
    const hashPass = await bcrypt.hash(password, 10)
    //increase the expiration time by 30 seconds
    const time=moment().add(Number(expires_in),'s').format('YYYY-MM-DDThh:mm:s')
    //get the request url 
    const url = req.protocol + "://" + req.get('host') + req.originalUrl+`/${name}`
  //save data to database
  const data =await db.set(`${name}`,{url:url,name:name,expires_at:time, snippet:snippet, password:hashPass})
  //return response with data
   return res.status(201).json({"url":url,"name":name,"expires_at":time,"snippet":snippet,"password":hashPass});
   
  }catch(e){
    //catch server errors
     return res.status(500).json({"error":e.message})
  }
})

//@GET REQUEST: RETRIEVE SNIPPET
router.get('/snippets/:name',async(req, res)=>{
  const {name} = req.params
  const db = new Database()
  try{
    //retrieve data with the name of the snippet on the request url
     const item = await db.get(`${name}`)
     if(item !=null){
       //extend expiration time by 30 seconds
       item.expires_at = moment(item.expires_at).add(30, 's').format('YYYY-MM-DDThh:mm:s')
       return res.status(200).json(item)
     }
     //return 404 if item is not found
     return res.status(404).json({'error':'Snippet not found'}) 
  }catch(e){
    //catch all server errors
   return res.status(500).json({'error':e.message})
  }
 
})

//@PUT REQUEST: UPDATE REQUEST
router.put('/snippets/:name', async(req, res)=>{
  const {name}= req.params
  const {password, snippet} = req.body
  const db = new Database()
  try{
    const item = await db.get(`${name}`)
    if(item !=null){
      //Check if password is valid
      const isValidPasswd = await bcrypt.compare(password, item.password)
      if(isValidPasswd){
        //update snippet
        item.snippet = snippet
        //extend time  by 30 seconds
        item.expires_at = moment(item.expires_at).add(30, 's').format('YYYY-MM-DDThh:mm:s')
        //return response with updated item
        return res.status(200).json(item);
      }
       return res.status(403).json({'error':'Invalid password'}) 
    }
     return res.status(404).json({'error':'Snippet not found'}) 
  }catch(e){
   return res.status(500).json({'error':e.message});
  }
})

module.exports = router
