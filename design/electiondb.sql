-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 25, 2025 at 06:59 PM
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
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `Admin_ID` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Admin_UserName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Admin_Password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Admin_Role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`Admin_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`Admin_ID`, `Admin_UserName`, `Admin_Password`, `Admin_Role`) VALUES
('12085', 'WMEKTDB WIKKRAMASINGHA', 'abc@123', 'Presiding Officer'),
('12086', 'Officer01', 'abc@456', 'Officer'),
('admin01', 'admin1', '123', 'commission');

-- --------------------------------------------------------

--
-- Table structure for table `candidate`
--

DROP TABLE IF EXISTS `candidate`;
CREATE TABLE IF NOT EXISTS `candidate` (
  `Candidate_ID` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_FullName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_UserName_Sinhala` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_UserName_English` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_NIC` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_Gender` enum('Male','Female','Other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_DOB` date NOT NULL,
  `Image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_Number` int DEFAULT NULL,
  `Party_ID` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Election_ID` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`Candidate_ID`),
  KEY `fk_candidate_party` (`Party_ID`),
  KEY `fk_candidate_election` (`Election_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate`
--

INSERT INTO `candidate` (`Candidate_ID`, `Candidate_FullName`, `Candidate_UserName_Sinhala`, `Candidate_UserName_English`, `Candidate_NIC`, `Candidate_Gender`, `Candidate_DOB`, `Image`, `Candidate_Number`, `Party_ID`, `Election_ID`) VALUES
('candidate1', 'Anura Kumara Dissanayake', 'අනුර කුමාර', 'Anura Kumara', '684578147V', 'Male', '1968-11-24', 'C:\\wamp64\\www\\voting_system\\upload\\anura_kumara.jpeg', 0, 'party1', 'election1');

-- --------------------------------------------------------

--
-- Table structure for table `election`
--

DROP TABLE IF EXISTS `election`;
CREATE TABLE IF NOT EXISTS `election` (
  `Election_ID` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Election_Type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Date` date NOT NULL,
  `Start_Time` time DEFAULT NULL,
  `End_Time` time DEFAULT NULL,
  `IsValid` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Election_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `election`
--

INSERT INTO `election` (`Election_ID`, `Election_Type`, `Date`, `Start_Time`, `End_Time`, `IsValid`) VALUES
('election1', 'Presidental Election', '2025-07-31', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `party`
--

DROP TABLE IF EXISTS `party`;
CREATE TABLE IF NOT EXISTS `party` (
  `Party_ID` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PartyName_Sinhala` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PartyName_English` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Party_Logo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`Party_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `party`
--

INSERT INTO `party` (`Party_ID`, `PartyName_Sinhala`, `PartyName_English`, `Party_Logo`) VALUES
('party1', 'ජාතික ජන බලවේගය', 'National People\'s Power (NPP)', 'C:\\wamp64\\www\\voting_system\\upload\\npp.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `vote`
--

DROP TABLE IF EXISTS `vote`;
CREATE TABLE IF NOT EXISTS `vote` (
  `BallotID` int NOT NULL AUTO_INCREMENT,
  `Preference` enum('First','Second') COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_ID` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Election_ID` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  `STATUS` enum('Pending','Voted') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`BallotID`,`Preference`),
  KEY `Candidate_ID` (`Candidate_ID`),
  KEY `Election_ID` (`Election_ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `voter`
--

DROP TABLE IF EXISTS `voter`;
CREATE TABLE IF NOT EXISTS `voter` (
  `NIC` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FullName_Sinhala` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FullName_English` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Gender` enum('Male','Female','Other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `DOB` date NOT NULL,
  `Address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Mobile_Number` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Electoral_Division` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Polling_Division` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Gramaniladhari_Division` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `STATUS` enum('Pending','Voted') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`NIC`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `voter`
--

INSERT INTO `voter` (`NIC`, `FullName_Sinhala`, `FullName_English`, `Gender`, `DOB`, `Address`, `Mobile_Number`, `Email`, `Electoral_Division`, `Polling_Division`, `Gramaniladhari_Division`, `STATUS`) VALUES
('200020500221', 'වැලිහිඳ බඩල්ගේ තිසර දේශිත සුමනවීර', 'Welihinda Badalge Thisara Deshitha Sumanaweera', 'Male', '2000-07-23', '314/A, Sudharmarama Road, Bataduwa, Galle', '0716204513', 'thisaradeshitha123@gmail.com', 'Galle', 'Akmeemana', 'Bataduwa', NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `candidate`
--
ALTER TABLE `candidate`
  ADD CONSTRAINT `fk_candidate_election` FOREIGN KEY (`Election_ID`) REFERENCES `election` (`Election_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_candidate_party` FOREIGN KEY (`Party_ID`) REFERENCES `party` (`Party_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
