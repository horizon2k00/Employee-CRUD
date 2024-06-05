function filterDept(emp,dept){
    const a = emp.filter((e)=>e.department === dept);
    return a;
}

function arrAverage(emp){
    let tot = 0;
    emp.map(element => {
        // console.log(element);
        tot += element;
    });
    // console.log(tot/emp.length);
    return [tot,tot/emp.length];
}

function objAverage(emp,key){
    let tot = 0;
    emp.map(element => {
        // console.log(element);
        tot += element[key];
    });
    // console.log(tot/emp.length);
    return [tot,tot/emp.length];
}

function sortby(list,param,order){
    list.sort((a,b)=>{
        if(order === 1 || order !== -1){
            if(a[param]<b[param]){
                return -1;
            }else if(a[param]===b[param]){
                return 0;
            }else return 1;
        }else{
            if(a[param]>b[param]){
                return -1;
            }else if(a[param]===b[param]){
                return 0;
            }else return 1;
        }
    });
}
// function average(emp)

module.exports = {filterDept,objAverage,arrAverage,sortby};