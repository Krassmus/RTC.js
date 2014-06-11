<?php

$db = new PDO("sqlite:signals.sqlite");
$db->exec("
CREATE TABLE IF NOT EXISTS online (
  user_id char(32) NOT NULL DEFAULT '',
  name varchar(255) NOT NULL DEFAULT '',
  email varchar(255) DEFAULT NULL,
  last_activity int(20) DEFAULT NULL,
  PRIMARY KEY (user_id)
);
");
$db->exec("
CREATE TABLE IF NOT EXISTS online (
  offer_user char(32) NOT NULL DEFAULT '',
  answer_user char(32) NOT NULL DEFAULT '',
  offer text NULL,
  answer text NULL,
  PRIMARY KEY (offer_user, answer_user)
);
");
