const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const {exists, findEmp, checkIndex} = require('./verifyData.js');
const path = require('path');
const datapath = path.join(__dirname,'/DATA/data.json');
dotenv.config({path: path.resolve(__dirname,'./.env')});//
// function exists(req,res,next){
//     if(!fs.existsSync(datapath)){
//         res.send('no employee present in company');    
//     }else{
//         next();
//     }
// }
// console.log(process.env);

router.post('/',exists,(req,res)=>{
    const employees = require(datapath);
    const {email, password} = req.body;
    // const index = employees.findIndex((e)=>e.email === email)
    const index = findEmp(employees,'email',req.body.email);
    // if(index === -1) res.send('Invalid Email');//---------------------------------------------
    checkIndex(index,'Invalid Email',res);
    // else{
        bcrypt.compare(password,employees[index].password).then((result)=>{
            if(result){
                const secretKey = process.env.SECRET_KEY;
                const payload = {
                    email,
                    audience:'employee storage',
                    privilege:employees[index].privilege
                };
                const token = jwt.sign(payload,secretKey,{expiresIn:"1h"});
                    console.log(token);
                    res.append('access_token', token);
                    res.send('Successfully logged in');
            }else{
                res.send('Password Incorrect');
            }
        }) 
    // }
});
module.exports = router;