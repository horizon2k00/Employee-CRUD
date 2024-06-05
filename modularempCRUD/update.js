const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const datapath = path.join(__dirname, '/DATA/data.json');
const changepath = path.join(__dirname, '/DATA/changeLog.json');
const { exists, jwtAuth, authorizedUser, verifyName, verifyAge, verifyEmail, verifyDep, verifyPass, verifyPos, verifySal, verifyPriv, verifyRating, findEmp, checkIndex, isAdmin } = require('./verifyData.js');
const e = require('express');


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

function update(req, res) {
    // console.log(emp[2]);
    const emp = require(datapath);
    console.log(typeof (emp));
    const changeLog = require(changepath);
    const change = { empId: parseInt(req.params.id), createdAt: Date.now(), before: {}, after: {} };
    // console.log(emp[3]);
    if (changeLog.length === 0) {
        change.id = 1;
    } else {
        change.id = changeLog[changeLog.length - 1].id + 1;
    }
    // console.log(emp[3]);
    if (req.body.email) {
        // const index = emp.findIndex((e)=>e.email === req.body.email)//------------------------------
        const index = findEmp(emp, 'email', req.body.email);
        if (index !== res.index && index !== -1) {
            res.send('This email is already in use for a different user');
        } else {
            change.before.email = emp[res.index].email;
            change.after.email = req.body.email;
            emp[res.index].email = req.body.email;
            // console.log(emp[3]);
        }
    }
    if (req.body.name) {
        change.before.name = emp[res.index].name;
        change.after.name = req.body.name;
        emp[res.index].name = req.body.name;
        // console.log(emp[3]);
    }
    if (req.body.age) {
        change.before.age = emp[res.index].age;
        change.after.age = req.body.age;
        emp[res.index].age = req.body.age;
        // console.log(emp[3]);
    }
    if (req.body.position) {
        change.before.position = emp[res.index].position;
        change.after.position = req.body.position;
        emp[res.index].position = req.body.position;
        // console.log(emp[3]);
    }
    if (req.body.department) {
        change.before.department = emp[res.index].department;
        change.after.department = req.body.department;
        emp[res.index].department = req.body.department;
        // console.log(emp[3]);
    }
    if (req.body.salary) {
        change.before.salary = emp[res.index].salary;
        change.after.salary = req.body.salary;
        emp[res.index].salary = req.body.salary;
        // console.log(emp[3]);
    }
    if (req.body.privilege) {
        change.before.privilege = emp[res.index].privilege;
        change.after.privilege = req.body.privilege;
        emp[res.index].privilege = req.body.privilege;
        // console.log(emp[3]);
    }
    if (req.body.rating) {
        change.before.rating = emp[res.index].rating;
        change.after.rating = req.body.rating;
        emp[res.index].rating = req.body.rating;
        // console.log(emp[3]);
    }
    // console.log(emp[3]);
    change.updatedAt = Date.now();
    changeLog.push(change);
    fs.writeFileSync(datapath, JSON.stringify(emp));
    console.log(res.index);
    fs.writeFileSync(changepath, JSON.stringify(changeLog));
    res.send(`employee details updated: \n` + `${JSON.stringify(emp[res.index])}\nChangelog:${JSON.stringify(change)}`);
}

function initFn(req, res, next) {
    const employees = require(datapath);
    const id = parseInt(req.params.id);
    res.index = findEmp(employees, 'id', id);
    res.updateRoute = true;
    checkIndex(res.index, 'invalid employee id', res);
    next();
}

function passAuth(req, res, next) {
    if (authorizedUser(req.jwtPayload, req.body, 'personal')) { //verify person trying to update pwd    --req.body.email === req.jwtPayload.email-- 
        next();
    } else {
        res.send("Your email is incorrect");
    }
}

function authorizeUser(req, res, next) {
    const employees = require(datapath);
    if (authorizedUser(req.jwtPayload, employees[res.index])) {
        next();
    } else {
        res.send('You dont have access to update this information');
    }
}

function checkAdmin(req, res, next) {
    if (isAdmin(req)) {
        next();
    } else {
        res.send('You dont have access to update this information');
    }
}

function updatePwd(req, res) {
    const employees = require(datapath);
    // const index = employees.findIndex((ele)=>ele.email === req.body.email);
    const index = findEmp(employees, 'email', req.body.email)
    // if(index === -1){//--------------------------------------
    //     res.send('Invalid email');
    // }
    checkIndex(index, 'Invalid email', res);
    if (!bcrypt.compareSync(req.body.oldPassword, employees[index].password)) {
        res.send('Old password incorrect');
    } else {
        bcrypt.hash(req.body.password, 5).then((hash) => {
            employees[index].password = hash;
            fs.writeFileSync(datapath, JSON.stringify(employees));
            res.send('Password updated successfully');
        });
    }
}

router.put('/bulk/salary', jwtAuth, exists, checkAdmin, (req, res) => {
    const employees = require(datapath);
    const changeLog = require(changepath);
    const ids = req.body;
    const hike = parseInt(req.query.hike);
    const updatedList = [];
    employees.map(emp => {
        ids.map(id => {
            if (emp.id === id) {
                const change = { empId: emp.id, createdAt: Date.now(), before: {}, after: {} };
                // console.log(emp[3]);
                if (changeLog.length === 0) {
                    change.id = 1;
                } else {
                    change.id = changeLog[changeLog.length - 1].id + 1;
                }
                change.before.salary = emp.salary;
                emp.salary += emp.salary * hike / 100;
                change.after.salary = emp.salary;
                change.updatedAt = Date.now();
                changeLog.push(change);
                updatedList.push(emp);
                // console.log(emp);
            }
        });
    });
    fs.writeFileSync(datapath, JSON.stringify(employees));
    fs.writeFileSync(changepath, JSON.stringify(changeLog));
    res.send(updatedList);
})

router.put('/bulk/age', jwtAuth, exists, checkAdmin, (req, res) => {
    const employees = require(datapath);
    const changeLog = require(changepath);
    const ids = req.body;
    const increment = parseInt(req.query.inc);
    const updatedList = [];
    employees.map(emp => {
        ids.map(id => {
            if (emp.id === id) {
                const change = { empId: emp.id, createdAt: Date.now(), before: {}, after: {} };
                // console.log(emp[3]);
                if (changeLog.length === 0) {
                    change.id = 1;
                } else {
                    change.id = changeLog[changeLog.length - 1].id + 1;
                }
                change.before.age = emp.age;
                emp.age += increment;
                change.after.age = emp.age;
                change.updatedAt = Date.now();
                changeLog.push(change);
                // console.log(emp);
                updatedList.push(emp);
            }
        });
    });
    fs.writeFileSync(datapath, JSON.stringify(employees));
    fs.writeFileSync(changepath, JSON.stringify(changeLog));
    res.send(updatedList);
})

router.put('/emp/:id', jwtAuth, exists, initFn, authorizeUser, verifyName, verifyAge, verifyEmail, verifyDep, verifyPass, verifyPos, verifySal, verifyPriv, verifyRating, update);


router.put('/password', jwtAuth, exists, passAuth, verifyPass, updatePwd);

module.exports = router;

// if(req.jwtPayload.privilege === 'admin' || req.jwtPayload.email === employees[res.index].email){ // checking priveleges of updator
//     next();
// }else{
//     res.send('You dont have access to update this information');
// }