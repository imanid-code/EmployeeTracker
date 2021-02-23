drop database if exists employee_db;

create database employee_db;

use employee_db;

create table department(

id integer not null auto_increment,
name varchar(30),
primary key (id)
);

create table role (

id integer not null auto_increment,
title varchar(20),
salary decimal(8,2),
deparment_id integer not null,
primary key (id)
);

create table employee (
id integer not null auto_increment,
first_name varchar(30),
last_name varchar(30),
role_id integer not null , 
manager_id integer , 
primary key (id)
);

select * from department;
select * from role;
select * from employee;

