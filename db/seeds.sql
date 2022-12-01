INSERT INTO department (id, name)
VALUES (001, "Sales"),
       (002, "Legal"),
       (003, "Finance"),
       (004, "Engineering");
       
INSERT INTO role (id, title, salary, department_id)
VALUES (001, "Sales Lead", 80000, 001),
       (002, "Sales Person", 65000, 001),
       (003, "Accountant", 100000, 003),
       (004, "Lawyer", 130000, 002),
       (005, "Software Engineer", 200000, 004);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (001, "Arthur", "Miller", 001),
       (002, "Chinua", "Achebe", 001),
       (003, "Margaret", "Atwood", 002),
       (004, "Gabriel", "Garcia Marquez", 003),
       (005, "Simone", "de Beauvoir", 004);
