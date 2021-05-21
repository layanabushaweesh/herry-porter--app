'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended : true}))
// Specify a directory for static resources
app.use(express.static('public'))
// define our method-override reference
app.use(methodOverride('_method'))
// Set the view engine for server-side templating
app.set( 'view engine' , 'ejs')
// Use app cors
app.use(cors())
// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
// const client = mew pg.Client(process.env.DATABASE_URL)
// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/home' , renderHome)
app.post('/save' , saveData)
app.get('/character/my-fav-characters' , renderFav)

app.post('/character/:character_id' , shawDetalis)
app.put('/character/:character_id' , updateCh)
app.delete('/character/:character_id' , deletCh)

app.post('/character/create' , createCh)
app.get('/character/create' , renderCreate)
app.get('/character/my-fav-characters' , renderCreated)
// callback functions

// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function renderHome(req,res) {
    const url='http://hp-api.herokuapp.com/api/characters'
    superagent.get(url).then((dataFromApi =>{
        // console.log(dataFromApi.body)
        const apiData =dataFromApi.body.map(data =>{
            return new Charachter(data)
        })
        res.render( 'index' , { allData : apiData})
    })).catch(error =>{console.log(error)})
    
}

function saveData(req,res) {
    const {name,house,patronus,alive} = req.body
    const sql =' INSERT INTO users (name,house,patronus,alive,created_by) VALUES ($1,$2,$3,$4,$5)'
    const value =[name,house,patronus,alive,'api']
    client.query(sql,value).then(()=>{
        res.redirect('/character/my-fav-characters')
    }).catch(error =>{console.log(error)})
}

function renderFav(req,res) {
  const sql ='SELECT * FROM users WHERE created_by=$1'  
  const value=['api']
  client.query(sql,value).then((dataFromDb =>{
      res.render('fav' , { fav : dataFromDb.rows})
  })).catch(error =>{console.log(error)})
}
function shawDetalis(req,res) {
    const id =req.params.character_id
    const sql ='SELECT * FROM users WHERE id=$1'
    const value= [id]
    client.query(sql,value).then((dataFromDb)=>{
        res.render('detalis' , {detalis : dataFromDb.rows})
    }).catch(error =>{console.log(error)})
    
}
function updateCh(req,res) {
    const id =req.params.character_id
    const {name,house,patronus,staus} = req.body
    const sql =' UPDATE users SET name=$1 , house=$2 , patronus=$3 , alive=$4 WHERE id=$5' 
    const value =[name,house,patronus,staus,id]
    client.query(sql,value).then(()=>{
        res.redirect('/character/my-fav-characters')
    }).catch(error =>{console.log(error)})
    
}
function deletCh(req,res) {
    const id = req.params.character_id
    const sql ='DELETE FROM users WHERE id=$1'
    const value =[id]
    client.query(sql,value).then(()=>{
        res.redirect('/character/my-fav-characters')
    }).catch(error =>{console.log(error)})
    
}

function createCh(req,res) {
    const {name,house,patronus,staus} = req.body
    const sql ='INSERT INTO users (name,house,patronus,alive,created_by) VALUES ($1,$2,$3,$4,$5)'
    const value=[name,house,patronus,staus,'user']
    client.query(sql,value).then(()=>{
        res.redirect('/character/my-characters')
    }).catch(error =>{console.log(error)})
    
}
function renderCreate(req,res) {
    res.render('create')
    
}
function renderCreated(req,res) {
    const sql = 'SELECT * FROM users WHERE created_by = $1' 
    const value =['user']
    client.query(sql,value).then((dataFromDb)=>{
        res.render('fav' , { fav : dataFromDb.rows})
    }).catch(error =>{console.log(error)})
    
}
// helper functions
function Charachter(data) {
   this.name=data.name
   this.house=data.house
   this.patronus=data.patronus
   this.alive=data.alive
}
// app start point
// client.connect().then(() =>
//     app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
// );

client.connect().then(()=>{
    app.listen( PORT , () =>(console.log(`listen ${PORT}`)))
})