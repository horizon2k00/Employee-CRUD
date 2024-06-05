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
    console.log(index);
    req.body['Joining-Date'] = Date(Date.now()).slice(4,15);
    req.body.rating = 3;
    if(index === -1){//--------------------------
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

router.post('/',jwtAuth,exists,authorizeUser,verifyEmail,verifyName,verifyAge,verifyDep,verifyPass,verifyPos,verifySal,verifyPriv,createEntry);

// router.post('/many',exists,(req,res)=>{
//     const emp = require('../refdata.json')
//     // const employees = require(datapath);
//     emp.map((e)=>{
//         e.password = bcrypt.hashSync(e.password,5);
//     });
//     fs.writeFileSync(datapath,JSON.stringify(emp));
//     res.send(emp);
// });

module.exports = router;