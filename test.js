const express = require('express');
const app = express();
// require('dotenv').config();
const bcrypt = require('bcrypt');
const emp = require('./modularempCRUD/DATA/data.json');
// const process =  require('process');
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// console.log('code start');

// app.get('/',(req,res, next)=>{
//     console.log('root');
//     res.end();
// });
// app.get('/a',(req,res)=>{
//     console.log('route a');
//     res.end();
// })

// app.listen(5555,()=>{
//     console.log(`listening to port 5555`);
// })

const a = [1,2,3,4,5,6,7,8,1,2,3,4,6,4,2,1];
const res = a.filter((x)=>x>4);
console.log(Math.max(...a));
// console.log(res);
// a.sort();
// console.log(a);
// console.log(res);

// const name = 'name';
// console.log(emp[0][name]);
// const a = "";
// const b = 122;
// if(!a || !b){
//     console.log('empty is true');
// }else{
//     console.log('empty is false');

// }


// function authorizedUser(payload, empData,specifyAuth){
//     if(!specifyAuth) {
//         specifyAuth=1;
//     }
//     if(payload.privilege === 'admin' && empData.email === payload.email){
//         return true;
//     }else if(payload.privilege === 'admin'){
//         if(specifyAuth === 1) return true;
//         else if(specifyAuth === 'admin') return true;
//         else return false;
//     }else if(empData.email === payload.email){
//         if(specifyAuth === 1) return true;
//         else if(specifyAuth === 'personal') return true;
//         else return false;
//     }else return false;
// }

// const pay = {
//     privilege:"admin",
//     email:"email1"
// }
// const emp = {
//     email:"email"
// }
// console.log(authorizedUser(pay,emp,'personal'));


// let regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]*$/;
// const format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

// const pass = 'pass123!';
// let enc = '';
// async function encrypt(){
//     enc = bcrypt.hash(pass,5);
//     return enc;
// }
// console.log('2: ' + enc);
// encrypt().then((hash)=>{
//     console.log('completed encryption: ' + hash);
// })
// console.log('1:  ' + enc);

// if(false){
//     bcrypt.hash(pass,5).then((hash)=>{
//         console.log(hash);
//         enc = hash;
//     })
// }

// console.log(process);



