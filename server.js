const connection = require('./config/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const chalk = require('chalk');
const figlet = require('figlet');


    connection.connect((error) => {
        if (error) throw error;
        optionsPrompt();
    })

    const optionsPrompt = () => {
        inquirer
        .prompt([
            {
                type: "list",
                name: "selection",
                message: "What would you like to do?",
                choices: [
                    "View All Employees",
                    "Add Employee",
                    // "Update Employee Role",
                    "View All Roles",
                    "Add Role",
                    "View All Departments",
                    "Add Department"
                ]
            }
        ]).then((answers) => {
            const {selection} = answers;

                if (selection === "View All Employees"){
                    viewAllEmployees();
                }

                if (selection === "Add Employee"){
                    addEmployees();
                }

                if (selection === "Update Employee Role"){
                    updateEmployeeRole();
                }

                if (selection === "View All Roles"){
                    viewAllRoles();
                }

                if (selection === "Add Role"){
                    addRole();
                }

                if (selection === "View All Departments"){
                    viewAllDepartments();
                }

                if (selection === "Add Department"){
                    addDepartment();
                }
        });
}

const viewAllEmployees = () => {
    let sql =    `SELECT employee.id, 
                  employee.first_name, 
                  employee.last_name, 
                  role.title, 
                  department.department_name AS 'department', 
                  role.salary
                  FROM employee, role, department 
                  WHERE department.id = role.department_id 
                  AND role.id = employee.role_id
                  ORDER BY employee.id ASC`;
    connection.promise().query(sql, (error, response) => {
        console.table(response);
        optionsPrompt();
    })
};

const addEmployees = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employees first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employees last name?"
        }
    ])
    .then(answers => {
        const names = [answers.firstName, answers.lastName]
        connection.promise().query(`SELECT role.id, role.title FROM role`, (error, data) => {
            const rolesDetail = data.map(({ id, title }) => ({ name: title, value: id}));
            inquirer.prompt([
                {
                    type: "list",
                    name: "employeeRole",
                    message: "What is the employees role?",
                    choices: rolesDetail
                }
            ])
            .then(chosenRole => {
                const role = chosenRole.employeeRole;
                names.push(role);
                connection.promise().query(`SELECT * FROM employee`, (data) => {
                    const managerOptions = data.map(({ id, firstName, lastName }) => ({ name: firstName + " "+ lastName, value: id }));
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'managerName',
                            message: "Who is the employee's manager?",
                            choices: managerOptions
                          }
                    ])
                    .then(chosenManager => {
                        const manager = chosenManager.managerName;
                        names.push(manager);
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;
                        connection.query(sql, names, (error) => {
                            console.log("An Employee has been added to the table")
                            optionsPrompt();
                        })
                    })
                })
            })
        })
    })
};

// const updateEmployeeRole = () => {
//     let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
//     FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
//     connection.promise().query(sql, (response) => {
//         let employeeNames = [];
//         response.forEach((employee) => {employeeNames.push(`${employee.first_name} ${employee.last_name}`);});

//         connection.promise().query(`SELECT role.id, role.title FROM role` (response) => {
//             let roles = [];
//             response.forEach((role) => {roles.push(role.title);});
//             inquirer.prompt([
//                 {
//                     name: 'selectedEmployee',
//                     type: 'list',
//                     message: 'Which employee has a new role?',
//                     choices: employeeNames
//                   },
//                   {
//                     name: 'selectedRole',
//                     type: 'list',
//                     message: 'What is their new role?',
//                     choices: roles
//                   }
//                 ])
//                 .then  ((answer) => {
//                     let newTitle, employee;

//                     response.forEach((role) => {
//                         if (answer.selectedRole == role.title){
//                             newTitle = role.id
//                         }
//                     })
//                 })
//         })


//     })
// }

const viewAllRoles = () => {
    let sql =    `SELECT role.title, 
                  role.id, 
                  department.name AS 'department', 
                  role.salary
                  FROM role
                  INNER JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql, (response) => {
        console.table(response);
        optionsPrompt();
    });
};


const addRole = () => {
    let sql =    `SELECT role.title, 
                  role.id, 
                  department.name AS 'department', 
                  role.salary
                  FROM role
                  INNER JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql, (response) => {
        console.table(response);
        optionsPrompt();
    });
};

const viewAllDepartments = () => {
    let sql =    `SELECT department.id AS id, 
                  department.name AS 'department'
                  FROM department`;
    connection.promise().query(sql, (response) => {
        console.table(response);
        optionsPrompt();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'Department',
            type: 'input',
            message: 'What is the name of the new Department?'
        }
    ])
    .then((answers) => {
        connection.query(`INSERT INTO department (department_name) VALUES (?)`, answers.Department, (error) => {
            if (error) throw error;
            optionsPrompt();
        } )
    })
}