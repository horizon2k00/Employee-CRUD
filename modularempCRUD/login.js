const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');
const { findEmp, checkIndex } = require('./modules/verifyData.js');
const { getEmp } = require('./modules/filterData.js');
dotenv.config({ path: path.resolve(__dirname, './.env') });

//route verifies email and password and sends jwt access token on successful verification
router.post('/', (req, res) => {
    const employees = getEmp();
    const { email, password } = req.body;
    const index = findEmp(employees, 'email', req.body.email);
    checkIndex(index, 'Invalid Email', res);
    bcrypt.compare(password, employees[index].password).then((result) => {
        if (result) {
            const secretKey = process.env.SECRET_KEY;
            const payload = {
                email,
                audience: 'employee storage',
                privilege: employees[index].privilege
            };
            const token = jwt.sign(payload, secretKey);
            console.log(token);
            res.append('access_token', token);
            res.send('Successfully logged in');
        } else {
            res.send('Password Incorrect');
        }
    });
});

module.exports = router;