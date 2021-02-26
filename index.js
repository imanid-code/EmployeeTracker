const mysql = require("mysql");
const inquirer = require("inquirer");
const figlet = require("figlet");


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'employee_db'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('connected');
    // figlet
    askQuestions();
});

function askQuestions() {
    inquirer.prompt({
        name: "todo",
        type: "rawlist",
        message: "Choose what you would like to do: ",
        choices: [
            "View All Employees",
            "View All Departments",
            "View All Roles",
            //save later for more practice 
            // "View All Employees by Manager",
            // "View All Employees by Department",
            // "View All Employees by Roles",
            "Add employee",
            "Add Department",
            "Add role",
            "Update role",
            "Update employee manager",
            "Remove Employee",
            "Exit"
        ],
    }).then(answer => {
        switch (answer.todo) {
            case "View All Employees":
                viewAllEmployees();
                break;

            case "View All Departments":
                viewAllDepartments();
                break;

            case "View All Roles":
                viewAllRoles();
                break;

            // case "View All Employees by Manager":
            //     viewByManager();
            //     break;

            // case "View All Employees by Department":
            //     viewByDepartment();
            //     break;

            // case "View All Employees by Roles":
            //     viewEmployeesbyRole();
            //     break;

            case "Add Employee":
                addEmployee();
                break;

                case "Update role":
                    updateRole();
                    break;

                case "Add Department":
                    addDepartment();
                    break;
            case "Add role":
                addRole();
                break;

            case "Update employee manager":
                updateManager()
                break;

            case "Remove Employee":
                removeEmployee();
                break;

            case "Exit":
                connection.end();
                break


        }
    });
}

function viewAllEmployees() {
    // let query = "SELECT employee.id, concat(employee.first_name, '', employee.last_name) AS Name, role.title AS Job_Title, ";
    // query += "department.name AS Department, role.salary, concat(employee.first_name,'', employee.last_name) AS Manager_Name FROM employee, role, department ";
    // query += "INNER JOIN role  ON role.id = employee.role_id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee ";
    // query += "ON employee.manager_id = employee.id INNER JOIN employee ON role.id = employee.role_id ORDER BY id"
    let query = "SELECT employee.id, concat(employee.first_name, '', employee.last_name) AS Name, role.title AS Job_Title, ";
    query += "department.name AS Department, role.salary, concat(manager.first_name, '', manager.last_name) AS Manager_Name ";
    query += "FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ";
    query += "LEFT JOIN employee manager on manager.id = employee.manager_id "
    connection.query(query, function(error, data){
        if (error) throw error;
        console.table(data);
        askQuestions();
    })
}

function addEmployee(){
    connection.query("SELECT title from employee_db.role;", function(err, data){
        if(err) throw err;
        let arrayOfRole = [];
        inquirer.prompt([
            {
                name: "role",
                type: "rawlist",
                choices: function () {
                    for (let i =0; i< data.length; i++){
                        arrayOfRole.push(data[i].title);
                    }
                    return arrayOfRole;
                },
                message: "What is the role of the employee?"
            },
            {
                name:"firstname",
                type:"input",
                message: "What is the employee's first name?",
            },
            {
                name:"lastname",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name:"manager",
                type: "number",
                message: "What is the employee's manager ID#?"
            }
        ]) 
        .then(function(respone){
            connection.query("INSERT INTO employee SET ?",
            {
                first_name: respone.firstname,
                last_name: respone.lastname,
                role_id: arrayOfRole.indexOf(answer.role)+1,
                manage_id: answer.manager
            });
            askQuestions();
        });
    });
}


function viewAllDepartments(){
    let query= "SELECT name AS Department, sum(salary) AS Annual_Total FROM employee_db.employee "
    query += "INNER JOIN employee_db.ROLE ON role.id = employee.role_id "
    query += "INNER JOIN employee_db.department ON role.department_id GROUP BY department.name "

    connection.query(query, function(err, data){
        if (err) throw err;
        console.table(data);
        askQuestions();
    });
}

function addDepartment(){
    inquirer.prompt(
        {
            name:"department",
            type: "input",
            message: "What is the name of the  department you want to add?"
        }
    ).then(function(respone){
        let query = "INSERT INTO department SET ?"
        connection.query(query, {name: respone.department}, function(err){
            if (err) throw err;
            askQuestions();
        });
    });
}

function viewAllRoles(){
    let query = "SELECT role.title AS TITLE, name AS Department, role.salary AS Salary FROM employee_db.department ";
    query += "INNER JOIN employee_db.role ON employee_db.department.id = employee_db.role.department_id; ";
    connection.query(query, function(error, data){

   
    if (error) throw error;
    console.table(data);
    askQuestions();
})
}


function addRole(){
let query = "SELECT name FROM employee_db.department";

connection.query(query, function(err, data){
    if (err) throw err;
    let departmentArray = [];
    inquirer.prompt([
        {
            name:"department",
            type:"rawList",
            choices: function(){
                for (let i =0; i< data.length; i++){
                    departmentArray.push(data[i].name);
                }
                return departmentArray;
            },
            message: "What department are you adding the new role to?"
        },
        {
            name:"role",
            type: "input",
            message: "what is the name of the new role?"
        },
        {
            name:"salary",
            type: "number",
            message: "What is the starting salary for the new role?"
        }
       
    ]).then(function(response){
        let query = "INSERT INTO ROLE SET ?";
        connection.query(query, {
            title: response.role,
            salary: response.salary,
            department_id: departmentArray.indexOf(response.department)+1
        }, function(error){
            if (error) throw error;
            askQuestions();
        })
    })
})
}

function updateRole(){
    let query = "SELECT DISTINCT emp1.id, concat(emp1.first_name, '', emp1.last_name) AS Employee, ro1.title AS Job_Title,";
    query += "dep1.name AS Department, ro1.salary, concat(man1.first_name,'',  man1.last_name) AS Manager_Name FROM employee emp1";
    query += "INNER JOIN role ro1 ON ro1.id = emp1.role_id INNER JOIN department dep1 ON ro1.department_id = dep1.id LEFT JOIN employee man1";
    query += "ON emp1.manager_id = man1.id INNER JOIN employee emp2 ON ro1.id = emp1.role_id ORDER BY id"

    connection.query(query, function(err, data){
        if(err) throw err;
        let employeeArray = [];
        let roleArray = []; 
        inquirer.prompt([
            {
                name:"Employeechoice",
                type:"list",
                choices: function(){
                    for (let i = 0; i< data.length; i++){
                        employeeArray.push(data[i].Employee)
                    }
                    return employeeArray;
                },
                message: "Update role with the following options? "
            },
            {
                name:"updateRole",
                type: "list",
                choices : function(){
                    for (let i = 0; i < data.length; i++){
                        roleArray.push(data[i].Job_title)
                    }
                    return roleArray;
                },
                message: "Choose new role"
            }
        ])
        .then(function(respone){
            connection.query("UPDATE role SET title = ? where id = ?", [respone.updateRole, employeeArray.indexOf(respone.update)])
        })
   })
}
function updateManager(){
    let query = "SELECT DISTINCT emp1.id, concat(emp1.first_name, '', emp1.last_name) AS Employee, ro1.title AS Job_Title,";
    query += "dep1.name AS Department, ro1.salary, concat(man1.first_name,'',  man1.last_name) AS Manager_Name FROM employee emp1";
    query += "INNER JOIN role ro1 ON ro1.id = emp1.role_id INNER JOIN department dep1 ON ro1.department_id = dep1.id LEFT JOIN employee man1";
    query += "ON emp1.manager_id = man1.id INNER JOIN employee emp2 ON ro1.id = emp1.role_id ORDER BY id"

    connection.query(query, function(err, data){
        if(err) throw err;
        let employeeArray = [];
        let managerArray = [];
        inquirer.prompt([
            {
                name:"updateEmployee",
                type: "list",
                choices: function(){
                    for (let i = 0; i < data.length; i++){
                        employeeArray.push(data[i].Employee)
                    }
                    return employeeArray;
                },
                message: "Which employee would you like to update the manager for?"
            },
            {
                name:"updatemanager",
                type: "list",
                choices: function (){
                    for (let i = 0; i < data.length; i++){
                        managerArray.push(data[i].Manager_Name)
                    }
                    return managerArray;
                },
                    message: "Choose new manager"
            }
        ]).then(function(respone){
            connection.query("UPDATE employee SET manager_id = ? WHERE id = ?",[respone.updatemanager, employeeArray.indexOf(respone.updateEmployee)+1 ] );
            askQuestions();
        })
    })

}



function removeEmployee(){
    let query = "SELECT DISTINCT employee.id, concat(employee.first_name, '', employee.last_name) AS name FROM employee"
    connection.query(query, function (error, data){
        if (error) throw error;
        console.log(data);
        let employeeArray = [];
        for(i = 0; i < data.length; i++){
            let employeeObj = {
                name: data[i].name,
                value: data[i].id
            }
            employeeArray.push(employeeObj);
        }
        console.log(employeeArray);
        inquirer.prompt([
            {
                name:"delete",
                type: "rawlist",
                message: "Which employee would you like to delete?",
                choices: employeeArray
            }
        ]).then(function(data){
            console.log(data);
            let query = "DELETE FROM employee WHERE employee.id = ?"
            connection.query(query, data.delete, function(err, data){
                if(err) throw err;
                console.log("Employee successfully deleted");
                askQuestions();
            })
        })
    })
}