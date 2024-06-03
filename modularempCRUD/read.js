const express = require('express');
const fs = require('fs');
const router = express.Router();
const {exists,jwtAuth,authorizedUser, isAdmin, findEmp, checkIndex} = require('./verifyData.js');
const path = require('path');
const jwt = require('jsonwebtoken');
const datapath = path.join(__dirname,'/DATA/data.json');

// function exists(req,res,next){
//     if(!fs.existsSync(datapath)){
//         res.send('no employee present in company');    
//     }else{
//         next();
//     }
// }

// function jwtAuth(req,res,next){
//     try{
//         const jwtPayload = jwt.verify(req.get('Authorization'),'very_SAFE_SECRET_KEY');
//         console.log(jwtPayload);
//         next();
//     }catch(err){
//         console.log('error at jwt verify:'+err);
//         res.send('error at jwt verify:'+err);
//     }
// }
router.get('/',jwtAuth,(req,res,next)=>{
    if(isAdmin(req)){
        next();
    }else{
        res.send('Access privilege not granted');
    }
},exists, (req, res) => {
    // console.log(res);
    const employees = require(datapath);
    if(employees.length === 0){
    res.send('no employee present in company');    
    }else{
            res.send(JSON.stringify(employees));
    }
})
router.get('/:id',jwtAuth,exists, (req, res) => {
    const employees = require(datapath);
    const id = parseInt(req.params.id);
    // console.log(iden);
    // const emp = employees.find((ele) =>ele.id === id);
    const index = findEmp(employees,'id',id);
    checkIndex(index,"Employee doesn't exist",res);
    const emp = employees[index];//------------------------------------------------------------------
    if(emp){
        if(authorizedUser(req.jwtPayload,emp)) res.send(`Employee id ${id} \n ${JSON.stringify(emp)}`);  
        else res.send('Access Denied');
    }else{
        res.send('Employee Doesnt exist');
    }
    // console.log(index);
})

module.exports = router;