DROP DATABASE IF EXISTS keyvaluevault;
CREATE DATABASE keyvaluevault;

\c keyvaluevault;

DROP TABLE keyindex;


CREATE TABLE keyindex (
  ID SERIAL PRIMARY KEY,
  key VARCHAR,
  value jsonb,
  oncreated timestamp default current_timestamp
);

INSERT INTO keyindex (key,value)
  VALUES ('JonSnow','{"default": "you know nothing"}');

INSERT INTO keyindex (key,value)
  VALUES ('JonSnow','{"default": "you know nothing again"}');