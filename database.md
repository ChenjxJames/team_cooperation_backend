# 数据库设计
* create database
  ```sql
  CREATE DATABASE team_cooperation;
  ```
* user  
  | name | class | length | not null | default |
  | :-: | :-: | :-: | :-: | :-: |
  | user_id | bigint |  | yes | AUTO_INCREMENT |
  | username | varchar | 32 | yes | |
  | password | varchar | 128 | yes | |
  | email | varchar | 255 | yes | |
  | phone | varchar | 11 | no | null |
  | create_time | datetime | | yes | CURRENT_TIMESTAMP |
  ```sql
  USE TEAM_COOPERATION;
  CREATE TABLE `user` (
    `user_id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(31) NOT NULL UNIQUE,
    `password` VARCHAR(127) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(11),
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  );
  ```
* team
  | name | class | length | not null | default |
  | :-: | :-: | :-: | :-: | :-: |
  | team_id | int |  | yes | AUTO_INCREMENT |
  | team_name | varchar | 31 | yes |  |
  | create_time | datetime | | yes | CURRENT_TIMESTAMP |
  ```sql
  CREATE TABLE `team` (
    `team_id` INT PRIMARY KEY AUTO_INCREMENT,
    `team_name` VARCHAR(31) NOT NULL,
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  );
  ```
* team_user
  | name | class | length | not null | default |
  | :-: | :-: | :-: | :-: | :-: |
  | team_id | int |  | yes |  |
  | user_id | bigint |  | yes |  |
  | role_id | int |  | yes |  |
  ```sql
  CREATE TABLE `team_user` (
    `team_id` INT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `role_id` INT NOT NULL,
    PRIMARY KEY (`team_id`, `user_id`)
  );
  ```
* role
  | name | class | length | not null | default |
  | :-: | :-: | :-: | :-: | :-: |
  | role_id | int | | yes | AUTO_INCREMENT |
  | role_name | varchar | 31 | yes | |
  * super admin
  * admin
  * member
  ```sql
  CREATE TABLE `role` (
    `role_id` INT PRIMARY KEY AUTO_INCREMENT,
    `role_name` VARCHAR(31) NOT NULL UNIQUE,
  );
  ```
* permission
  | name | class | length | not null | default |
  | :-: | :-: | :-: | :-: | :-: |
  | permission_id | int | | yes | AUTO_INCREMENT |
  | slug | varchar | 31 | yes | |
  ```sql
  CREATE TABLE `permission` (
    `permission_id` INT PRIMARY KEY AUTO_INCREMENT,
    `slug` VARCHAR(31) NOT NULL UNIQUE,
  );
  ```
* role_permission
  | name | class | length | not null | default |
  | :-: | :-: | :-: | :-: | :-: |
  | role_id | int | | yes | |
  | permission_id | int | | yes | |
  ```sql
  CREATE TABLE `permission` (
    `role_id` INT NOT NULL,
    `permission_id` INT NOT NULL,
    PRIMARY KEY(`role_id`,`permission_id`)
  );
  ```
* kanban 
  | name | class | length | not null | default |
  | :-: | :-: | :-: | :-: | :-: |
  | kanban_id | int | | yes | AUTO_INCREMENT |
  | team_id | int | yes | |
  | kanban_name | varchar | 31 | yes | |
  | create_time | datetime | | yes | CURRENT_TIMESTAMP |
  ```sql
  CREATE TABLE `kanban` (
    `kanban_id` INT PRIMARY KEY AUTO_INCREMENT,
    `team_id` INT NOT NULL,
    `kanban_name` VARCHAR(31) NOT NULL,
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  );
  ```