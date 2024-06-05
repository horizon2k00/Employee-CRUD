const express = require('express');
const fs = require('fs');
const router = express.Router();
const { exists, jwtAuth, authorizedUser, isAdmin, findEmp, checkIndex } = require('./verifyData.js');
const { filterDept, sortby } = require('./filterData.js');
const path = require('path');
const jwt = require('jsonwebtoken');
const datapath = path.join(__dirname, '/DATA/data.json');
const changepath = path.join(__dirname, '/DATA/changeLog.json');

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
router.get('/', jwtAuth, (req, res, next) => {
    if (isAdmin(req)) {
        next();
    } else {
        res.send('Access privilege not granted');
    }
}, exists, (req, res) => {
    // console.log(res);
    const limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    console.log(typeof page);
    const employees = require(datapath);
    if (employees.length === 0) {
        res.send('no employee present in company');
    } else {
        if (page < 1) page = 1;
        if (page * limit > employees.length) page = Math.ceil(employees.length / limit);
        const returnList = employees.slice((page - 1) * limit, page * limit);
        // console.log(returnList.length);
        res.send(JSON.stringify(returnList));
    }
});

router.get('/sortby', jwtAuth, exists, (req, res) => {
    // const limit = 10, planned to add pagination here as well, but was unsure for best practice on taking multiple queries/params from the path
    const param = req.query.param;
    const order = parseInt(req.query.order);
    let employees = require(datapath);
    sortby(employees, param, order);
    // console.log(list);
    res.send(employees);
})

router.get('/dept', jwtAuth, exists, (req, res) => {
    const dept = req.query.name;
    const employees = require(datapath);
    const list = filterDept(employees, dept);
    res.send(list);
    console.log(list);

})

router.get('/rating/gt:rating', jwtAuth, exists, (req, res) => {
    const employees = require(datapath);
    const rating = req.params.rating;
    console.log(employees + " " + rating);
    const list = employees.filter(ele => {
        return ele.rating >= rating;
    });
    // console.log(list);
    // list.sort((a,b)=>b.rating-a.rating);
    sortby(list, 'rating', -1);
    res.send(`Employees with rating above ${rating}:` + JSON.stringify(list));
})

router.get('/rating/lt:rating', jwtAuth, exists, (req, res) => {
    const employees = require(datapath);
    const rating = req.params.rating;
    console.log(employees + " " + rating);
    const list = employees.filter(ele => {
        return ele.rating <= rating;
    });
    console.log(list);
    // list.sort((a,b)=>a.rating-b.rating);
    sortby(list, 'rating', 1);
    res.send(`Employees with rating above ${rating}:` + JSON.stringify(list));
})

router.get('/count', jwtAuth, exists, (req, res) => {
    const employees = require(datapath);
    res.send(`Total employee count in the company: ${employees.length}`);
})

router.get('/history/:id', jwtAuth, exists, (req, res) => {
    const id = parseInt(req.params.id);
    const employees = JSON.parse(fs.readFileSync(datapath)); //require(datapath);FATAL ISSUE: when reading and there are updates shown the updates are being passed as keys into employees.If you update immediately after, the new data gets written into data file ALONG with the update info that was displayed on the GET /history response. 
    const changeLog = require(changepath);
    const index = findEmp(employees, 'id', id);
    checkIndex(index, "Employee doesn't exist", res);
    // console.log(employees[index]);
    const empLog = changeLog.filter(e => e.empId === id);
    empLog.sort((a, b) => b.updatedAt - a.updatedAt);
    // console.log(empLog);
    const empHist = employees[index];
    // console.log(employees[index]);
    empLog.map(ele => {
        const { updatedAt, after, before } = ele;
        const dateObj = new Date(updatedAt);
        const date = dateObj.toString();
        empHist[`update_${ele.id}`] = { updatedAt: date, after, before };
        // console.log(empHist);
    });
    res.send(`Data History:\n${JSON.stringify(empHist)}`);
})

router.get('/count/dept', jwtAuth, exists, (req, res) => {
    const employees = require(datapath);
    const dept = req.query.name;
    const a = filterDept(employees, dept);
    res.send(`Total employee count in the ${dept} department: ${a.length}`);
})

router.get('/:id', jwtAuth, exists, (req, res) => {
    const employees = require(datapath);
    const id = parseInt(req.params.id);
    // console.log(iden);
    // const emp = employees.find((ele) =>ele.id === id);
    const index = findEmp(employees, 'id', id);
    checkIndex(index, "Employee doesn't exist", res);
    const emp = employees[index];//------------------------------------------------------------------
    if (emp) {
        if (authorizedUser(req.jwtPayload, emp)) res.send(`Employee id ${id} \n ${JSON.stringify(emp)}`);
        else res.send('Access Denied');
    } else {
        res.send('Employee Doesnt exist');
    }
    // console.log(index);
})

module.exports = router;