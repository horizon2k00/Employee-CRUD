const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const csvjson = require('csvjson');
const { filterDept, objAverage, arrAverage, sortby, getEmp } = require('./modules/filterData');
const writepath = path.join(__dirname, '/DATA/report.csv');


//returns max of key in array 'a'
function findMax(a, key) {
    let max = 0;
    a.map((e) => {
        if (e[key] > max) max = e[key];
    })
    return max;
}

//returns min of key in array 'a'
function findMin(a, key) {
    let min = Infinity;
    a.map((e) => {
        if (e[key] < min) min = e[key];
    })
    return min;
}

//route to download csv of salary details
router.get('/report/download', (req, res) => {
    const emp = getEmp();
    const deptObj = {};
    emp.map(e => {
        deptObj[e.department] = [];
    });
    emp.map(e => {
        deptObj[e.department].push(e.salary);
    });
    const output = [];
    Object.keys(deptObj).forEach(key => {
        const avg = arrAverage(deptObj[key]);
        output.push({ department: key, totalSalaryExpenditure: avg[0], deptAvg: avg[1].toFixed(2) });
    });
    const csvData = csvjson.toCSV(JSON.stringify(output), { headers: 'key' });

    fs.writeFile(writepath, csvData, (err) => {
        if (err) {
            console.log(err);
            res.end('Could not generate file');
        } else {
            res.download(writepath);
        }
    });
});

//route to get top n salaries from data
router.get('/top', (req, res) => {
    let i = parseInt(req.query.number);
    const emp = getEmp();
    if (i === 0) { i = 1 }
    else if (i > emp.length) { i = emp.length }
    sortby(emp, 'salary', -1);
    while (i < emp.length && emp[i].salary === emp[i-1].salary) { i++;console.log(i); }
    res.send(emp.slice(0, i));
});

//rout to show average salary of employee in company
router.get('/average', (req, res) => {
    const emp = getEmp();
    const avg = objAverage(emp, 'salary');
    res.send(`Total Salary to be distributed: $${avg[0]}\nAverage employee salary: $` + avg[1].toFixed(2));
});

//route shows average sal of each dept in one response
router.get('/average/dept/all', (req, res) => {
    const emp = getEmp();
    const deptObj = {};
    emp.map(e => {
        deptObj[e.department] = [];
    });
    emp.map(e => {
        deptObj[e.department].push(e.salary);
    });
    console.log(deptObj);
    const output = [];
    Object.keys(deptObj).forEach(key => {
        const avg = arrAverage(deptObj[key]);
        output.push({ department: key, average: avg[1].toFixed(2) });
    })
    res.send('Department wise average salary:' + JSON.stringify(output));
})

//route shows average salary of requested department
router.get('/average/dept', (req, res) => {
    const dept = req.query.name;
    const emp = getEmp();
    const deptList = filterDept(emp, dept);
    const avg = objAverage(deptList, 'salary');
    res.send(`Average salary in ${dept} department is $${avg[1].toFixed(2)}`);
})

//route shows max and min sal in requested dept
router.get('/dept', (req, res) => {
    const dept = req.query.name;
    const emp = getEmp();
    const a = filterDept(emp, dept);
    const max = findMax(a, 'salary');
    const min = findMin(a, 'salary');
    res.send(`Max sal:${max}\nMin sal:${min}`);
})

module.exports = router;