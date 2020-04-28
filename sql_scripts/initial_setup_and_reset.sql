/*This script is for the initial setup of the database for this project. It will also reset an active database, and will delete any data from any tables this project uses. The user that is connecting to the database through KNEX must have the appropriate permissions in the database to prevent errors from the server.*/

DROP TABLE IF EXISTS contact_list;
DROP TABLE IF EXISTS user_list;
DROP TABLE IF EXISTS knex_test_table;

CREATE TABLE knex_test_table (
    testcolumn TEXT
);

INSERT INTO knex_test_table (testcolumn)
	VALUES ('helloknex');

CREATE TABLE user_list (
    user_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_username TEXT UNIQUE NOT NULL,
    user_password TEXT NOT NULL,
    user_salt TEXT NOT NULL,
    user_admin BOOLEAN NOT NULL DEFAULT FALSE
);
/*Creates a super user so you can interface with the API immidiately. Default password is "defaultPassword1!". Please change the password immidiately after running this script.*/
INSERT INTO user_list (user_username, user_password, user_salt, user_admin)
    VALUES ('sudo', '$2b$10$W38MTvmV4DTjyXt9kdNhF.n6NRFcK.xjdcV2iozswLbDmXxZyvVhS', '$2b$10$W38MTvmV4DTjyXt9kdNhF.', true);

CREATE TABLE contact_list (
    contact_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	user_id integer NOT NULL,
	contact_first_name varchar NOT NULL,
	contact_last_name varchar NULL,
	contact_phone_no varchar NULL,
	contact_phone_type varchar NULL,
	contact_phone2_no varchar NULL,
	contact_phone2_type varchar NULL,
	contact_phone3_no varchar NULL,
	contact_phone3_type varchar NULL,
	contact_email varchar NULL,
    contact_email_type varchar NULL,
	contact_email2 varchar NULL,
    contact_email2_type varchar NULL,
	contact_email3 varchar NULL,
    contact_email3_type varchar NULL,
	contact_company varchar NULL,
	contact_company_title varchar NULL,
	contact_address_street varchar NULL,
	contact_address_apt varchar NULL,
	contact_address_city varchar NULL,
	contact_address_state varchar NULL,
	contact_address_zip varchar NULL,
	contact_address_type varchar NULL,
	contact_address_country varchar NULL,
	contact_address2_street varchar NULL,
	contact_address2_apt varchar NULL,
	contact_address2_city varchar NULL,
	contact_address2_state varchar NULL,
	contact_address2_zip varchar NULL,
	contact_address2_country varchar NULL,
	contact_address2_type varchar NULL,
	contact_address3_street varchar NULL,
	contact_address3_apt varchar NULL,
	contact_address3_city varchar NULL,
	contact_address3_state varchar NULL,
	contact_address3_zip varchar NULL,
	contact_address3_country varchar NULL,
	contact_address3_type varchar NULL,
	contact_skype varchar NULL,
	contact_discord varchar NULL,
	contact_twitter varchar NULL,
	contact_website varchar NULL,
	contact_birthday date NULL,
	contact_relationship varchar NULL,
	contact_notes varchar NULL,
	CONSTRAINT contact_list_pk PRIMARY KEY (contact_id),
	CONSTRAINT contact_list_fk FOREIGN KEY (user_id) REFERENCES public.user_list(user_id)
);

GRANT ALL ON TABLE contact_list TO knex;
GRANT ALL ON TABLE knex_test_table TO knex;
GRANT ALL ON TABLE user_list TO knex;