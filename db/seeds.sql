USE employee_tracker;

-- Department Seeds --

INSERT INTO department (id, name)
VALUES (1, "Sales");

INSERT INTO department (id, name)
VALUES (2, "Engineering");

INSERT INTO department (id, name)
VALUES (3, "Finance");

INSERT INTO department (id, name)
VALUES (4, "Legal");

-- Role Seeds --

INSERT INTO role (title, salary, department_id)
VALUES
("CEO", 500000.00, NULL),
("Lead Engineer", 250000.00, 2),
("Engineer", 150000.00, 2),
("Legal Team Lead", 125000.00, 4),
("Lawyer", 110000.00, 4),
("Sales Lead", 85000.00, 1),
("Salesperson", 60000.00, 1),
("Finance Lead", 150000.00, 3),
("Accountant", 100000.00, 3);

-- Employee Seeds --

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("John", "Doe", 6, NULL),
("Mike", "Chan", 2, NULL),
("Ashley", "Rodriguez", 3, 2),
("Kevin", "Tupik", 3, 2),
("Elzar", "Mann", 5, 6),
("Malia", "Brown", 4, NULL),
("Sarah", "Lourd", 5, 6),
("Tom", "Allen", 7, 1),
("Reath", "Silas", 8, NULL),
("Tammer", "Galal", 9, 9),
("Rudy", "Rutabaga", 1, NULL);