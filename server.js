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
