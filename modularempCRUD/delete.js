const express = require('express');
const router = express();
const fs = require('fs');
const path = require('path');
const {exists,jwtAuth, isAdmin, findEmp, checkIndex} = require('./verifyData.js');
const datapath = path.join(__dirname,'/DATA/data.json');


// function exists(req,res,next){
//     if(!fs.existsSync(datapath)){
//         res.send('no employee present in company');    
//     }else{
//         next();
//     }
// }
router.delete('/all',jwtAuth,exists, (req, res)=>{
    if(isAdmin(req)){
        const employees = require(datapath);
        employees.splice(0, employees.length);
        fs.writeFileSync(datapath,JSON.stringify(employees));
        res.send(`All employees deleted`);
    }else{
        res.send('You do not have the required access')
    }
})

router.delete('/:id',jwtAuth,exists, (req, res) => {
    if(isAdmin(req)){
        const employees = require(datapath);
        const id = parseInt(req.params.id);
        // const index = employees.findIndex((ele) =>ele.id === id);
        const index = findEmp(employees,'id',id);
        // if (index === -1) {//-------------------------------------
        //     res.send('Employee doesnt Exist');
        // }
        // else {
        checkIndex(index,'Employee doesnt Exist',res);
        employees.splice(index, 1);
        fs.writeFileSync(datapath,JSON.stringify(employees));
        res.send(`employee details deleted`);
        // }
    }else{
        res.send('You do not have authorization to delete data');
    }
})



module.exports = router;