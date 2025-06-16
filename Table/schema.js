export let users = `CREATE TABLE IF NOT EXISTS users(
    userid INT(20) NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    firstname VARCHAR(20) NOT NULL,
    lastname VARCHAR(20) NOT NULL,
    email VARCHAR(40) NOT NULL,
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY (userid)
)`;

export let questions = `CREATE TABLE IF NOT EXISTS questions(
    id INT(20) NOT NULL AUTO_INCREMENT,
    questionid VARCHAR(100) NOT NULL,
    userid INT(20) NOT NULL,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200) NOT NULL,
    tag VARCHAR(20),
    createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, questionid),
    FOREIGN KEY(userid) REFERENCES users(userid)
)`;

export let answers = `CREATE TABLE IF NOT EXISTS answers(
    answerid INT(20) NOT NULL,
    userid INT(20) NOT NULL,
    questionid VARCHAR(100) NOT NULL,
    answer VARCHAR(200) NOT NULL,
    createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (answerid),
    FOREIGN KEY(userid) REFERENCES users(userid)
)`;
