
const mysql = require('mysql');
const pool = mysql.createPool({
    //connectionLimit = 10,
    password: 'your_password',
    user: 'root',
    database: 'my_db',
    host: 'localhost',
    port: '3306'
});

let testdb = {};

testdb.all = () =>{

    return new Promise((resolve,reject)=>{

        pool.query('SELECT * FROM my_db.notesDB', (err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });

    });

};

testdb.insert = (id,name,text=null)=>{
    return new Promise((resolve,reject) =>{
        pool.query('INSERT INTO my_db.notesDB(id,name,text) VALUES (?,?,?)', [id,name,text],(err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

testdb.search = (name)=>{
    return new Promise((resolve,reject) =>{
        pool.query('SELECT * FROM my_db.notesDB WHERE name = ?', [name],(err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};
testdb.query = (word)=>{
    return new Promise((resolve,reject) =>{
        pool.query('SELECT * FROM my_db.notesDB WHERE text LIKE \'%'+word+'%\'', [word],(err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = testdb;
