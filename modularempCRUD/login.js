const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const {exists, findEmp, checkIndex} = require('./verifyData.js');
const path = require('path');
const datapath = path.join(__dirname,'/DATA/data.json');
dotenv.config({path: path.resolve(__dirname,'./.env')});

router.post('/',exists,(req,res)=>{
    const employees = require(datapath);
    const {email, password} = req.body;
    const index = findEmp(employees,'email',req.body.email);
    checkIndex(index,'Invalid Email',res);  //checkIndex(arg1,arg2,arg3) checks for index === -1 and sends err response 'arg2' if true, else allows code to continue without change
        bcrypt.compare(password,employees[index].password).then((result)=>{
            if(result){
                const secretKey = process.env.SECRET_KEY;
                const payload = {
                    email,
                    audience:'employee storage',
                    privilege:employees[index].privilege
                };
                const token = jwt.sign(payload,secretKey);
                    console.log(token);
                    res.append('access_token', token);
                    res.send('Successfully logged in');
            }else{
                res.send('Password Incorrect');
            }
        });
});
module.exports = router;