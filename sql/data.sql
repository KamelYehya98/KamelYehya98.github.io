-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 13, 2021 at 11:30 AM
-- Server version: 8.0.21
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `monkey`
--

DELIMITER $$
--
-- Procedures
--

DROP PROCEDURE IF EXISTS `createUser`$$
CREATE PROCEDURE `createUser` (IN `uname` VARCHAR(100), IN `pswd` VARCHAR(100), IN `mail` VARCHAR(100))  MODIFIES SQL DATA
BEGIN
	DECLARE idd INT;
	INSERT INTO users(username, pass, email) VALUES (uname, pswd, mail);
	SET idd = LAST_INSERT_ID();
	INSERT INTO player(id, botid, gameid, rounds, winrate, games, wins) VALUES (idd, idd, idd, 0, 0, 0, 0);
	INSERT INTO game(id, botwins, playerwins, rounds) VALUES (idd, 0, 0, 0);
	INSERT INTO bot(id, name) VALUES (idd, "Epsilon");
END$$

DROP PROCEDURE IF EXISTS `checkgame`$$
CREATE PROCEDURE `checkgame` (IN `idd` INT)  READS SQL DATA
BEGIN
SELECT * FROM game WHERE id=idd;
END$$

DROP PROCEDURE IF EXISTS `finishgame`$$
CREATE PROCEDURE `finishgame` (IN `pscore` INT, IN `bscore` INT, IN `idd` INT)  MODIFIES SQL DATA
BEGIN
		IF pscore < bscore THEN 
			UPDATE player SET rounds=rounds+1, wins=wins+1, winrate=(wins/rounds)*100 WHERE id=idd;
            UPDATE game SET playerwins=playerwins+1, rounds=rounds+1 WHERE id=idd;
            INSERT INTO round(botscore, gameid, playerscore, winner, timedate) VALUES (bscore, idd, pscore, "Player", CURRENT_TIMESTAMP());
		ELSEIF pscore > bscore THEN
        	UPDATE player SET rounds=rounds+1, winrate=(wins/rounds)*100 WHERE id=idd;
            UPDATE game SET botwins=botwins+1, rounds=rounds+1 WHERE id=idd;
            INSERT INTO round(botscore, gameid, playerscore, winner, timedate) VALUES (bscore, idd, pscore,"Epsilon", CURRENT_TIMESTAMP());
        ELSE
            UPDATE player SET rounds=rounds+1, winrate=(wins/rounds)*100 WHERE id=idd;
            UPDATE game SET rounds=rounds+1 WHERE id=idd;
            INSERT INTO round(botscore, gameid, playerscore, winner, timedate) VALUES (bscore, idd, pscore,"Draw", CURRENT_TIMESTAMP());
		END IF;
END$$

DROP PROCEDURE IF EXISTS `getrounds`$$
CREATE PROCEDURE `getrounds` (IN `idd` INT)  READS SQL DATA
BEGIN
	SELECT * FROM round WHERE gameid = idd
    ORDER BY id DESC;
END$$

DROP PROCEDURE IF EXISTS `resetgame`$$
CREATE PROCEDURE `resetgame` (IN `idd` INT)  MODIFIES SQL DATA
BEGIN
	UPDATE game SET botwins=0, playerwins=0, rounds=0 WHERE id=idd;
    UPDATE player SET games=games+1 WHERE id=idd;
    DELETE FROM round WHERE gameid=idd;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `bot`
--

DROP TABLE IF EXISTS `bot`;
CREATE TABLE IF NOT EXISTS `bot` (
  `name` varchar(100) DEFAULT NULL,
  `id` int NOT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `bot`
--

INSERT INTO `bot` (`name`, `id`) VALUES
('Epsilon', 1);

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
CREATE TABLE IF NOT EXISTS `game` (
  `botwins` int DEFAULT NULL,
  `playerwins` int DEFAULT NULL,
  `id` int NOT NULL,
  `rounds` int NOT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `game`
--

INSERT INTO `game` (`botwins`, `playerwins`, `id`, `rounds`) VALUES
(2, 2, 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `player`
--

DROP TABLE IF EXISTS `player`;
CREATE TABLE IF NOT EXISTS `player` (
  `id` int NOT NULL AUTO_INCREMENT,
  `botid` int DEFAULT NULL,
  `gameid` int DEFAULT NULL,
  `wins` int DEFAULT NULL,
  `rounds` int DEFAULT NULL,
  `games` int DEFAULT NULL,
  `winrate` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_PLAYER_HAS1_BOT` (`botid`),
  KEY `FK_PLAYER_HAS4_GAME` (`gameid`)
);

--
-- Dumping data for table `player`
--

INSERT INTO `player` (`id`, `botid`, `gameid`, `wins`, `rounds`, `games`, `winrate`) VALUES
(1, 1, 1, 9, 53, 4, '16.98');

-- --------------------------------------------------------

--
-- Table structure for table `round`
--

DROP TABLE IF EXISTS `round`;
CREATE TABLE IF NOT EXISTS `round` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gameid` int NOT NULL,
  `winner` varchar(1024) DEFAULT NULL,
  `playerscore` int DEFAULT NULL,
  `botscore` int DEFAULT NULL,
  `timedate` datetime NOT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `round`
--

INSERT INTO `round` (`id`, `gameid`, `winner`, `playerscore`, `botscore`, `timedate`) VALUES
(53, 1, 'Player', 21, 27, '2021-05-12 22:24:15'),
(52, 1, 'Epsilon', 31, 22, '2021-05-12 22:22:46'),
(51, 1, 'Player', 18, 28, '2021-05-12 22:20:00'),
(50, 1, 'Epsilon', 34, 32, '2021-05-12 22:19:35');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `pass` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `pass`) VALUES
(1, 'ass', 'kamel.yehya04@gmail.com', '$2y$10$VWphAj19ZP0dMsghOWzreOLD3bqnmT4m7CsZJjvCIXJ9nVIvqyseq');

--
-- Triggers `users`
--

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
