const express = require('express');
const app = express();
const port = 3000;
// const fs = require('fs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const path = require('path');
// const datapath = path.join(__dirname,'/DATA/data.json');

// if(!fs.existsSync(datapath)){
//     fs.writeFileSync(datapath,'[]');
// }

const read = require('./read.js');
app.use('/emp',read);

const update = require('./update.js');
app.use('/update',update);

const del = require('./delete.js');
app.use('/delete',del);

const useCreate = require('./create.js');
app.use('/create',useCreate);

const useLogin = require('./login.js');
app.use('/login',useLogin);

const salaryList = require('./topSalary.js');
app.use('/salarylist', salaryList);

app.listen(port, () => {
    console.log(`listening to port ${port}`);
})