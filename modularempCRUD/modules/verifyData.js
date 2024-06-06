
// any data sent to this module needs to be saved to req.body or req object

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const datapath = path.join(__dirname, '../DATA/data.json');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Middleware to check if employee datafile exists
function exists(req, res, next) {
    if (!fs.existsSync(datapath)) {
        res.send('no employee present in company');
    } else {
        next();
    }
}

//Middleware Authorizes jwt token and saves payload into req.payload(useful to check email and access privileges)
function jwtAuth(req, res, next) {
    try {
        const secret = process.env.SECRET_KEY;
        req.jwtPayload = jwt.verify(req.get('Authorization'), secret);
        next();
    } catch (err) {
        console.log('' + err);
        res.send('Your token is invalid');
    }
}

// Normal function returns boolean based on jwt payload's 'privilege' key
function isAdmin(req) {
    return req.jwtPayload.privilege === 'admin';
}

// Normal function (arg1, arg2, arg3||undefined), if arg3(can be 'admin' or 'personal'), checks if admin or if arg1.email === arg2.email else checks if either are true
function authorizedUser(payload, empData, specifyAuth) { //needs (req.payload, req.body)
    if (!specifyAuth) {
        specifyAuth = 1;
    }
    if (payload.privilege === 'admin' && empData.email === payload.email) {
        return true;
    } else if (payload.privilege === 'admin') {
        if (specifyAuth === 1) return true;
        else if (specifyAuth === 'admin') return true;
        else return false;
    } else if (empData.email === payload.email) {
        if (specifyAuth === 1) return true;
        else if (specifyAuth === 'personal') return true;
        else return false;
    } else return false;
}

// finds index of emp whose key:parameter matches "arg2":"arg3". Uses Arrays.findIndex()
function findEmp(emp, key, parameter) {
    const index = emp.findIndex((e) => e[key] === parameter)
    return index;
}

//checkIndex(arg1,arg2,arg3) checks for index === -1 and sends err response 'arg2' if true, else allows code to continue without change
function checkIndex(i, returnMsg, res) {
    if (i !== -1) return;
    else {
        res.send(returnMsg);
    }
}

// Middleware verifies jwt for admin privilege
function verifyAdmin(req, res, next) {
    if (isAdmin(req)) {
        next();
    } else {
        res.send('Admin privileges needed to access this data.')
    }
}

//Middleware verifies name
function verifyName(req, res, next) {
    if (!req.body.name) {
        if (res.updateRoute) {
            next();
        } else {
            res.send('Please enter name');
        }
    } else if (req.body.name.charAt(0) <= '9') {
        res.send('name must start with a letter');
    } else {
        next();
    }
}

//Middleware verifies age
function verifyAge(req, res, next) {
    if (!req.body.age) {
        if (res.updateRoute) {
            next();
        } else {
            res.send('Please enter age');
        }
    } else if (typeof (req.body.age) !== 'number') {
        res.send('age has to be a number');
    } else if (req.body.age < 18 || req.body.age > 60) {
        res.send('Age must be between 18 and 60 only')
    } else {
        next();
    }
}

//Middleware verifies password (uses regex matching)
function verifyPass(req, res, next) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,30}$/;
    const pass = req.body.password;
    if (!pass) {
        if (res.updateRoute) {
            next();
        } else {
            res.send('Please enter a password');
        }
    } else if (pass.length < 8) {
        res.send('password must be at least 8 characters long');
    } else if (!regex.test(pass)) {
        res.send('Password must contain at least one caps, one number, and one special character');
    } else {
        next();
    }
}

//Middleware verifies email(uses basic regex matching, true verification must be done by sending email and awaiting response at server)
function verifyEmail(req, res, next) {
    const regex = /\S+@\S+\.\S+/;
    if (!req.body.email) {
        if (res.updateRoute) {
            next();
        } else {
            res.send('Email not provided');
        }
    } else if (!regex.test(req.body.email)) {
        res.send('Email is not valid');
    } else {
        next();
    }
}

//Middleware verifies salary
function verifySal(req, res, next) {
    if (!req.body.salary) {
        if (res.updateRoute) {
            next();
        } else {
            res.send('Please specify a salary');
        }
    } else if (typeof (req.body.salary) !== 'number') {
        res.send('salary must be a number');
    } else {
        next();
    }
}

//Middleware verifies department
function verifyDep(req, res, next) {
    if (!req.body.department) {
        if (res.updateRoute) {
            next();
        } else {
            res.send('Choose one of the departments - Frontend, Backend or Fullstack');
        }
    } else if (req.body.department === 'Frontend' || req.body.department === 'Backend' || req.body.department === 'Fullstack') {
        next();
    } else {
        res.send("Choose one of the departments - Frontend, Backend or Fullstack");
    }
}

//Middleware verifies position
function verifyPos(req, res, next) {
    if (!req.body.position) {
        if (res.updateRoute) {
            next();
        } else {
            res.send('Choose one of the departments - Frontend, Backend or Fullstack');
        }
    } else if (req.body.position === 'Intern' || req.body.position === 'Developer' || req.body.position === 'Tester' || req.body.position === 'QA') {
        next();
    } else {
        res.send("Choose one of the positions - Intern, Developer, Tester or QA");
    }
}

//Middleware verifies access privilege
function verifyPriv(req, res, next) {
    if (!req.body.privilege) {
        if (res.updateRoute) {
            next();
        } else {
            res.send("Specify user's access privileges - 'admin' or 'emp'");
        }
    } else if (req.body.privilege === 'admin' || req.body.privilege === 'emp') {
        next();
    } else {
        res.send("Access privileges must be - 'admin' or 'emp'");
    }
}

//Middleware verifies employee rating
function verifyRating(req, res, next) {
    if (!req.body.rating) {
        next();
    } else {
        if (req.body.rating < 0 || req.body.rating > 5) {
            res.send('Rating must be a decimal between 0 and 5');
        } else {
            next();
        }
    }
}

module.exports = { exists, jwtAuth, isAdmin, checkIndex, findEmp, authorizedUser, verifyAdmin, verifyName, verifyAge, verifyEmail, verifyDep, verifyPass, verifyPos, verifySal, verifyPriv, verifyRating };