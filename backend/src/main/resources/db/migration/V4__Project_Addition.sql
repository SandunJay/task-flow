CREATE TABLE project (
                         id SERIAL PRIMARY KEY,
                         name VARCHAR(100) NOT NULL,
                         description VARCHAR(500),
                         status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                         due_date TIMESTAMP,
                         user_id INT NOT NULL REFERENCES users(id),
                         created_at TIMESTAMP
);

-- Add the column initially allowing NULLs
ALTER TABLE task ADD COLUMN project_id INT REFERENCES project(id);

-- Create a default project for each user who has tasks
INSERT INTO project (name, description, status, user_id, created_at)
SELECT 'Default Project', 'Auto-created for existing tasks', 'ACTIVE', user_id, NOW()
FROM task
GROUP BY user_id;

-- Update existing tasks to reference the default project
UPDATE task t SET project_id = p.id
FROM project p
WHERE t.user_id = p.user_id;

-- Now add the NOT NULL constraint
ALTER TABLE task ALTER COLUMN project_id SET NOT NULL;
