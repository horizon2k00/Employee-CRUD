const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path')
const { authorizedUser, isAdmin, findEmp, checkIndex } = require('./modules/verifyData.js');
const { filterDept, sortby, paginate, getEmp, getChangeLogs } = require('./modules/filterData.js');
const changepath = path.join(__dirname, '/DATA/changeLog.json');

//Middleware checks if admin and sends error response if not
function checkAdmin(req, res, next) {
    if (isAdmin(req)) {
        next();
    } else {
        res.send('Access privilege not granted');
    }
}

//route gets paginated employee data 
router.get('/', checkAdmin, (req, res) => {
    const employees = getEmp();
    if (employees.length === 0) {
        res.send('no employee present in company');
    } else {
        const returnList = paginate(employees, req.query.page, req.query.limit);
        res.send(JSON.stringify(returnList));
    }
});

//route gets paginated employee data sorted by requested key
router.get('/sortby', checkAdmin, (req, res) => {
    const param = req.query.param;
    const order = parseInt(req.query.order);
    let employees = getEmp();
    sortby(employees, param, order);
    const returnList = paginate(employees, req.query.page, req.query.limit);
    res.send(returnList);
});

//route gets employees in requested department
router.get('/dept', checkAdmin, (req, res) => {
    const dept = req.query.name;
    const employees = getEmp();
    const list = filterDept(employees, dept);
    const returnList = paginate(list, req.query.page, req.query.limit);
    res.send(returnList);
});

//route gets employees above threshold rating sorted in descending order
router.get('/rating/gt', checkAdmin, (req, res) => {
    const employees = getEmp();
    const rating = req.query.rating;
    const list = employees.filter(ele => ele.rating >= rating);
    sortby(list, 'rating', -1);
    const returnList = paginate(list, req.query.page, req.query.limit);
    res.send(`Employees with rating above ${rating}:` + JSON.stringify(returnList));
});

//route gets employees below threshold rating sorted in ascending order
router.get('/rating/lt', checkAdmin, (req, res) => {
    const employees = getEmp();
    const rating = req.query.rating;
    const list = employees.filter(ele => ele.rating <= rating);
    sortby(list, 'rating', 1);
    const returnList = paginate(list, req.query.page, req.query.limit);
    res.send(`Employees with rating above ${rating}:` + JSON.stringify(returnList));
});

//route gets number of employees present in company
router.get('/count', checkAdmin, (req, res) => {
    const employees = getEmp();
    res.send(`Total employee count in the company: ${employees.length}`);
});

//route gets employee data along with history of updates to employee details
router.get('/history/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const employees = getEmp(); //require(datapath);FATAL ISSUE: when reading and there are updates shown the updates are being passed as keys into employees.If you update immediately after, the new data gets written into data file ALONG with the update info that was displayed on the GET /history response. 
    const changeLog = getChangeLogs();
    const index = findEmp(employees, 'empId', id);
    checkIndex(index, "Employee doesn't exist", res); //error, moving forward even if index === -1 after res.send
    if (authorizedUser(req.jwtPayload, employees[index])) {
        const empLog = changeLog.filter(e => e.empId === id);
        empLog.sort((a, b) => b.updatedAt - a.updatedAt);
        let updNo = empLog.length;
        const empHist = employees[index];
        empLog.map(ele => {
            const { updatedAt, after, before } = ele;
            const dateObj = new Date(updatedAt);
            const date = dateObj.toString();
            empHist[`changeLog ${updNo--}`] = { updatedAt: date, after, before };
        });
        res.send(`Data History:\n${JSON.stringify(empHist)}`);
    } else {
        res.send('Access denied');
    }

});

//route gets number of empliyees in specified department
router.get('/count/dept', checkAdmin, (req, res) => {
    const employees = getEmp();
    const dept = req.query.name;
    const a = filterDept(employees, dept);
    res.send(`Total employee count in the ${dept} department: ${a.length}`);
});

//route gets details of emp with specified id
router.get('/:id', (req, res) => {
    const employees = getEmp();
    const id = parseInt(req.params.id);
    const index = findEmp(employees, 'empId', id);
    checkIndex(index, "Employee doesn't exist", res);
    const emp = employees[index];
        if (authorizedUser(req.jwtPayload, emp)) res.send(`Employee id ${id} \n ${JSON.stringify(emp)}`);
        else res.send('Access Denied');
});

module.exports = router;