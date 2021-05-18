/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     5/10/2021 8:21:20 PM                         */
/*==============================================================*/


alter table PLAYER 
   drop foreign key FK_PLAYER_HAS1_BOT;

alter table PLAYER 
   drop foreign key FK_PLAYER_HAS4_GAME;

alter table ROUND 
   drop foreign key FK_ROUND_HAS6_GAME;

alter table USERS 
   drop foreign key FK_USERS_HAS_PLAYER;

/*==============================================================*/
/* Table: BOT                                                   */
/*==============================================================*/
create table BOT
(
   name                 varchar(100)  comment '',
   id                   integer not null  comment '',
   primary key (id)
);

/*==============================================================*/
/* Table: GAME                                                  */
/*==============================================================*/
create table GAME
(
   botwins              int  comment '',
   playerwins           int  comment '',
   rounds               int  comment '',
   id                   integer not null  comment '',
   primary key (id)
);

/*==============================================================*/
/* Table: PLAYER                                                */
/*==============================================================*/
create table PLAYER
(
   botid                integer  comment '',
   gameid               integer  comment '',
   wins                 int  comment '',
   rounds               int  comment '',
   games                int  comment '',
   winrate              numeric(5,2)  comment '',
   id                   integer not null  comment '',
   primary key (id)
);

/*==============================================================*/
/* Table: ROUND                                                 */
/*==============================================================*/
create table ROUND
(
   winner               varchar(1024)  comment '',
   playerscore          int  comment '',
   botscore             int  comment '',
   id                   integer not null  comment '',
   gameid               integer not null  comment '',
   primary key (id)
);

/*==============================================================*/
/* Table: USERS                                                 */
/*==============================================================*/
create table USERS
(
   id                   int not null auto_increment  comment '',
   username             varchar(100)  comment '',
   email                varchar(100)  comment '',
   pass             varchar(100)  comment '',
   primary key (id)
);

alter table PLAYER add constraint FK_PLAYER_HAS1_BOT foreign key (botid)
      references BOT (id) on delete restrict on update restrict;

alter table PLAYER add constraint FK_PLAYER_HAS4_GAME foreign key (gameid)
      references GAME (id) on delete restrict on update restrict;

alter table ROUND add constraint FK_ROUND_HAS6_GAME foreign key (id)
      references GAME (id) on delete restrict on update restrict;

alter table USERS add constraint FK_USERS_HAS_PLAYER foreign key (id)
      references PLAYER (id) on delete restrict on update restrict;

CREATE TRIGGER CREATE_PLAYER
AFTER INSERT
ON users FOR EACH ROW
INSERT INTO player VALUES (new.id, new.id, 0, new.id , 0, 0, 0);

CREATE TRIGGER CREATE_BOT
AFTER INSERT
ON users FOR EACH ROW
INSERT INTO bot VALUES (new.id, "Epsilon");

CREATE TRIGGER CREATE_GAME
AFTER INSERT
ON users FOR EACH ROW
INSERT INTO game VALUES (0, new.id, 0, 0);	

DELIMITER $$
DROP PROCEDURE IF EXISTS finishgame;
CREATE PROCEDURE finishgame(IN pscore INT, IN bscore INT, IN idd INT)
BEGIN
		IF pscore < bscore THEN 
			UPDATE player SET rounds=rounds+1, wins=wins+1, winrate=(wins/rounds)*100 WHERE id=idd;
            UPDATE game SET playerwins=playerwins+1, rounds=rounds+1 WHERE id=idd;
            INSERT INTO round(botscore, gameid, playerscore, winner) VALUES (bscore, idd, pscore, "Player");
		ELSEIF pscore > bscore THEN
        	UPDATE player SET rounds=rounds+1, winrate=(wins/rounds)*100 WHERE id=idd;
            UPDATE game SET botwins=botwins+1, rounds=rounds+1 WHERE id=idd;
            INSERT INTO round(botscore, gameid, playerscore, winner) VALUES (bscore, idd, pscore,"Epsilon");
        ELSE
            UPDATE player SET rounds=rounds+1, winrate=(wins/rounds)*100 WHERE id=idd;
            UPDATE game SET rounds=rounds+1 WHERE id=idd;
            INSERT INTO round(botscore, gameid, playerscore, winner) VALUES (bscore, idd, pscore,"Draw");
		END IF;
END
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS resetgame;
CREATE PROCEDURE resetgame(IN idd INT)
BEGIN
	UPDATE game SET botwins=0, playerwins=0, rounds=0 WHERE id=idd;
    UPDATE player SET games=games+1 WHERE id=idd;
    DELETE FROM round WHERE gameid=idd;
END
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS getrounds;
CREATE PROCEDURE getrounds(IN idd INT)
BEGIN
	SELECT * FROM round WHERE gameid = idd
    ORDER BY id DESC;
END
DELIMITER ;


delete from round;
delete from game;
delete from player;
delete from users;
delete from bot;
alter table users AUTO_INCREMENT=1;
alter table game AUTO_INCREMENT=1;
alter table player AUTO_INCREMENT=1;
alter table bot AUTO_INCREMENT=1;
alter table round AUTO_INCREMENT=1;
