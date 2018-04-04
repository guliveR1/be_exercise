CREATE SEQUENCE IF NOT EXISTS tweet_id_seq START 1;

CREATE TABLE IF NOT EXISTS tweets (
    id              integer DEFAULT nextval('tweet_id_seq'),
    content         varchar(100) not null,
    username        varchar(30) not null,
    timestamp       timestamp default CURRENT_TIMESTAMP,
    CONSTRAINT tweet_id PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS likes (
    username    varchar(30) not null,
    post_id     integer references tweets(id),
    timestamp   timestamp default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS retweets (
    username    varchar(30) not null,
    post_id     integer references tweets(id),
    timestamp   timestamp default CURRENT_TIMESTAMP
);