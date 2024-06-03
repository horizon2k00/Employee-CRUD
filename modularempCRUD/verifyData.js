// any data sent to this module needs to be saved to req.body object
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const datapath = path.join(__dirname,'/DATA/data.json');
dotenv.config({path: path.resolve(__dirname,'./.env')});

function exists(req,res,next){
    if(!fs.existsSync(datapath)){
        res.send('no employee present in company');    
    }else{
        next();
    }
}

function jwtAuth(req,res,next){
    try{
        const secret = process.env.SECRET_KEY;
        req.jwtPayload = jwt.verify(req.get('Authorization'),secret);
        console.log(req.jwtPayload);
        next();
    }catch(err){
        // console.log(''+err);
        res.send('Your token is invalid');
    }
}

function isAdmin(req){
    return req.jwtPayload.privilege === 'admin';
}

function authorizedUser(payload, empData,specifyAuth){
    if(!specifyAuth) {
        specifyAuth=1;
    }
    if(payload.privilege === 'admin' && empData.email === payload.email){
        return true;
    }else if(payload.privilege === 'admin'){
        if(specifyAuth === 1) return true;
        else if(specifyAuth === 'admin') return true;
        else return false;
    }else if(empData.email === payload.email){
        if(specifyAuth === 1) return true;
        else if(specifyAuth === 'personal') return true;
        else return false;
    }else return false;
}
  
function findEmp(emp,key,parameter){
    const index = emp.findIndex((e)=>e[key] === parameter)
    if(index === -1) return null;
    else return index;
}

function checkIndex(i, returnMsg,res){
    if(i !== null) return;
    else{
     res.send(returnMsg);
    }
}

function verifyName(req,res,next){
    if(!req.body.name){
        if(res.updateRoute){
            next();
        }else{
            res.send('Please enter name');
        }
    }else if(req.body.name.charAt(0)<='9'){
        res.send('name must start with a letter');
    }else{
        next();
    }
}

function verifyAge(req, res, next){ 
    if(!req.body.age){
        if(res.updateRoute){
            next();
        }else{
            res.send('Please enter age');
        }
    }else if(typeof(req.body.age) !== 'number'){
        res.send('age has to be a number');
    }else if(req.body.age<18 || req.body.age>60){
        res.send('Age must be between 18 and 60 only')
    }else{
        next();
    }
}

function verifyPass(req,res,next){
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,30}$/;
    const pass = req.body.password;
    if(!pass){
        if(res.updateRoute){
            next();
        }else{
            res.send('Please enter a password');
        }
    }else if(pass.length<8){
        res.send('password must be at least 8 characters long');
    }else if(!regex.test(pass)){
        res.send('Password must contain at least one caps, one number, and one special character');
    }else{
        next();
    }
}

function verifyEmail(req,res,next){
    const regex = /\S+@\S+\.\S+/;
    if(!req.body.email){
        if(res.updateRoute){
            next();
        }else{
            res.send('Email not provided');
        }
    }else if(!regex.test(req.body.email)){
        res.send('Email is not valid');
    }else{
        next();
    }
}

function verifySal(req,res,next){
    if(!req.body.salary){
        if(res.updateRoute){
            next();
        }else{
            res.send('Please specify a salary');
        }
    }else if(typeof(req.body.salary) !== 'number'){
        res.send('salary must be a number');
    }else{
        next();
    }
}

function verifyDep(req, res, next){
    if(!req.body.department){
        if(res.updateRoute){
            next();
        }else{
            res.send('Choose one of the departments - Frontend, Backend or Fullstack');
        }
    }else if(req.body.department === 'Frontend' || req.body.department === 'Backend' || req.body.department === 'Fullstack' ){
        next();
    }else{
        res.send("Choose one of the departments - Frontend, Backend or Fullstack");
    }
}

function verifyPos(req, res, next){
    if(!req.body.position){
        if(res.updateRoute){
            next();
        }else{
            res.send('Choose one of the departments - Frontend, Backend or Fullstack');
        }
    }else if(req.body.position === 'Intern' || req.body.position === 'Developer' || req.body.position === 'Tester' || req.body.position === 'QA'){
        next();
    }else{
        res.send("Choose one of the positions - Intern, Developer, Tester or QA");
    }
}

function verifyPriv(req,res,next){
    if(!req.body.privilege){
        if(res.updateRoute){
            next();
        }else{
            res.send("Specify user's access privileges - 'admin' or 'emp'");
        }
    }else if(req.body.privilege === 'admin' || req.body.privilege === 'emp'){
        next();
    }else{
        res.send("Access privileges are - 'admin' or 'emp'");
    }
}

module.exports = {exists,jwtAuth,isAdmin,checkIndex,findEmp,authorizedUser,verifyName,verifyAge,verifyEmail,verifyDep,verifyPass,verifyPos,verifySal,verifyPriv};