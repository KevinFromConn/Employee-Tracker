// Dependencies
const express = require("express");
const db = require("./db/connection");
const table = require("console.table");
const inquirer = require("inquirer");
const { addSnapshotSerializer } = require("expect");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Prompt for the user, initiates Inquirer
const initialPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Exit Choices List",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "View All Departments":
          viewAllDepartments();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "View All Employees":
          viewAllEmployees();
          break;

        case "Add a Department":
          addDepartment();
          break;

        case "Add a Role":
          addRole();
          break;

        case "Add an Employee":
          addEmployee();
          break;

        case "Update an Employee Role":
          updateEmployeeRole();
          break;

        case "Exit Choices List":
          console.log("Thank you for using my Employee Tracker!");
          db.end();
          break;
      }
    });
};

const viewAllDepartments = () => {
    const sql = `SELECT id, name AS department FROM department`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        initialPrompt();
    });
};

const viewAllRoles = () => {
    const sql = `SELECT
                 role.id,
                 role.title AS "Title",
                 role.salary AS "Salary",
                 department.name AS "Department"
                 FROM role
                 LEFT JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        initialPrompt();
    });
};

const viewAllEmployees = () => {
    const sql = `SELECT employee.id,
                 employee.first_name AS "First Name",
                 employee.last_name AS "Last Name",
                 role.title AS "Title",
                 department.name AS "Department",
                 role.salary AS "Salary,
                 CONCAT (e.first_name, " ", e.last_name) AS "Manager"
                 FROM employee
                 INNER JOIN role ON employee.role_id = role.id
                 LEFT JOIN department ON role.department_id = department.id
                 LEFT JOIN employee e ON employee.manager_id = e.id
                 ORDER BY employee.id;
                 `;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        initialPrompt();
    });
};

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
