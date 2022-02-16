-- dev.roles definition
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_UN` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
-- dev.users definition
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_UN` (`username`, `email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
-- dev.user_roles definition
CREATE TABLE `user_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_roles_FK` (`userId`),
  KEY `user_roles_FK_1` (`roleId`),
  CONSTRAINT `user_roles_FK` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `user_roles_FK_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
INSERT IGNORE INTO roles (id, name)
VALUES (1, "user");
INSERT IGNORE INTO roles (id, name)
VALUES (2, "admin");
INSERT IGNORE INTO roles (id, name)
VALUES (3, "moderator");