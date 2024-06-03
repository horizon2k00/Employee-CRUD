const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const datapath = path.join(__dirname,'/DATA/data.json');

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

router.get('/',(req,res)=>{
    const emp = require(datapath);
    emp.sort((a,b)=>a.salary-b.salary);
    console.log(emp);
    res.send(emp);    
});

router.get('/top',(req,res)=>{
    const emp = require(datapath);
    emp.sort((a,b)=>b.salary-a.salary);
    let i=3;
    // while(i<emp.length && emp[i].salary===emp[i-1].salary){
    //     i++;
    // }
    for(let i=3;i<emp.length && emp[i].salary===emp[i-1].salary;i++){}
    res.send(emp.slice(0,i));
    
});

router.get('/average',(req,res)=>{
    const emp = require(datapath);
    let tot = 0;
    emp.map(element => {
        tot += element.salary;
    });
    let avg = tot/emp.length;
    res.send('Average employee salary: $' + avg.toFixed(2));
});

router.get('/dept/:param',(req,res)=>{
    const param = req.params.param
    const emp = require(datapath);
    const a = emp.filter((e)=>e.department === param);
    console.log(a);
    const max = findMax(a, 'salary');
    const min = findMin(a, 'salary');
    res.send(`<div>Max sal:${max}</div><div>Min sal:${min}</div>`);

})

module.exports = router;