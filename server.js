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
app.post('/save', saveData)
app.get('/character/my-fav-characters' ,  renderFav)


app.post('/character/:data_id' , showDetalis)
app.put('/character/:data_id' ,updateCh)
app.delete('/character/:data_id' , deletCh)

app.post('/character/create' , createCH)
app.get('/character/create' , renderCreat)
app.get('/character/my-characters' , renderCR)
// callback functions

// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function renderHome(req,res) {
    const url='http://hp-api.herokuapp.com/api/characters'
    superagent.get(url).then((dataFormApi)=>{
        // console.log(dataFormApi.body)
        const apiData =dataFormApi.body.map(data =>{
            return new Chrarachter(data)
        })
        res.render('index' , { allData : apiData})
    }).catch(error =>{console.log(error)})
}
function saveData(req,res) {
    const{name,house,patronus,alive} =req.body
    const sql ='INSERT INTO mytable (name,house,patronus,alive,created_by) VALUES($1,$2,$3,$4,$5)'
    const value =[name,house,patronus,alive,'api']
    client.query(sql,value).then(()=>{
        res.redirect('/character/my-fav-characters')
    }).catch(error =>{console.log(error)})
    
}
function renderFav(req,res) {
 const sql='SELECT * FROM mytable WHERE created_by=$1 ;'   
 const value=['api']
 client.query(sql,value).then((dataFromDb)=>{
     res.render('fav' , {favData : dataFromDb.rows})
 }).catch(error =>{console.log(error)})
}
function showDetalis(req,res) {
    const id =req.params.data_id
    const sql ='SELECT * FROM mytable WHERE id=$1'
    const value=[id]
    client.query(sql,value).then((dataFromDb)=>{
res.render('detalis' , { detalis :dataFromDb.rows})
    }).catch(error =>{console.log(error)})
    
}
function updateCh(req,res) {
    const {name,house,patronus,status} = req.body
    const id =req.params.data_id
    const sql ='UPDATE mytable SET name=$1, house=$2 , patronus=$3 , alive=$4  WHERE id=$5'
    const value=[name,house,patronus,status,id]
    client.query(sql,value).then(()=>{
        res.redirect('/character/my-fav-characters')
    }).catch(error =>{console.log(error)})
}
function deletCh(req,res) {
    const id =req.params.data_id
    const sql ='DELETE FROM mytable WHERE id=$1'
    client.query(sql,[id]).then(()=>{
        res.redirect('/character/my-fav-characters')

    }).catch(error =>{console.log(error)})
}
function createCH(req,res) {
    const{name,house,patronus,status} =req.body
    const sql ='INSERT INTO mytable (name,house,patronus,alive,created_by) VALUES($1,$2,$3,$4,$5)'
    const value =[name,house,patronus,status,'user']
    client.query(sql,value).then(()=>{
        res.redirect('/character/my-characters')
    }).catch(error =>{console.log(error)})
    
}
function renderCreat(req, res) {
    res.render('create')
    
}
function renderCR(req,res) {
    const sql='SELECT * FROM mytable WHERE created_by=$1 ;'   
 const value=['user']
 client.query(sql,value).then((dataFromDb)=>{
     res.render('fav' , {favData : dataFromDb.rows})
 }).catch(error =>{console.log(error)})
}
// helper functions


function Chrarachter(data) {
    this.name=data.name
    this.house=data.house
    this.patronus=data.patronus
    this.alive=data.alive
    
}
client.connect().then(()=>{
    app.listen(PORT, ()=>(console.log(`listen ${PORT}`)))
})


