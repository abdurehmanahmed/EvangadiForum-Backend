//Database Tables

export let users = `CREATE TABLE IF NOT EXISTS users (
    userid INT(20) NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    firstname VARCHAR(20) NOT NULL,
    lastname VARCHAR(20) NOT NULL,
    email VARCHAR(40) NOT NULL,
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY (userid)
)`;

export let questions = `CREATE TABLE IF NOT EXISTS questions (
    question_id INT(20) NOT NULL AUTO_INCREMENT,
    userid INT(20) NOT NULL,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200) NOT NULL,
    tag VARCHAR(20),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (question_id),
    FOREIGN KEY (userid) REFERENCES users(userid)
);`;

export let answers = `CREATE TABLE IF NOT EXISTS answers (
    answer_id INT(20) NOT NULL AUTO_INCREMENT,
    userid INT(20) NOT NULL,
    question_id INT(20) NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    answer VARCHAR(200) NOT NULL,
    PRIMARY KEY (answer_id),
    FOREIGN KEY (userid) REFERENCES users(userid),
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
)`;