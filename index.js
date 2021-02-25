const mysql = require("mysql");
const prompt = require("inquirer");
const inquirer = require("inquirer");
const { allowedNodeEnvironmentFlags, exit } = require("process");


const connectObj = {
    host: "local host",
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'employee_db'
};

const connection = mysql.createConnection(connectObj);

connection.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log(`connect to the db as id ${connection.threadId}`)
    askQuestions();
});

function askQuestions() {
    inquirer.prompt({
        name: "todo",
        type: "rawList",
        message: "Choose what you would like to do: ",
        choices: [
            "View All Employees",
            "View All Departments",
            "View All Roles",
            // "View All Employees by Manager",
            // "View All Employees by Department",
            // "View All Employees by Roles",
            "Add employee",
            "Add Department",
            "Add role",
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
//put view employee func here
// function viewEmployee() {
//     let querr
// }

function addEmployee(){
    connection.query("SELECT title from employee_db.role;", function(err, data){
        if(err) throw 
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

//viewdepartment function here

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

//view roles 


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

// function updateManager(){

// }

