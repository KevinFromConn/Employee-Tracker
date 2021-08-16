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
("CEO", 500000.00, 1),
("Lead Engineer", 250000.00, 2),
("Engineer", 150000.00, 2),
("Legal Team Lead", 125000.00, 3),
("Lawyer", 110000.00, 3),
("Sales Lead", 85000.00, 4),
("Salesperson", 60000.00, 4),
("Finance Lead", 150000.00, 5),
("Accountant", 100000.00, 5);

-- Employee Seeds --

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("John", "Doe", 1, NULL),
("Mike", "Chan", 1, 1),
("Ashley", "Rodriguez", 2, NULL),
("Kevin", "Tupik", 2. 3),
("Elzar", "Mann", 1, 1),
("Malia", "Brown", 3, NULL),
("Sarah", "Lourd", 4, NULL),
("Tom", "Allen", 4, 7),
("Reath", "Silas", 3, 6),
("Tammer", "Galal", 2, 3);