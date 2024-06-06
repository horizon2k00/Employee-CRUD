const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const changepath = path.join(__dirname, '/DATA/changeLog.json');
const datapath = path.join(__dirname, './DATA/data.json');
const { authorizedUser, verifyName, verifyAge, verifyEmail, verifyDep, verifyPass, verifyPos, verifySal, verifyPriv, verifyRating, findEmp, checkIndex, isAdmin } = require('./modules/verifyData.js');
const { getEmp, getChangeLogs } = require('./modules/filterData.js')

//employee update middleware. 
function update(req, res) {
    const emp = getEmp();
    const changeLog = getChangeLogs();
    const change = { empId: parseInt(req.params.id), createdAt: Date.now(), before: {}, after: {} };
    if (changeLog.length === 0) {
        change.id = 1;
    } else {
        change.id = changeLog[changeLog.length - 1].id + 1;
    }
    if (req.body.email) {
        const index = findEmp(emp, 'email', req.body.email);
        if (index !== res.index && index !== -1) {
            res.send('This email is already in use for a different user');
        } else {
            change.before.email = emp[res.index].email;
            change.after.email = req.body.email;
            emp[res.index].email = req.body.email;
        }
    }
    if (req.body.name) {
        change.before.name = emp[res.index].name;
        change.after.name = req.body.name;
        emp[res.index].name = req.body.name;
    }
    if (req.body.age) {
        change.before.age = emp[res.index].age;
        change.after.age = req.body.age;
        emp[res.index].age = req.body.age;
    }
    if (req.body.position) {
        change.before.position = emp[res.index].position;
        change.after.position = req.body.position;
        emp[res.index].position = req.body.position;
    }
    if (req.body.department) {
        change.before.department = emp[res.index].department;
        change.after.department = req.body.department;
        emp[res.index].department = req.body.department;
    }
    if (req.body.salary) {
        change.before.salary = emp[res.index].salary;
        change.after.salary = req.body.salary;
        emp[res.index].salary = req.body.salary;
    }
    if (req.body.privilege) {
        change.before.privilege = emp[res.index].privilege;
        change.after.privilege = req.body.privilege;
        emp[res.index].privilege = req.body.privilege;
    }
    if (req.body.rating) {
        change.before.rating = emp[res.index].rating;
        change.after.rating = req.body.rating;
        emp[res.index].rating = req.body.rating;
    }
    change.updatedAt = Date.now();
    changeLog.push(change);
    fs.writeFileSync(datapath, JSON.stringify(emp));
    fs.writeFileSync(changepath, JSON.stringify(changeLog));
    res.send(`employee details updated: \n` + `${JSON.stringify(emp[res.index])}\nChangelog:${JSON.stringify(change)}`);
}

// gets index of emp with given id-stores in res.index
function getId(req, res, next) {
    const employees = getEmp();
    const id = parseInt(req.params.id);
    res.index = findEmp(employees, 'empId', id);
    checkIndex(res.index, 'invalid employee id', res);
    res.updateRoute = true;
    next();
}

//verify person trying to update pwd    --req.body.email === req.jwtPayload.email-- next() if true, error res if false
function passAuth(req, res, next) {
    if (authorizedUser(req.jwtPayload, req.body, 'personal')) {
        next();
    } else {
        res.send("Incorrect email or you are trying to update an id that is not yours");
    }
}

//check if user is updating their own data, if not checks if admin. sends error response if both false
function authorizeUser(req, res, next) {
    const employees = getEmp();
    if (authorizedUser(req.jwtPayload, employees[res.index])) {
        next();
    } else {
        res.send('You dont have access to update this information');
    }
}

//Middleware goes next() if admin and sends error response if not admin
function checkAdmin(req, res, next) {
    if (isAdmin(req)) {
        next();
    } else {
        res.send('This requires admin privileges');
    }
}

function createChangeLog(emp, changeLog) {
    const change = { empId: emp.empId, createdAt: Date.now(), before: {}, after: {} };
    if (changeLog.length === 0) {
        change.id = 1;
    } else {
        change.id = changeLog[changeLog.length - 1].id + 1;
    }
    return change;
}

//Middleware verifies old pass and updates to new pass
function updatePwd(req, res) {
    const changeLog = getChangeLogs();
    const employees = getEmp();
    const index = findEmp(employees, 'email', req.body.email);
    checkIndex(index, 'Invalid email', res);
    const change = createChangeLog(employees[index], changeLog);
    if (!bcrypt.compareSync(req.body.oldPassword, employees[index].password)) {
        res.send('Old password incorrect');
    } else {
        bcrypt.hash(req.body.password, 5).then((hash) => {
            change.before.password = employees[index].password;
            change.after.password = hash;
            employees[index].password = hash;
            change.updatedAt = Date.now();
            changeLog.push(change);
            fs.writeFileSync(changepath, JSON.stringify(changeLog));
            fs.writeFileSync(datapath, JSON.stringify(employees));
            res.send('Password updated successfully');
        });
    }
}

//update api to update multiple salaries at once
router.put('/bulk/salary', checkAdmin, (req, res) => {
    const employees = getEmp();
    const changeLog = getChangeLogs();
    const ids = req.body;
    const hike = parseInt(req.query.hike);
    const updatedList = [];
    employees.map(emp => {
        ids.map(id => {
            if (emp.empId === id) {
                const change = createChangeLog(emp, changeLog);
                change.before.salary = emp.salary;
                emp.salary += emp.salary * hike / 100;
                change.after.salary = emp.salary;
                change.updatedAt = Date.now();
                changeLog.push(change);
                updatedList.push({ empId: emp.empId, name: emp.name, email: emp.email, salary: emp.salary });
            }
        });
    });
    if(updatedList.length){
        fs.writeFileSync(datapath, JSON.stringify(employees));
        fs.writeFileSync(changepath, JSON.stringify(changeLog));
        res.send(updatedList);
    }else{
        res.send('Employees with these ids do not exist')
    }
});

//update api to update multiple ratings at once
router.put('/bulk/rating', checkAdmin, (req, res) => {
    const employees = getEmp();
    const changeLog = getChangeLogs();
    const ids = req.body;
    const inc = parseInt(req.query.inc);
    const updatedList = [];
    employees.map(emp => {
        ids.map(id => {
            if (emp.empId === id) {
                const change = createChangeLog(emp, changeLog);
                change.before.rating = emp.rating;
                emp.rating += inc;
                if (emp.rating < 0) {
                    emp.rating = 0
                } if (emp.rating > 5) {
                    emp.rating = 5;
                }
                change.after.rating = emp.rating;
                change.updatedAt = Date.now();
                changeLog.push(change);
                updatedList.push({ empId: emp.empId, name: emp.name, email: emp.email, rating: emp.rating.toFixed(1) });
            }
        });
    });
    if(updatedList.length){
        fs.writeFileSync(datapath, JSON.stringify(employees));
        fs.writeFileSync(changepath, JSON.stringify(changeLog));
        res.send(updatedList);
    }else{
        res.send('Employees with these ids do not exist')
    }
});

//update api to update multiple employee ages at once
router.put('/bulk/age', checkAdmin, (req, res) => {
    const employees = getEmp();
    const changeLog = getChangeLogs();
    const ids = req.body;
    const increment = parseInt(req.query.inc);
    const updatedList = [];
    employees.map(emp => {
        ids.map(id => {
            if (emp.empId === id) {
                const change = createChangeLog(emp, changeLog);
                change.before.age = emp.age;
                emp.age += increment;
                change.after.age = emp.age;
                change.updatedAt = Date.now();
                changeLog.push(change);
                updatedList.push({ empId: emp.empId, name: emp.name, email: emp.email, age: emp.age });
            }
        });
    });
    if(updatedList.length){
        fs.writeFileSync(datapath, JSON.stringify(employees));
        fs.writeFileSync(changepath, JSON.stringify(changeLog));
        res.send(updatedList);
    }else{
        res.send('Employees with these ids do not exist')
    }
});

// update route to update employee details
router.put('/emp/:id', getId, authorizeUser, verifyName, verifyAge, verifyEmail, verifyDep, verifyPass, verifyPos, verifySal, verifyPriv, verifyRating, update);

// update route to update employee password
router.put('/password', passAuth, verifyPass, updatePwd);

module.exports = router;