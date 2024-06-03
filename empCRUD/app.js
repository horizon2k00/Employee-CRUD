const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
const datapath = path.join(__dirname,'./DATA/data.json');
 
if(!fs.existsSync(datapath)){
  fs.writeFileSync(datapath,'[]');
}
const employees = require(datapath);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/create', (req, res) => {
    const newEmp = req.body;
    if(employees.findIndex((e)=>e.id===newEmp.id) !== -1){
        res.send('Employee id is not unique');
    }else{
        employees.push(newEmp);
        // console.log(employees);
        fs.writeFileSync(datapath,JSON.stringify(employees));
        res.send('Employee added sucessfully');
    }
})
app.get('/emp', (req, res) => {
    if(employees.length === 0 ){
        res.send('no employee present in company');
    }else{
        res.send(JSON.stringify(employees));
    }
})

app.put('/update/emp-:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = employees.findIndex((ele) =>ele.id === id);
    if (index === -1) {
        res.send('invalid employee');
    }
    else {
        const { name, age, position, department, salary } = req.body;
        if (name) employees[id - 1].name = name;
        if (age) employees[id - 1].age = age;
        if (position) employees[id - 1].position = position;
        if (department) employees[id - 1].department = department;
        if (salary) employees[id - 1].salary = salary;
        // const updated = req.body;
        // employees[index] = {...employees[index],...updated};
        fs.writeFileSync(datapath,JSON.stringify(employees));
        res.send(`employee details updated: \n` + `${JSON.stringify(employees)}`);
        console.log(employees);
    }
})

app.delete('/delete/emp-:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = employees.findIndex((ele) =>ele.id === id);
    if (index === -1) {
        res.send('Employee doesnt Exist');
    }
    else {
        employees.splice(index, 1);
        fs.writeFileSync(datapath,JSON.stringify(employees));
        res.send(`employee details deleted`);
    }
})

app.get('/emp/:id', (req, res) => {
    const iden = parseInt(req.params.id);
    // console.log(iden);
    const index = employees.findIndex((ele) =>ele.id === iden);
    // console.log(index);
    if(index === -1) res.send('Employee Doesnt exist');
    else res.send(`Employee id ${iden} \n ${JSON.stringify(employees[index])}`);
})

app.listen(port, () => {
    console.log(`listening to port ${port}`);
})