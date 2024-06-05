const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const csvjson = require('csvjson');
const { exists } = require('./verifyData');
const {filterDept,objAverage,arrAverage, sortby} = require('./filterData');
const datapath = path.join(__dirname,'/DATA/data.json');
const writepath = path.join(__dirname,'/DATA/report.csv');

function findMax(a , key){
    let max = 0;
    a.map((e)=>{
     if(e[key] > max) max = e[key];   
    })
    return max;
}

function findMin(a, key){
    let min = Infinity;
    a.map((e)=>{
     if(e[key] < min) min = e[key];   
    })
    return min;
}

router.get('/',exists,(req,res)=>{
    const emp = require(datapath);
    // emp.sort((a,b)=>a.salary-b.salary);
    sortby(emp,'salary',1);
    console.log(emp);
    res.send(emp);    
});

router.get('/report/download',exists,(req,res)=>{
    // fs.writeFileSync('./DATA/report.csv', '');
    const emp = require(datapath);
    const deptObj = {};
    emp.map(e=>{
        deptObj[e.department] = [];
    });
    emp.map(e=>{
        deptObj[e.department].push(e.salary);
    });
    console.log(deptObj);
    const output = [];
    Object.keys(deptObj).forEach(key=>{
        const avg = arrAverage(deptObj[key]);
        // console.log(avg);
        output.push({department:key,totalSalaryExpenditure:avg[0],deptAvg:avg[1].toFixed(2)});
        console.log(output);
    });
    const csvData = csvjson.toCSV(JSON.stringify(output),{headers:'key'});
    console.log(csvData);

    fs.writeFile(writepath,csvData,(err)=>{
        if(err){
            console.log(err);
            res.end('Could not generate file');
        }else{
            res.download(writepath);
        }
    });
});

router.get('/top',exists,(req,res)=>{
    const emp = require(datapath);
    // emp.sort((a,b)=>b.salary-a.salary);
    sortby(emp,'salary',-1);
    let i=3;
    for(let i=3;i<emp.length && emp[i].salary===emp[i-1].salary;i++){}    // while(i<emp.length && emp[i].salary===emp[i-1].salary){i++;}
    res.send(emp.slice(0,i));
    
});

router.get('/average',exists,(req,res)=>{
    const emp = require(datapath);
    const avg = objAverage(emp,'salary');
    res.send(`Total Salary to be distributed: $${avg[0]}\nAverage employee salary: $` + avg[1].toFixed(2));
});

router.get('/average/dept/all',exists,(req,res)=>{
    const emp = require(datapath);
    const deptObj = {};
    emp.map(e=>{
        deptObj[e.department] = [];
    });
    emp.map(e=>{
        deptObj[e.department].push(e.salary);
    });
    console.log(deptObj);
    const output = [];
    Object.keys(deptObj).forEach(key=>{
        const avg = arrAverage(deptObj[key]);
        // console.log(avg);
        output.push({department:key,average:avg[1].toFixed(2)});
    })
    res.send('Department wise average salary:'+JSON.stringify(output));
})

router.get('/average/dept',exists,(req,res)=>{
    const dept = req.query.name;
    const emp = require(datapath);
    const deptList = filterDept(emp,dept);
    const avg = objAverage(deptList,'salary');
    res.send(`Average salary in ${dept} department is $${avg[1].toFixed(2)}`);
})

router.get('/dept',exists,(req,res)=>{
    const dept = req.query.name;
    const emp = require(datapath);
    const a = filterDept(emp,dept);
    console.log(a);
    const max = findMax(a, 'salary');
    const min = findMin(a, 'salary');
    res.send(`Max sal:${max}\nMin sal:${min}`);
})

module.exports = router;