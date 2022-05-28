CREATE TABLE tasks (
    id SERIAL,
    task varchar(256),
    category varchar(75),
    completion BOOLEAN DEFAULT false,
    date_completed DATE
);