const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const {jwtAuth,isAdmin,verifyName,verifyAge,verifyEmail,verifyDep,verifyPass,verifyPos,verifySal, findEmp,verifyPriv, checkIndex} = require('./verifyData.js');
const datapath = path.join(__dirname,'DATA','data.json');
const router = express.Router();


function exists(req,res,next){
    if(!fs.existsSync(datapath)){
        fs.writeFileSync(datapath,'[]');   
    }
    next();
}

// console.log(employees);

// function nameAuth(req,res,next){
//     if(!res.newData.name){
//         res.send('Please enter name');
//     }else if(res.newData.name.charAt(0)<='9'){
//         res.send('name must start with a letter');
//     }else{
//         next();
//     }
// }

// function ageAuth(req, res, next){ 
//     if(!res.newData.age){
//         res.send('Please enter age');
//     }else if(typeof(res.newData.age) !== 'number'){
//         res.send('age has to be a number');
//     }else if(res.newData.age<18 || res.newData.age>60){
//         res.send('Age must be between 18 and 60 only')
//     }else{
//         next();
//     }
// }

// function passAuth(req,res,next){
//     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,30}$/;
//     const pass = res.newData.password;
//     if(pass.length<8){
//         res.send('password must be at least 8 characters long');
//     }else if(!regex.test(pass)){
//         res.send('Password must contain at least one caps, one number, and one special character');
//     }else{
//         next();
//     }
// }

// function salAuth(req,res,next){
//     if(!res.newData.salary){
//         res.send('Please enter salary');
//     }else if(typeof(res.newData.salary) !== 'number'){
//         res.send('salary must be a number');
//     }else{
//         next();
//     }
// }

// function depAuth(req, res, next){
//     if(res.newData.department === 'Frontend' || res.newData.department === 'Backend' || res.newData.department === 'Fullstack' ){
//         next();
//     }else{
//         res.send("Choose one of the departments - Frontend, Backend or Fullstack");
//     }
// }

// function posAuth(req, res, next){
//     if(res.newData.position === 'Intern' || res.newData.position === 'Developer' || res.newData.position === 'Tester' || res.newData.position === 'QA'){
//         next();
//     }else{
//         res.send("Choose one of the positions - Intern, Developer, Tester or QA");
//     }
// }

function authorizeUser(req,res,next){
    if(isAdmin(req)){
        next();
    }else{
        res.send('You are not authorized to create new ids');
    }
}

function createEntry(req,res){
    // console.log(employees[employees.length-1]);
    const employees = require(datapath);
    // const index = employees.findIndex((e)=>e.email === req.body.email);
    const index = findEmp(employees,'email',req.body.email);
    if(!index){//--------------------------
        if(employees.length === 0){
            req.body.id = 1;
        }else{
            req.body.id = employees[employees.length-1].id + 1;
        }
        bcrypt.hash(req.body.password,5).then((hash)=>{
            req.body.password = hash;
            console.log(req.body);
            employees.push(req.body);
            fs.writeFileSync(datapath,JSON.stringify(employees));
            res.send('Employee added sucessfully');
        });
    }else{
        res.send('This email is in use');
    }
}
// checkIndex(index,'This email is in use',res);
// function initFn(req,res,next){
//     console.log(req.body);
//     // req.emp = req.body;
//     next();
// }

router.post('/',jwtAuth,exists,authorizeUser,verifyEmail,verifyName,verifyAge,verifyDep,verifyPass,verifyPos,verifySal,verifyPriv,createEntry);

router.post('/many',exists,(req,res)=>{
    const emp = require('../refdata.json')
    // const employees = require(datapath);
    emp.map((e)=>{
        e.password = bcrypt.hashSync(e.password,5);
    });
    fs.writeFileSync(datapath,JSON.stringify(emp));
    res.send(emp);
});

module.exports = router;