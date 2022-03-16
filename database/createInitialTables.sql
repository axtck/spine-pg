-- spine.users definition
CREATE TABLE spine.users (
  "id" serial4 NOT NULL,
  "username" varchar(50) NOT NULL,
  "email" varchar(100) NOT NULL,
  "password" varchar(100) NOT NULL,
  CONSTRAINT "users_pk" PRIMARY KEY ("id"),
  CONSTRAINT "users_un" UNIQUE ("username", "email")
);
-- spine.roles definition
CREATE TABLE spine.roles (
  "id" int4 NOT NULL,
  "name" varchar(20) NOT NULL,
  CONSTRAINT "roles_pk" PRIMARY KEY ("id"),
  CONSTRAINT "roles_un" UNIQUE ("name")
);
-- spine.user_roles definition
CREATE TABLE spine.user_roles (
  "id" serial4 NOT NULL,
  "user_id" int4 NOT NULL,
  "role_id" int4 NOT NULL,
  CONSTRAINT "user_roles_pk" PRIMARY KEY ("id")
);
-- spine.user_roles foreign keys
ALTER TABLE spine.user_roles
ADD CONSTRAINT "user_roles_fk_1" FOREIGN KEY ("role_id") REFERENCES spine.roles("id");
-- insert initial roles
INSERT INTO spine.roles ("id", "name")
VALUES (1, 'user') ON CONFLICT ("id") DO NOTHING;
INSERT INTO spine.roles ("id", "name")
VALUES (2, 'admin') ON CONFLICT ("id") DO NOTHING;
INSERT INTO spine.roles ("id", "name")
VALUES (3, 'moderator') ON CONFLICT ("id") DO NOTHING;
-- spine.profile_pictures definition
CREATE TABLE spine.profile_pictures (
  "id" serial4 NOT NULL,
  "user_id" int4 NOT NULL,
  "active" bool NOT NULL,
  "created" timestamp NOT NULL,
  "modified" timestamp NOT NULL,
  "file_location" varchar(200) NOT NULL,
  CONSTRAINT profile_pictures_pk PRIMARY KEY ("id"),
  CONSTRAINT profile_pictures_un UNIQUE ("file_location")
);
-- spine.profile_pictures foreign keys
ALTER TABLE spine.profile_pictures
ADD CONSTRAINT profile_pictures_fk FOREIGN KEY (user_id) REFERENCES spine.users("id");