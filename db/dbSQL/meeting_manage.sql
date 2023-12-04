-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： viaduct.proxy.rlwy.net:52857
-- 產生時間： 2023 年 12 月 04 日 07:37
-- 伺服器版本： 8.2.0
-- PHP 版本： 8.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `meeting_manage`
--
CREATE DATABASE IF NOT EXISTS `meeting_manage` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;
USE `meeting_manage`;

-- --------------------------------------------------------

--
-- 資料表結構 `meeting`
--

DROP TABLE IF EXISTS `meeting`;
CREATE TABLE `meeting` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `meetingRoomId` varchar(255) DEFAULT NULL,
  `creatorId` varchar(255) DEFAULT NULL,
  `isCheckin` tinyint NOT NULL DEFAULT '0',
  `checkLimit` int NOT NULL DEFAULT '5',
  `isCheckout` tinyint NOT NULL DEFAULT '0',
  `notificationTime` int DEFAULT NULL,
  `createTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- 傾印資料表的資料 `meeting`
--

INSERT INTO `meeting` (`id`, `name`, `start`, `end`, `meetingRoomId`, `creatorId`, `isCheckin`, `checkLimit`, `isCheckout`, `notificationTime`, `createTime`) VALUES
('M064', 'aaa', '2023-10-31 14:45:00', '2023-10-31 15:45:00', 'A002', 'A124', 0, 5, 0, 5, '2023-10-26 20:50:54'),
('M065', 'ttt', '2023-10-30 19:58:00', '2023-10-30 22:15:00', 'A001', 'A124', 0, 5, 0, 5, '2023-10-26 21:09:36'),
('M066', 'ppp', '2023-10-29 22:15:00', '2023-10-27 10:30:00', 'A001', 'A124', 0, 5, 0, 10, '2023-10-29 23:07:05'),
('M073', 'www', '2023-10-31 10:30:00', '2023-10-31 13:30:00', 'A002', 'A124', 0, 5, 0, 0, '2023-10-31 15:33:06'),
('M074', 'qwer', '2023-10-31 07:50:00', '2023-10-31 08:40:00', 'A002', 'A124', 0, 5, 0, 0, '2023-10-31 15:33:34'),
('M076', 'www', '2023-10-31 07:50:00', '2023-10-31 08:50:00', 'A001', 'A124', 0, 5, 0, 0, '2023-10-31 15:44:06'),
('M080', 'ddddd', '2023-10-31 08:05:00', '2023-10-31 11:05:00', 'A001', 'A124', 0, 5, 0, 0, '2023-10-31 16:03:33'),
('M086', 'rrr', '2023-10-31 08:40:00', '2023-10-31 14:40:00', 'A001', 'A124', 0, 5, 0, 0, '2023-10-31 16:36:24'),
('M088', 'ttt', '2023-10-31 20:45:00', '2023-10-31 22:45:00', 'A002', 'A124', 0, 5, 0, 0, '2023-10-31 16:42:24'),
('M097', 'qwer', '2023-11-23 23:20:00', '2023-11-24 00:20:00', 'A001', 'A124', 0, 5, 0, 5, '2023-11-23 17:19:24'),
('M098', 'rwx', '2023-11-23 17:30:00', '2023-11-23 18:30:00', 'A001', 'A124', 0, 5, 0, 5, '2023-11-23 17:20:28'),
('M106', 'ppp', '2023-11-24 06:35:00', '2023-11-24 07:35:00', 'A003', 'A124', 0, 5, 0, 30, '2023-11-24 06:31:59'),
('M107', 'aaaa', '2023-11-24 14:45:00', '2023-11-24 15:45:00', 'A003', 'A124', 0, 5, 0, 0, '2023-11-24 14:41:13'),
('M121', 'z', '2023-11-30 19:48:00', '2023-11-30 21:50:00', 'A004', 'R024', 0, 5, 0, 0, '2023-11-28 19:48:42'),
('M123', '測試的', '2023-11-30 19:48:00', '2023-11-30 21:50:00', 'A004', 'R024', 0, 5, 0, 0, '2023-11-28 19:48:42'),
('M124', '測試用', '2023-11-30 19:48:00', '2023-11-30 21:50:00', 'A004', 'R024', 0, 5, 0, 0, '2023-11-28 19:48:42');

--
-- 觸發器 `meeting`
--
DROP TRIGGER IF EXISTS `meetingroomAutoId`;
DELIMITER $$
CREATE TRIGGER `meetingroomAutoId` BEFORE INSERT ON `meeting` FOR EACH ROW BEGIN
    INSERT INTO meeting_sequence VALUES (NULL);
    SET NEW.id=concat('M',right(1000+Last_insert_id(),3));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- 資料表結構 `meeting_member`
--

DROP TABLE IF EXISTS `meeting_member`;
CREATE TABLE `meeting_member` (
  `id` int NOT NULL,
  `participantId` varchar(255) DEFAULT NULL,
  `meetingId` varchar(255) DEFAULT NULL,
  `singin` datetime DEFAULT NULL,
  `singout` datetime DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL COMMENT '備註'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- 傾印資料表的資料 `meeting_member`
--

INSERT INTO `meeting_member` (`id`, `participantId`, `meetingId`, `singin`, `singout`, `remark`) VALUES
(52, 'A121', 'M064', '2023-10-26 21:24:06', NULL, NULL),
(53, 'P555', 'M064', NULL, NULL, NULL),
(54, 'R024', 'M064', NULL, NULL, NULL),
(55, 'A121', 'M065', NULL, NULL, NULL),
(56, 'P555', 'M065', NULL, NULL, NULL),
(57, 'R024', 'M065', NULL, NULL, NULL),
(58, 'A121', 'M066', '2023-10-27 00:25:32', NULL, NULL),
(59, 'P555', 'M066', NULL, NULL, 'test remark4-knn'),
(60, 'R024', 'M066', '2023-10-27 00:25:35', '2023-10-29 21:51:10', NULL),
(76, 'A121', 'M097', NULL, NULL, NULL),
(77, 'A123', 'M097', NULL, NULL, NULL),
(78, 'P555', 'M097', NULL, NULL, NULL),
(79, 'R024', 'M097', NULL, NULL, NULL),
(80, 'A121', 'M098', NULL, NULL, NULL),
(81, 'A123', 'M098', NULL, NULL, NULL),
(82, 'C789', 'M098', NULL, NULL, NULL),
(83, 'R024', 'M098', NULL, NULL, NULL),
(93, 'P555', 'M088', NULL, NULL, NULL),
(94, 'A123', 'M088', NULL, NULL, NULL),
(95, 'A121', 'M121', NULL, NULL, NULL),
(97, 'C789', 'M121', NULL, NULL, NULL),
(98, 'P555', 'M121', NULL, NULL, NULL),
(99, 'C789', 'M107', NULL, '2023-11-29 20:52:49', '666l'),
(100, 'A123', 'M107', NULL, NULL, NULL),
(101, 'A121', 'M107', NULL, '2023-11-29 20:52:52', '465'),
(102, 'P555', 'M107', NULL, NULL, NULL),
(103, 'R024', 'M107', NULL, '2023-11-29 20:52:55', '286'),
(106, 'C789', 'M124', NULL, NULL, NULL),
(107, 'C789', 'M123', NULL, NULL, NULL),
(109, 'A123', 'M123', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `meeting_room`
--

DROP TABLE IF EXISTS `meeting_room`;
CREATE TABLE `meeting_room` (
  `id` varchar(255) NOT NULL,
  `name` varchar(15) NOT NULL COMMENT '會議室名稱',
  `location` varchar(15) NOT NULL COMMENT '會議室位置'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- 傾印資料表的資料 `meeting_room`
--

INSERT INTO `meeting_room` (`id`, `name`, `location`) VALUES
('A001', 'MA324', '管一三樓'),
('A002', 'MA212', '管一二樓'),
('A003', 'MA322', '管一三樓'),
('A004', 'MA320', '管一三樓'),
('A005', 'MB333', '管二三樓');

-- --------------------------------------------------------

--
-- 資料表結構 `meeting_sequence`
--

DROP TABLE IF EXISTS `meeting_sequence`;
CREATE TABLE `meeting_sequence` (
  `id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- 傾印資料表的資料 `meeting_sequence`
--

INSERT INTO `meeting_sequence` (`id`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20),
(21),
(22),
(23),
(24),
(25),
(26),
(27),
(28),
(29),
(30),
(31),
(32),
(33),
(34),
(35),
(36),
(37),
(38),
(39),
(40),
(41),
(42),
(43),
(44),
(45),
(46),
(47),
(48),
(49),
(50),
(51),
(52),
(53),
(54),
(55),
(56),
(57),
(58),
(59),
(60),
(61),
(62),
(63),
(64),
(65),
(66),
(67),
(68),
(69),
(70),
(71),
(72),
(73),
(74),
(75),
(76),
(77),
(78),
(79),
(80),
(81),
(82),
(83),
(84),
(85),
(86),
(87),
(88),
(89),
(90),
(91),
(92),
(93),
(94),
(95),
(96),
(97),
(98),
(99),
(100),
(101),
(102),
(103),
(104),
(105),
(106),
(107),
(108),
(109),
(110),
(111),
(112),
(113),
(114),
(115),
(116),
(117),
(118),
(119),
(120),
(121),
(122),
(123),
(124);

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `name` varchar(15) NOT NULL COMMENT '姓名',
  `account` varchar(20) NOT NULL COMMENT '帳號',
  `password` varchar(255) NOT NULL COMMENT '加鹽並hash過後的密碼',
  `salt` varchar(255) NOT NULL COMMENT '密碼加鹽',
  `role` enum('admin','employee') NOT NULL DEFAULT 'employee',
  `lineid` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`id`, `name`, `account`, `password`, `salt`, `role`, `lineid`) VALUES
('A121', 'asdf', 'kzxcv', '607015c6ac3c190d38b056d548ccbd546f9dbd1bed77f750b790e725fd6d0ed69a6bd81185c68ac4d9b5054c7f8b1c9a38bde90d7058664773bd09fda1cd5a34', 'fb10e6f1325081d30104e420baba2433', 'employee', NULL),
('A123', '123', '123', 'b7a68e6138320d008e9dd3df3fc56d8205514fae1fc652040dd2b4ef6cc0b0e73462321517b2ffdbc89b8bd85e2f8eaf6957e7e80fbdb594f10b9f4eef702014', 'de6951aca4a4208399613116d5be82c7', 'employee', 'U95601675ed096882f2eadd26a2282be0'),
('A124', 'uuu', 'asdfgh', 'dcdfe1e77ec35072007f8944428ae364eae257f9a6faeba628275fb1e067d1075944bb38454a5b21ea058745e4620f2f200fcc8f545407e6791cc6c41d5326e9', '41fb705682d413ca6496a9a38182567c', 'employee', 'U7f87c27ddbf591759cf39bd2b93fd5e6'),
('A125', 'asdf', 'zxcv', 'c9d12d8edc28ae8738c0e296bb114065e6dd51dbac7f951acf12a37d29425364a9137c05d53f3a89965dcb770910e00cb302b60abaf1fdecc6f2f5871567023d', 'f3d78e0bc37fb5b4a69299ab047c9fbe', 'admin', 'U8f863d96710e9bff42c1aa06a7f070d3'),
('C789', '艾', '789', 'b0140a0c42d0c96bac1315178adc9c6c9cdda24e63b91ab33594fe221c7abaface3c5dc2694768853a07a56f19767f7992416d2e115cc2fe8234ed0c4c6740a7', '24092ba68dd62085e4491fe387eb2fb3', 'employee', 'U14720a2f5c3a27e2a6eb9a07d3e7fe4a'),
('D123', 'd', 'd', '48cef256a29d595dc0f240dff0c64b30279679ffe0d18e891cb1c42d656f7bebd94a70518a1c8dd7b862d15c41d3dc61d5b854873762770a73c7308ccc1bbb5f', 'e74cba17935a15d81317118b809cc126', 'admin', NULL),
('P555', 'dllm', 'knnzxc', 'd5c2396b9bc38914e5ac2b6fb563ac3e3a543edcc640a9f22cdc28f591782f06c91a43446db3a6f8b5033047c2bf1b269a838b6cc5c8d6a90bd0f30d09d62442', '25aaeab029ad36ffe69a76ab2ea369b6', 'employee', 'Uf534e6a58705c9fbdf629c58ca56b7b3'),
('R024', 'paox', 'qwerty123', '1e377ab51e7516c9936e0785de5317b4e450c427852896949804e825f9157c8000f21c014aafe04f0d860cc884e8991a76ddd43cb6994ec902362a992ffb7732', 'fdef79445baf13d6bd1c71ee783fcfbd', 'employee', 'Udf8cc32537d4c7bf90a4e32df73640a7');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `meeting`
--
ALTER TABLE `meeting`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_a00e1c5af408052c92418ea9bec` (`meetingRoomId`),
  ADD KEY `FK_fe775c687e31ff7950e35650c40` (`creatorId`);

--
-- 資料表索引 `meeting_member`
--
ALTER TABLE `meeting_member`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_34b5654c29e64f0a80ff5f2c691` (`participantId`),
  ADD KEY `FK_58f476a39e1b8c0ea2ceab23552` (`meetingId`);

--
-- 資料表索引 `meeting_room`
--
ALTER TABLE `meeting_room`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `meeting_sequence`
--
ALTER TABLE `meeting_sequence`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_4ab2df0a57a74fdf904e0e2708` (`account`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `meeting_member`
--
ALTER TABLE `meeting_member`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `meeting_sequence`
--
ALTER TABLE `meeting_sequence`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `meeting`
--
ALTER TABLE `meeting`
  ADD CONSTRAINT `FK_a00e1c5af408052c92418ea9bec` FOREIGN KEY (`meetingRoomId`) REFERENCES `meeting_room` (`id`),
  ADD CONSTRAINT `FK_fe775c687e31ff7950e35650c40` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`);

--
-- 資料表的限制式 `meeting_member`
--
ALTER TABLE `meeting_member`
  ADD CONSTRAINT `FK_34b5654c29e64f0a80ff5f2c691` FOREIGN KEY (`participantId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_58f476a39e1b8c0ea2ceab23552` FOREIGN KEY (`meetingId`) REFERENCES `meeting` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
