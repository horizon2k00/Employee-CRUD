const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { jwtAuth, exists,verifyAdmin } = require('./modules/verifyData.js');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const fs = require('fs');
// const path = require('path');
// const datapath = path.join(__dirname,'/DATA/data.json');
// if(!fs.existsSync(datapath)){
//     fs.writeFileSync(datapath,'[]');}
//checks file exists and creates, not required anymore

const read = require('./read.js');
app.use('/emp', jwtAuth, exists, read);

const update = require('./update.js');
app.use('/update', jwtAuth, exists, update);

const del = require('./delete.js');
app.use('/delete', jwtAuth, exists, del);

const useCreate = require('./create.js');
app.use('/create', jwtAuth, useCreate);

const useLogin = require('./login.js');
app.use('/login', exists, useLogin);

const salaryList = require('./topSalary.js');
app.use('/salarylist', jwtAuth, verifyAdmin, exists, salaryList);

app.listen(port, () => {
    console.log(`listening to port ${port}`);
})