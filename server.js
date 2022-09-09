const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const register = require('./controllers/register');
const login = require('./controllers/login');
const products = require('./controllers/products')

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(cors());
app.listen(process.env.PORT || 3001, () => {
    console.log(`Servidor funcionando en el puerto: ${process.env.PORT || 3001}`);

});

const db = {
    MongoClient: mongodb.MongoClient,
    url: process.env.MONGODB_URI,// URL at which MongoDB service is running
    dbName: process.env.DB_NAME, // A Client to MongoDB
    ObjectId:mongodb.ObjectId
};

app.get('/saludar', (req, res) => {
    res.status(200).json({ saludo: "Hola" });
});

app.post('/login', (req, res) => {
    login.handleLogin(req, res, db, bcrypt);
});

app.post('/registro', (req, res) => {


    register.handleRegister(req, res, db, bcrypt);
});

app.get('/products', (req, res) => {

    products.getProducts(req, res,db);

});


app.post('/products', (req, res) => {
    
    products.addProduct(req, res,db);

});

app.delete('/products', (req, res) =>{

    products.deleteProduct(req, res,db);
});
