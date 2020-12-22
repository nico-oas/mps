DDL (DBs layouts):

1:
create database mps_db;

2:
grant all privileges on mps_db.* to 'mps'@localhost identified by '=RCASrDR6+gZLf.@z^(EAR@CsE.B7!4!';

3:
CREATE TABLE `mps_users` (
	`user_id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(32) NOT NULL,
	`mail` VARCHAR(128) NOT NULL,
	`birthdate` DATE NOT NULL,
	`gender` VARCHAR(6) NOT NULL,
	`password_hash` VARCHAR(256) NOT NULL,
	`real_name` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`user_id`)
) ENGINE=InnoDB;

4:
CREATE TABLE `mps_user_items` (
	`user_id` INT NOT NULL,
	`item_name` VARCHAR(256) NOT NULL,
	`item_category` VARCHAR(256) NOT NULL,
	`carbon` FLOAT NOT NULL,
	`date_added` TIMESTAMP NOT NULL DEFAULT CURRENT_DATE()
) ENGINE=InnoDB;