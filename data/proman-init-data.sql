ALTER TABLE IF EXISTS ONLY public.projects DROP CONSTRAINT IF EXISTS pk_projects_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS pk_boards_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS pk_cards_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.statuses DROP CONSTRAINT IF EXISTS pk_statuses_id CASCADE;

DROP TABLE IF EXISTS public.projects;
CREATE TABLE projects (
    id serial NOT NULL
);

DROP TABLE IF EXISTS public.boards;
CREATE TABLE boards (
    id serial NOT NULL,
    title text
);

DROP TABLE IF EXISTS public.statuses;
CREATE TABLE statuses (
    id serial NOT NULL,
    title text
);

DROP TABLE IF EXISTS public.cards;
CREATE TABLE cards (
    id serial NOT NULL,
    board_id integer,
    status_id integer,
    order_number integer,
    title text
);

ALTER TABLE ONLY projects
    ADD CONSTRAINT pk_projects_id PRIMARY KEY (id);

ALTER TABLE ONLY boards
    ADD CONSTRAINT pk_boards_id PRIMARY KEY (id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT pk_cards_id PRIMARY KEY (id);

ALTER TABLE ONLY statuses
    ADD CONSTRAINT pk_statuses_id PRIMARY KEY (id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_boards_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_statuses_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;