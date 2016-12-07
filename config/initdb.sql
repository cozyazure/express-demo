DROP DATABASE IF EXISTS keyvaluevault;
CREATE DATABASE keyvaluevault;

\c keyvaluevault;

DROP TABLE keyindex CASCADE;
DROP TABLE keyvaluepair;

CREATE TABLE keyindex (
  ID SERIAL PRIMARY KEY,
  key VARCHAR
);

CREATE TABLE keyvaluepair(
  keyId integer references keyindex(ID),
  value jsonb
);

INSERT INTO keyindex (key)
  VALUES ('JonSnow' );

  INSERT INTO keyvaluepair (keyId,value)
  VALUES (1, '{"default": "you know nothing"}');