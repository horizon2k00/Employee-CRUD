const fs = require('fs');
const path = require('path');
//gets emp data from filepath
function getEmp() {
    const datapath = path.join(__dirname, '../DATA/data.json');
    return JSON.parse(fs.readFileSync(datapath));
}

//gets changelog from file path
function getChangeLogs() {
    const changepath = path.join(__dirname, '../DATA/changeLog.json');
    return require(changepath);
}

// function takes emp array and dept name and returns array of objects whose department param is dept
function filterDept(emp, dept) {
    const a = emp.filter((e) => e.department === dept);
    return a;
}

//array avg function takes emp array returns [a,b] where a is total and b is average in an array of numbers
function arrAverage(emp) {
    let tot = 0;
    emp.map(element => {
        tot += element;
    });
    return [tot, tot / emp.length];
}

//function takes emp array and key and returns [a,b] where a is total and b is average of emp.key data
function objAverage(emp, key) {
    let tot = 0;
    emp.map(element => {
        tot += element[key];
    });
    return [tot, tot / emp.length];
}

//sorts array of objects by any key(param)
function sortby(list, param, order) {
    list.sort((a, b) => {
        if (order === 1 || order !== -1) {
            if (a[param] < b[param]) {
                return -1;
            } else if (a[param] === b[param]) {
                return 0;
            } else return 1;
        } else {
            if (a[param] > b[param]) {
                return -1;
            } else if (a[param] === b[param]) {
                return 0;
            } else return 1;
        }
    });
}

//takes employee array, page and limit per page and returns array of employees in that page with specified limit
function paginate(employees, page, limit) {
    limit = parseInt(limit);
    if (!limit) {
        limit = 5;
    }
    page = parseInt(page);
    if (!page || page < 1) {
        page = 1;
    }
    if (page * limit > employees.length) {
        page = Math.ceil(employees.length / limit);
    }
    const returnList = employees.slice((page - 1) * limit, page * limit);
    return returnList;
}

module.exports = { getEmp, getChangeLogs, filterDept, objAverage, arrAverage, sortby, paginate };