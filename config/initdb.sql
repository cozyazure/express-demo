DROP DATABASE IF EXISTS keyvaluevault;

CREATE DATABASE keyvaluevault;

\c keyvaluevault;

CREATE TABLE keyindex (
  ID SERIAL PRIMARY KEY,
  key VARCHAR,
  value jsonb,
  oncreated bigint
);

INSERT INTO keyindex (key,value,oncreated)
  VALUES ('JonSnow','{"default": "You know nothing"}',1000000000000);

INSERT INTO keyindex (key,value, oncreated)
  VALUES ('JonSnow','{"default": "And now my watch begins"}', 1000000000003);

  INSERT INTO keyindex (key,value, oncreated)
  VALUES ('JonSnow','{"default": "I know, but I still love her"}', 1000000000006);