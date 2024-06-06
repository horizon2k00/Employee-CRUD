const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs');
const { isAdmin, verifyName, verifyAge, verifyEmail, verifyDep, verifyPass, verifyPos, verifySal, findEmp, verifyPriv } = require('./modules/verifyData.js');
const { getEmp } = require('./modules/filterData.js');
const path = require('path');
const datapath = path.join(__dirname, './DATA/data.json');

//unique exists function creates json file with empty array if not exists
function exists(req, res, next) {
    if (!fs.existsSync(datapath)) {
        fs.writeFileSync(datapath, '[]');
    }
    next();
}

//checks admin and sends err res if not
function authorizeUser(req, res, next) {
    if (isAdmin(req)) {
        next();
    } else {
        res.send('You are not authorized to create new ids');
    }
}

//creates new employee object with given details and adds to employee data file
function createEntry(req, res) {
    const employees = getEmp();
    const index = findEmp(employees, 'email', req.body.email);
    req.body.joinDate = Date(Date.now()).slice(4, 15);
    req.body.rating = 3;
    if (index === -1) {
        if (employees.length === 0) {
            req.body.id = 1;
        } else {
            req.body.empId = employees[employees.length - 1].empId + 1;
        }
        bcrypt.hash(req.body.password, 5).then((hash) => {
            req.body.password = hash;
            employees.push(req.body);
            fs.writeFileSync(datapath, JSON.stringify(employees));
            res.send('Employee added sucessfully');
        });
    } else {
        res.send('This email is in use');
    }
}

//route to create new employee in file with given data
router.post('/', exists, authorizeUser, verifyEmail, verifyName, verifyAge, verifyDep, verifyPass, verifyPos, verifySal, verifyPriv, createEntry);

// router.post('/many',exists,(req,res)=>{
//     const emp = require('../refdata.json')
//     // const employees = getEmp();
//     emp.map((e)=>{
//         e.password = bcrypt.hashSync(e.password,5);
//     });
//     fs.writeFileSync(datapath,JSON.stringify(emp));
//     res.send(emp);
// });

module.exports = router;