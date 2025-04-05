CREATE TABLE task (
                      id SERIAL PRIMARY KEY,
                      title VARCHAR(100) NOT NULL,
                      description VARCHAR(500),
                      status VARCHAR(20) NOT NULL,
                      due_date TIMESTAMP,
                      user_id INT NOT NULL REFERENCES users(id),
                      created_at TIMESTAMP
);

CREATE TABLE task_assignees (
                                task_id INT NOT NULL REFERENCES task(id),
                                user_id INT NOT NULL REFERENCES users(id),
                                PRIMARY KEY (task_id, user_id)
);