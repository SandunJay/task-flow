CREATE TABLE sub_task (
                          id SERIAL PRIMARY KEY,
                          title VARCHAR(100) NOT NULL,
                          description VARCHAR(500),
                          status VARCHAR(20) NOT NULL,
                          task_id INT NOT NULL REFERENCES task(id),
                          created_at TIMESTAMP
);

CREATE TABLE subtask_assignees (
                                   subtask_id INT NOT NULL REFERENCES sub_task(id),
                                   user_id INT NOT NULL REFERENCES users(id),
                                   PRIMARY KEY (subtask_id, user_id)
);