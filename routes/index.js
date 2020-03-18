const express = require("express");
const db = require('../models/db');
const router = express.Router();

router.get('/',async (req,res,next)=>{
    try{
        let results = await db.all();
        res.json(results);
    }catch(e){
        res.sendStatus(500);
        console.log(e);
    }
});
router.get('/search/name=:name',async (req,res,next)=>{
    try{
        let results = await db.search(req.params.name);
        res.json(results);
    }catch(e){
        res.sendStatus(500);
        console.log(e);
    }
});
router.get('/search/keyword=:word',async (req,res,next)=>{
    try{
        let results = await db.query(req.params.word);
        res.json(results);
    }catch(e){
        res.sendStatus(500);
        console.log(e);
    }
});
router.get('/insert/id=:id&name=:name&text=:text',async (req,res,next)=>{
    try{
        let results = await db.insert(req.params.id,req.params.name,req.params.text);
        res.json(results);
    }catch(e){
        res.sendStatus(500);
        console.log(e);
    }
});
router.get('/insert/id=:id&name=:name',async (req,res,next)=>{
    try{
        let results = await db.insert(req.params.id,req.params.name);
        res.json(results);
    }catch(e){
        res.sendStatus(500);
        console.log(e);
    }
});

module.exports = router;
