const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const datapath = path.join(__dirname,'/DATA/data.json');
const {exists,jwtAuth,authorizedUser,verifyName,verifyAge,verifyEmail,verifyDep,verifyPass,verifyPos,verifySal,verifyPriv, findEmp, checkIndex} = require('./verifyData.js');


// function exists(req,res,next){
//     if(!fs.existsSync(datapath)){
//         res.send('no employee present in company');    
//     }else{
//         next();
//     }
// }

// function nameAuth(req,res,next){
//     if(!res.newData.name){
//         next();
//     }else if(res.newData.name.charAt(0)<='9'){
//         res.send('name must start with a letter');
//     }else{
//         next();
//     }
// }

// function ageAuth(req, res, next){ 
//     if(!res.newData.age){
//         next();
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
//     if(!pass){
//         next();
//     }else if(pass.length<8){
//         res.send('password must be at least 8 characters long');
//     }else if(!regex.test(pass)){
//         res.send('Password must contain at least one caps, one number, and one special character');
//     }else{
//         next();
//     }
// }

// function salAuth(req,res,next){
//     if(!res.newData.salary){
//         next();
//     }else if(typeof(res.newData.salary) !== 'number'){
//         res.send('salary must be a number');
//     }else{
//         next();
//     }
// }

// function depAuth(req, res, next){
//     if(!res.newData.department){
//         next();
//     }else if(res.newData.department === 'Frontend' || res.newData.department === 'Backend' || res.newData.department === 'Fullstack' ){
//         next();
//     }else{
//         res.send("Choose one of the departments - Frontend, Backend or Fullstack");
//     }
// }

// function posAuth(req, res, next){
//     if(!res.newData.position){
//         next();
//     }else if(res.newData.position === 'Intern' || res.newData.position === 'Developer' || res.newData.position === 'Tester' || res.newData.position === 'QA'){
//         next();
//     }else{
//         res.send("Choose one of the positions - Intern, Developer, Tester or QA");
//     }
// }

function update(req, res){
    const employees = require(datapath);
    if(req.body.email){
        // const index = employees.findIndex((e)=>e.email === req.body.email)//------------------------------
        const index = findEmp(employees,'email',req.body.email);
        if(index!==res.index && index!==-1){
            res.send('This email is already in use for a different user');
        }else{
            employees[res.index].email = req.body.email;
        }
    }  
    if (req.body.name) employees[res.index].name = req.body.name;
    if (req.body.age) employees[res.index].age = req.body.age;  
    if (req.body.position) employees[res.index].position =req.body.position;
    if (req.body.department) employees[res.index].department = req.body.department;
    if (req.body.salary) employees[res.index].salary = req.body.salary;
    if(req.body.privilege) employees[res.index].privilege = req.body.privilege;
    if (req.body.password){
            bcrypt.hash(req.body.password,5).then((hash)=>{
            employees[res.index].password = hash;
            fs.writeFileSync(datapath,JSON.stringify(employees));
            res.send(`employee details updated: \n` + `${JSON.stringify(employees[res.index])}`);
        })
    }else{
        fs.writeFileSync(datapath,JSON.stringify(employees));
        res.send(`employee details updated: \n` + `${JSON.stringify(employees[res.index])}`);
    }
    // const updated = req.body;
    // employees[index] = {...employees[index],...updated};
    // console.log(employees);
}

function initFn(req,res,next){
    const employees = require(datapath);
    const id = parseInt(req.params.id);
    // res.index = employees.findIndex((ele) =>ele.id === id);
    res.index = findEmp(employees,'id',id);
    res.updateRoute = true;
    // if (res.index === -1) {//-------------------------------------
    //     res.send('invalid employee id');
    // }else{
    //     next();
    // }
    checkIndex(res.index,'invalid employee id',res);
    next();
}

function passAuth(req,res,next){
    if(authorizedUser(req.jwtPayload,req.body,'personal')){ //verify person trying to update pwd    --req.body.email === req.jwtPayload.email-- 
        next();
    }else{
        res.send("Your email is incorrect");
    }
}

function authorizeUser(req,res,next){
    const employees = require(datapath);
    if(authorizedUser(req.jwtPayload,employees[res.index])){
        next();
    }else{
        res.send('You dont have access to update this information');
    }
}

function updatePwd(req,res){
    const employees = require(datapath);
    // const index = employees.findIndex((ele)=>ele.email === req.body.email);
    const index = findEmp(employees,'email',req.body.email)
    // if(index === -1){//--------------------------------------
    //     res.send('Invalid email');
    // }
    checkIndex(index,'Invalid email',res);
    if(!bcrypt.compareSync(req.body.oldPassword,employees[index].password)){
        res.send('Old password incorrect');
    }else{
        bcrypt.hash(req.body.password,5).then((hash)=>{
            employees[index].password = hash;
            fs.writeFileSync(datapath,JSON.stringify(employees));
            res.send('Password updated successfully');
        });
    }
}

router.put('/emp/:id',jwtAuth,exists,initFn,authorizeUser,verifyName,verifyAge,verifyEmail,verifyDep,verifyPass,verifyPos,verifySal,verifyPriv,update);


router.put('/password',jwtAuth,exists,passAuth,verifyPass,updatePwd);

module.exports = router;

// if(req.jwtPayload.privilege === 'admin' || req.jwtPayload.email === employees[res.index].email){ // checking priveleges of updator
//     next();
// }else{
//     res.send('You dont have access to update this information');
// }