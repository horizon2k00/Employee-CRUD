const express = require('express');
const { average } = require('./modularempCRUD/filterData');
const app = express();
// require('dotenv').config();
// const bcrypt = require('bcrypt');
// const emp = require('./modularempCRUD/DATA/data.json');
// const process =  require('process');
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const a = {
    name:"ksh",
    age:20
}
const b = a;
b.name='kaif';
console.log(a);
// date.setTime(a);
// console.log(date.toString());
// console.log(a);
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
// // })
// const d = new Date();
// console.log(new Date().toDateString().slice(4,15));

// s = d.toDateString();
// final = s.slice(4,s.length);
// console.log(final);
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
// const array = [{n:'a',a:12},{n:'c',a:10},{n:'c',a:16},{n:'c',a:12},{n:'a',a:12},{n:'b',a:18},{n:'c',a:12},{n:'b',a:11},{n:'a',a:15}];
// const obj = {};
// array.map(e=>{
//     const a = e.a;
//     obj[e.n]=[];
// })
// array.map(e=>{
//     obj[e.n].push(e.a);
// })
// console.log(obj);
// const output = [];
// Object.keys(obj).forEach(key=>{
//     let tot = 0;
//     obj[key].map(e=>{
//         tot+=e;
//     })
//     const avg = tot/obj[key].length;
//     console.log(avg);
//     output.push({name:key,average:avg});

// })
// console.log(output);

// console.log(typeof(NaN));