use employee_db;

insert into department(name) values ("HR"), ("Information technology"), ("Engineering"), ("Marketing");

select * from department;

insert into role (title,salary,department_id) values 
("Recruiter" , 45000.00 , 1),
("Benefits Representative" , 45000.00 , 1),
("Lead Recruiter" , 55000.00 , 1),
("IT Specialist" , 65000.00 , 2),
("Senior IT Specialist" , 85000.00 , 2),
("Front-End Developer" , 85000.00 , 3),
("Back-End Developer" , 85000.00 , 3),
("Full-Stack Developer" , 85000.00 , 3),
("Marketing Agent" , 60000.00 , 3),
("Social Media Specialist" , 60000.00 , 3),
("Senior Marketing Agent" , 80000.00 , 3);

select * from role;

select department.id, department.name, role.id, role.title, role.salary from department 
inner join role on role.department_id = department_id order by department.id, role.salary asc;

insert into employee (first_name, last_name, role_id) 
values 
("Dave", "Chapelle", 1),
("Chris", "Rock", 2),
("Jerry", "Seinfield", 3),
("Kevin", "Hart", 4),
("Eddie", "Murphy", 5),
("Robin", "Williams", 6),
("Tiffany", "Haddish", 7),
("Martin", "Lawerence", 8),
("George", "Lopez", 9),
("Bernie", "Mac", 10),
("Redd", "Foxx", 11);

select * from employee;


update employee set manager_id = 5 where id = 1;
update employee set manager_id = 5 where id = 2;
update employee set manager_id = 5 where id = 3;
update employee set manager_id = 7 where id = 4;
update employee set manager_id = 7 where id = 5;
update employee set manager_id = 7 where id = 6;
update employee set manager_id = 9 where id = 7;
update employee set manager_id = 9 where id = 8;
update employee set manager_id = 9 where id = 9;
update employee set manager_id = 11 where id = 10;
update employee set manager_id = 11 where id = 11;


select * from employee;

select employee.first_name, employee.last_name, department.name, role.title
from employee
inner join role on role.id= employee.role_id
inner join department on department.id = role.department_id
order by employee.id;


select distinct emp1.id, concat(emp1.first_name, '', emp1.last_name) as Employee,
ro1.title as Job_Title, dep1.name as department, ro1.salary, concat(man1.first_name, '', man1.last_name) as Manager_name
from employee emp1 inner join role ro1 on ro1.id = emp1.role_id inner join department dep1 on ro1.department_id = dep1.id
left join employee man1 on emp1.manager_id = man1.id
join employee emp2 on ro1.id = emp2.role_id order by id;

select department.name as Department, sum(salary) as Annual_Total
from employee_db.employee inner join employee_db.role on role.id = employee.role_id
inner join employee_db.department on role.department_id = department.id
group by department.name;

select role.title as Title, name as Department, role.salary as Salary
from employee_db.department
inner join employee_db.role on employee_db.department.id = employee_db.role.department_id

