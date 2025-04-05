CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       enabled BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE token (
      id SERIAL PRIMARY KEY,
      token VARCHAR(255) NOT NULL,
      user_id INT NOT NULL REFERENCES users(id),
      token_type VARCHAR(20) NOT NULL,
      expiry_date TIMESTAMP NOT NULL
);