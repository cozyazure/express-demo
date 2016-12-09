DROP DATABASE IF EXISTS keyvaluevault;
CREATE DATABASE keyvaluevault;

\c keyvaluevault;

DROP TABLE keyindex;


CREATE TABLE keyindex (
  ID SERIAL PRIMARY KEY,
  key VARCHAR,
  value jsonb,
  oncreated bigint
);

INSERT INTO keyindex (key,value,oncreated)
  VALUES ('JonSnow','{"default": "you know nothing"}',1481250444);

INSERT INTO keyindex (key,value, oncreated)
  VALUES ('JonSnow','{"default": "you know nothing again"}', 1481250481);

  INSERT INTO keyindex (key,value, oncreated)
  VALUES ('JonSnow','{"default": "you know nothing really"}', 1481250485);