CREATE TABLE IF NOT EXISTS
mytable (
 id SERIAL PRIMARY KEY,
 name VARCHAR(255),
 house VARCHAR(255),
patronus VARCHAR(255),
alive BOOLEAN DEFAULT true ,
created_by VARCHAR(255)
);

