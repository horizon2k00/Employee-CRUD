const express = require('express');
const router = express();
const fs = require('fs');
const { isAdmin, findEmp, checkIndex } = require('./modules/verifyData.js');
const { getEmp } = require('./modules/filterData.js');
const path = require('path');
const datapath = path.join(__dirname, './DATA/data.json');

//route deletes all employee data from data file
router.delete('/all', (req, res) => {
    if (isAdmin(req)) {
        const employees = getEmp();
        employees.splice(0, employees.length);
        fs.writeFileSync(datapath, JSON.stringify(employees));
        res.send(`All employees deleted`);
    } else {
        res.send('You do not have the required access')
    }
})

//route deletes data of employee with specified id 
router.delete('/:id', (req, res) => {
    if (isAdmin(req)) {
        const employees = getEmp();
        const id = parseInt(req.params.id);
        const index = findEmp(employees, 'empId', id);
        checkIndex(index, 'Employee doesnt Exist', res);
        employees.splice(index, 1);
        fs.writeFileSync(datapath, JSON.stringify(employees));
        res.send(`employee details deleted`);
    } else {
        res.send('You do not have authorization to delete data');
    }
})

module.exports = router;