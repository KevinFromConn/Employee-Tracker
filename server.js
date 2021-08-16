// Dependencies
const express = require("express");
const db = require("./db/connection");
const table = require("console.table");
const inquirer = require("inquirer");

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

// View departments function
const viewAllDepartments = () => {
  const sql = `SELECT id, name AS department FROM department`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    initialPrompt();
  });
};

// View roles function
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

// View employee function
const viewAllEmployees = () => {
  const sql = `SELECT employee.id,
                 employee.first_name AS "First Name",
                 employee.last_name AS "Last Name",
                 role.title AS "Title",
                 department.name AS "Department",
                 role.salary AS "Salary",
                 CONCAT(e.first_name, " ", e.last_name) AS "Manager"
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

// Add department function
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What department would you like to add?",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (name) VALUES (?)`;

      db.query(sql, answer.departmentName, (err, result) => {
        if (err) throw err;
        console.log(
          `You have entered ${answer.departmentName} into the database.`
        );
        initialPrompt();
      });
    });
};

// Add role function
const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addRole",
        message: "What role would you like to add?",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary for this role?",
      },
      {
        type: "input",
        name: "roleDepartment",
        message: "What is this role's department ID?",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO role SET ?`;

      db.query(
        sql,
        {
          title: answer.addRole,
          salary: answer.roleSalary,
          department_id: answer.roleDepartment,
        },
        (err, result) => {
          if (err) throw err;
          console.log(`You have entered ${answer.addRole} into the database.`);
          initialPrompt();
        }
      );
    });
};

// Add employee function
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employeeFirstName",
        message: "What is the new employee's first name?",
      },
      {
        type: "input",
        name: "employeeLastName",
        message: "what is the new employee's last name?",
      },
      {
        type: "input",
        name: "employeeRole",
        message: "What is the new employee's role ID?",
      },
      {
        type: "input",
        name: "employeeManagerID",
        message: "What is the new employee's manager ID?",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO employee SET ?`;

      db.query(
        sql,
        {
          first_name: answer.employeeFirstName,
          last_name: answer.employeeLastName,
          role_id: answer.employeeRole,
          manager_id: answer.employeeManagerID,
        },
        (err, result) => {
          if (err) throw err;
          console.log(
            `You have entered ${answer.employeeFirstName} ${answer.employeeLastName} into the database.`
          );
          initialPrompt();
        }
      );
    });
};

// Update employee role function
const updateEmployeeRole = () => {
  const employeeArray = [];
  const roleArray = [];

  db.query(
    `SELECT CONCAT (employee.first_name, " ", employee.last_name) AS employee from employee_tracker.employee`,
    (err, result) => {
      if (err) throw err;
      for (let i = 0; i < result.length; i++) {
        employeeArray.push(result[i].employee);
      }
      db.query(`SELECT title from employee_tracker.role`, (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
          roleArray.push(result[i].title);
        }
        inquirer
          .prompt([
            {
              type: "list",
              name: "name",
              message: "Whose role would you like to change?",
              choices: employeeArray,
            },
            {
              type: "list",
              name: "role",
              message: "What would you like their new role to be?",
              choices: roleArray,
            },
          ])
          .then((answers) => {
            let currentRole;
            const name = answers.name.split(" ");

            db.query(
              `SELECT id FROM employee_tracker.role WHERE title = "${answers.role}"`,
              (err, result) => {
                if (err) throw err;
                for (let i = 0; i < result.length; i++) {
                  currentRole = result[i].id;
                }
                db.query(
                  `UPDATE employee_tracker.employee SET role_id = "${currentRole}" WHERE first_name = "${name[0]}"`,
                  (err, result) => {
                    if (err) throw err;
                    console.log("You have successfully updated the role");
                    initialPrompt();
                  }
                );
              }
            );
          });
      });
    }
  );
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
    initialPrompt();
  });
});
