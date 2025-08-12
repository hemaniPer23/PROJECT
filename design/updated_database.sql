-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 12, 2025 at 06:36 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `electiondb`
--

-- --------------------------------------------------------

--
-- Table structure for table `voter`
--

DROP TABLE IF EXISTS `voter`;
CREATE TABLE IF NOT EXISTS `voter` (
  `NIC` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `FullName_Sinhala` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `FullName_English` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Gender` enum('Male','Female','Other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DOB` date NOT NULL,
  `Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Mobile_Number` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Division_ID` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `STATUS` enum('Verified','Pending','Voted') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  PRIMARY KEY (`NIC`),
  KEY `fk_voter_division` (`Division_ID`),
  KEY `idx_voter_status` (`STATUS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `voter`
--

INSERT INTO `voter` (`NIC`, `FullName_Sinhala`, `FullName_English`, `Gender`, `DOB`, `Address`, `Mobile_Number`, `Email`, `Division_ID`, `STATUS`) VALUES
('200010103861', 'ඩබ්.කේ. කවිදු මදුසංක', 'W.K. Kavindu Madushanka', 'Male', '2000-04-10', 'Rathnan sewana, Nattampitiya, Tawalama', '0711940527', 'kavindumadushanaka527@gmail.com', 'DIV054', 'Voted'),
('200011900097', 'ජයලත්ගේ චමිඳු ගිහන්ත ජයලත්', 'Jayalathge Chamindu Gihantha Jayalath', 'Male', '2028-04-20', '134/A, Miriswatta ,Bentota', '0768377104', 'chamindugihantha@gmail.com', 'DIV055', 'Voted'),
('200020500221', 'වැලිහිඳ බඩල්ගේ තිසර දේශිත සුමනවීර', 'Welihinda Badalge Thisara Deshitha Sumanaweera', 'Male', '2000-07-23', '314/A, Sudharmarama Road, Bataduwa, Galle', '0716204513', 'thisaradeshitha123@gmail.com', 'DIV055', 'Voted'),
('200034000056', 'කඩුපිටි සෙනිෂ්ක දිල්ෂාන් මධුරංග', 'Kadupiti Senishka Dilshan Madhuranga', 'Male', '2000-12-05', 'No:17/14, Suduwella Road, Thalgasgoda, Ambalangoda \r\n\r\n\r\n', '077 342172', 'madurangasenishka@gmail.com', 'DIV054', 'Voted'),
('200034502234', 'හවුපේ මානගේ උදිත මදුශංක', 'Howpe Manage Uditha Madushanka', 'Male', '2000-12-10', '217/2, Godauda, Howpe, Galle', '0762432850', 'madhushankauditha@gmail.com', 'DIV054', 'Voted'),
('200056500882', 'සසිනි අමන්දා නානායක්කාර', 'Sasini Amanda Nanayakkara', 'Female', '2000-03-05', '101, Karapitiya road, Godakanda, Galle', '0707707935', 'sasininanayakkara2000@gmail.com', 'DIV054', 'Voted'),
('200059100213', 'ඇල්වල දේවගේ ඉෂිනි විමන්ෂා', 'Elwala dewage ishini wimansha', 'Female', '2000-03-31', '562/W/98, Walawwatta, Malwatta, Nittambuwa', '0753303851', 'Ishiniwimansha31@gmail.com', 'DIV027', 'Voted'),
('200070201580', 'වන්නිආරච්චි කංකානම්ගේ තරුෂි නිමේෂිකා', 'Wanniarachchi kankanamge Tharushi Nimeshika', 'Female', '2000-07-20', '123/2,unawatuna', '0766210905', 'tharushinimeshika2020@gmail.com', 'DIV056', 'Voted'),
('200105400548', 'රමිදු උවන්‍ත රුහුනගේ', 'Ramidu Uwantha Ruhunage', 'Male', '2001-02-23', 'Seenigoda, Balapitiya, Galle.', '076 664470', 'ramindu23@gmil.com', 'DIV053', 'Voted'),
('200114102284', 'යුෂාන් ඩිස්මිත', 'Y.D Hettiarachchi', 'Male', '2001-05-20', '51, Dewala rd, Mahara nugegoda, Kadawatha', '0767492276', 'YushanHettiarachchi@gmail.com', 'DIV025', 'Voted'),
('200167000130', 'ඩබ්.එම්.එස් භාග්‍යා මදුවන්ති', 'W.m.s.b maduwanthi', 'Female', '2001-06-18', '115/A ihala imbulgoda ,imbulgoda', '0766624203', 'sbmwijesinghe@gmail.com', 'DIV025', 'Voted'),
('200167500137', 'කුරුගලගමගේ හේමානි රුමේෂිකා පෙරේරා', 'Kurugamage Hemani Rumeshika Perera', 'Female', '2001-06-23', 'No: 113/E, Pothukotuwa , Bandigoda ,Ja ela', '0776513391', 'hemaniperera@gmail.com', 'DIV027', 'Voted'),
('200170902141', 'මහීපාල මුදලිගේ සිනලි දෙව්නෙත්මි මහීපාල', 'Maheepala Mudalige Sinali Dewnethmi Maheepala', 'Female', '2001-07-27', '58/3, Wathurugama road, Miriswaththa, Mudungoda', '0704311954', 'sinalimaheepala27@gmail.com', 'DIV026', 'Voted'),
('200184303368', 'අකුරන්ගේ ජයනි නවෝද්‍යා දසනායක', 'Akurange Jayani Nawodya dassanayake', 'Female', '2001-12-08', 'Yatiwala, Mudaliwaththa, Mawathagama.', '0768906164', 'jayaninawo2001@gmail.com', 'DIV056', 'Voted'),
('991491112V', 'වෙත්තසිංහ පේඩිගේ රුචිර හංසන චතුරංග', 'Weththasinghe Pedige Ruchira Hansana Chathuranga ', 'Male', '1999-05-28', 'No:219 , Doranagaoda East, Bemmulla.', '071 069926', 'ruchirahansana12@gmail.com', 'DIV028', 'Voted'),
('997760344V', 'බේරුවලගේ ඉශාරා උදාරි', 'Beruwalage Ishara Udari', 'Female', '1999-10-02', 'Batapola Road, Meetiyagoda', '0767640435', 'udariberuwalage99@gmail.com', 'DIV055', 'Voted');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `voter`
--
ALTER TABLE `voter`
  ADD CONSTRAINT `fk_voter_division` FOREIGN KEY (`Division_ID`) REFERENCES `divisions` (`Division_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
