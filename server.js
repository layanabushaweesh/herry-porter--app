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
app.set('view engine' , 'ejs')
// Use app cors
app.use(cors())

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/home' , renderHome)
app.post('/favorite-character', saveCharacter)
app.get('/character/my-fav-characters',renderFav)

app.post('/character/:character_id' , showDetalis)
app.put('/character/:character_id', updateQ)
app.delete('/character/:character_id', deleteQ)
// creating routs
// app.post('/character/create', createCharacter)
// app.get('/character/my-characters', showCreate)
// app.get('/character/create' , renderCreate)
// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function renderHome(req,res) {
    const url='http://hp-api.herokuapp.com/api/characters'
    superagent.get(url).then((dataFromApi)=>{
        // console.log(dataFromApi.body)
        const apiData = dataFromApi.body.map(data =>{
            return new Character(data)
        })
        res.render('index' , {characters : apiData})
    }).catch(error =>(console.log(error)))
    
}

function saveCharacter(req,res) {
const {name,house,patronus,alive,image,yearOfBirth} = req.body
const sql ='INSERT INTO  characters (name,house,patronus,is_alive,image,yearOfBirth,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7)'
  const value =[name,house,patronus,alive,image,yearOfBirth,'api']  
  client.query(sql,value).then(()=>{
      res.redirect('/character/my-fav-characters')
  }).catch(error =>{console.log(error)})
}
function renderFav(req,res) {

    const sql ='SELECT * FROM characters WHERE created_by=$1'
    const value=['api']
    client.query(sql,value).then((dataFromDB =>{
        res.render('fav',{ fav : dataFromDB.rows})
    })).catch(error =>{console.log(error)})
    
}
function showDetalis(req,res) {
    const id=req.params.character_id
    const sql ='SELECT * FROM characters WHERE id=$1;'
    const value =[id]
    
    client.query(sql,value).then((dataFromDB) =>{
        res.render('detalis' , { datalis : dataFromDB.rows})
    }).catch(error =>(console.log(error)))
}

function updateQ(req,res) {
    const id =req.params.character_id
    const{name,house,patronus,status,yearOfBirth} =req.body   
    const sql ='UPDATE characters SET name=$1 house=$2 patronus=$3 is_alive=$4 yearOfBirth=$5 WHERE id=$6;'
    const value=[name,house,patronus,status,yearOfBirth,id]
    client.query(sql,value).then(()=>{
        res.redirect(`/character/${id}`)
    }).catch(error =>{console.log(error)})
}
function deleteQ(req,res) {
    const id =req.params.character_id
    const sql ='DELETE FROM characters WHERE id=$1'
    const value =[id]
    client.query(sql,value).then(()=>{
        res.redirect('/character/my-fav-characters')
    }).catch(error =>{console.log(error)})
}

// function createCharacter(req,res) {
//     const {name,house,patronus,status} =req.body
//     const sql ='INSERT INTO characters (name,house,patronus,is_alive,created_by) VALUES ($1,$2,$3,$4,$5)'
//     const value =[name,house,patronus,status,'user']
//     client.query(sql,value).then(()=>{
//         res.redirect('/character/my-characters')
//     }).catch(error =>{console.log(error)})
// }
// function showCreate(req,res) {
//     const sql ='SELECT * FROM characters WHERE created_by=$1'
//     const value=['user']
//     client.query(sql,value).then((dataFromDB)=>{
//         res.render('fav',{ fn : dataFromDB.rows})

//     })
// }
// function renderCreate(req,res) {
//     res.render('create-chara')
// }
// helper functions
function Character(data) {
    
   this.name=data.name
   this. house=data.house
   this.patronus=data.patronus
   this.alive=data.alive
   this.image=data.image
   this.yearOfBirth=data.yearOfBirth
}
// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
