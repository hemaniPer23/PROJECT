-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 13, 2025 at 07:48 PM
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
  `Admin_ID` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Admin_UserName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Admin_Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Admin_Role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`Admin_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`Admin_ID`, `Admin_UserName`, `Admin_Password`, `Admin_Role`) VALUES
('001', 'admin3', '456#', 'Result'),
('12085', 'WMEKTDB WIKKRAMASINGHA', 'abc@123', 'Presiding Officer'),
('12086', 'Officer01', 'abc@456', 'Officer'),
('admin01', 'admin1', '123', 'commission');

-- --------------------------------------------------------

--
-- Table structure for table `candidate`
--

DROP TABLE IF EXISTS `candidate`;
CREATE TABLE IF NOT EXISTS `candidate` (
  `Candidate_ID` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_FullName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_UserName_Sinhala` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_UserName_English` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_NIC` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_Gender` enum('Male','Female','Other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_DOB` date NOT NULL,
  `Image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_Number` int DEFAULT NULL,
  `Party_ID` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Election_ID` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`Candidate_ID`),
  KEY `fk_candidate_party` (`Party_ID`),
  KEY `fk_candidate_election` (`Election_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate`
--

INSERT INTO `candidate` (`Candidate_ID`, `Candidate_FullName`, `Candidate_UserName_Sinhala`, `Candidate_UserName_English`, `Candidate_NIC`, `Candidate_Gender`, `Candidate_DOB`, `Image`, `Candidate_Number`, `Party_ID`, `Election_ID`) VALUES
('CANDIDATE1', 'Madirigirige Supun Shantha Handapana', 'ශාන්ත හඳපාන', 'Shantha Handapana', '791028456V', 'Male', '1979-04-12', 'C:\\wamp64\\www\\PROJECT\\backend\\uploads\\candidate_images\\Shantha_Handapana.jpg', NULL, 'PARTY1', 'election1'),
('CANDIDATE2', 'Suduhewage Parama Piwithuru Kusalarachchi', 'පරම පිවිතුරු කුසලාරච්චි', 'Parama Piwithuru Kusalarachchi', '532709801V', 'Male', '1953-09-27', 'C:\\wamp64\\www\\PROJECT\\backend\\uploads\\candidate_images\\Parama_Piwithuru_Kusalarachchi.jpg', NULL, 'PARTY2', 'election1'),
('CANDIDATE3', 'Kapuralage Ananda Arunachalam Perera', 'අරුණාචලම් පෙරේරා', 'Arunachalam Perera', '861553214V', 'Male', '1986-06-04', 'C:\\wamp64\\www\\PROJECT\\backend\\uploads\\candidate_images\\Arunachalam_Perera.jpg', NULL, 'PARTY3', 'election1'),
('CANDIDATE4', 'Rajaguruge Sumana Boralugoda', 'සුමනා බොරලුගොඩ', 'Sumana Boralugoda', '199064502341', 'Female', '1990-05-25', 'C:\\wamp64\\www\\PROJECT\\backend\\uploads\\candidate_images\\Sumana_Boralugoda.jpg', NULL, 'PARTY4', 'election1');

-- --------------------------------------------------------

--
-- Table structure for table `divisions`
--

DROP TABLE IF EXISTS `divisions`;
CREATE TABLE IF NOT EXISTS `divisions` (
  `Division_ID` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Division_Code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Electoral_Division` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Polling_Division` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Gramaniladhari_Division` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `IsActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`Division_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `divisions`
--

INSERT INTO `divisions` (`Division_ID`, `Division_Code`, `Electoral_Division`, `Polling_Division`, `Gramaniladhari_Division`, `IsActive`) VALUES
('DIV001', 'COL-CC-C01', 'Colombo', 'Colombo Central', 'Colombo 01', 1),
('DIV002', 'COL-CC-C02', 'Colombo', 'Colombo Central', 'Colombo 02', 1),
('DIV003', 'COL-CC-C03', 'Colombo', 'Colombo Central', 'Colombo 03', 1),
('DIV004', 'COL-CC-C10', 'Colombo', 'Colombo Central', 'Colombo 10', 1),
('DIV005', 'COL-CN-C05', 'Colombo', 'Colombo North', 'Colombo 05', 1),
('DIV006', 'COL-CN-C06', 'Colombo', 'Colombo North', 'Colombo 06', 1),
('DIV007', 'COL-CN-C07', 'Colombo', 'Colombo North', 'Colombo 07', 1),
('DIV008', 'COL-CN-C14', 'Colombo', 'Colombo North', 'Colombo 14', 1),
('DIV009', 'COL-CS-C08', 'Colombo', 'Colombo South', 'Colombo 08', 1),
('DIV010', 'COL-CS-C04', 'Colombo', 'Colombo South', 'Colombo 04', 1),
('DIV011', 'COL-CS-C09', 'Colombo', 'Colombo South', 'Colombo 09', 1),
('DIV012', 'COL-CS-MOU', 'Colombo', 'Colombo South', 'Mount Lavinia', 1),
('DIV013', 'COL-CE-C11', 'Colombo', 'Colombo East', 'Colombo 11', 1),
('DIV014', 'COL-CE-C12', 'Colombo', 'Colombo East', 'Colombo 12', 1),
('DIV015', 'COL-CE-C13', 'Colombo', 'Colombo East', 'Colombo 13', 1),
('DIV016', 'COL-CE-C15', 'Colombo', 'Colombo East', 'Colombo 15', 1),
('DIV017', 'GAM-GAM-GAM', 'Gampaha', 'Gampaha', 'Gampaha', 1),
('DIV018', 'GAM-GAM-YAK', 'Gampaha', 'Gampaha', 'Yakkala', 1),
('DIV019', 'GAM-GAM-MIR', 'Gampaha', 'Gampaha', 'Miriswatta', 1),
('DIV020', 'GAM-GAM-DOM', 'Gampaha', 'Gampaha', 'Dompe', 1),
('DIV021', 'GAM-ATT-ATT', 'Gampaha', 'Attanagalla', 'Attanagalla', 1),
('DIV022', 'GAM-ATT-KOR', 'Gampaha', 'Attanagalla', 'Kochchikade', 1),
('DIV023', 'GAM-ATT-GAN', 'Gampaha', 'Attanagalla', 'Gampaha', 1),
('DIV024', 'GAM-ATT-VEY', 'Gampaha', 'Attanagalla', 'Veyangoda', 1),
('DIV025', 'GAM-MIN-MIN', 'Gampaha', 'Minuwangoda', 'Minuwangoda', 1),
('DIV026', 'GAM-MIN-KAT', 'Gampaha', 'Minuwangoda', 'Katunayake', 1),
('DIV027', 'GAM-MIN-SEE', 'Gampaha', 'Minuwangoda', 'Seeduwa', 1),
('DIV028', 'GAM-MIN-NEG', 'Gampaha', 'Minuwangoda', 'Negombo', 1),
('DIV029', 'GAM-NEG-NEG', 'Gampaha', 'Negombo', 'Negombo', 1),
('DIV030', 'GAM-NEG-KAT', 'Gampaha', 'Negombo', 'Katana', 1),
('DIV031', 'GAM-NEG-KOR', 'Gampaha', 'Negombo', 'Kochchikade', 1),
('DIV032', 'GAM-NEG-DAI', 'Gampaha', 'Negombo', 'Daivagna', 1),
('DIV033', 'GAM-KAL-KAL', 'Gampaha', 'Kalutara', 'Kalutara North', 1),
('DIV034', 'GAM-KAL-AGI', 'Gampaha', 'Kalutara', 'Agalawatta', 1),
('DIV035', 'GAM-KAL-DOD', 'Gampaha', 'Kalutara', 'Dodangoda', 1),
('DIV036', 'GAM-KAL-WAD', 'Gampaha', 'Kalutara', 'Wadduwa', 1),
('DIV037', 'KAL-KAL-KAL', 'Kalutara', 'Kalutara', 'Kalutara', 1),
('DIV038', 'KAL-KAL-BER', 'Kalutara', 'Kalutara', 'Beruwala', 1),
('DIV039', 'KAL-KAL-ALU', 'Kalutara', 'Kalutara', 'Aluthgama', 1),
('DIV040', 'KAL-KAL-BEN', 'Kalutara', 'Kalutara', 'Bentota', 1),
('DIV041', 'KAL-PAN-PAN', 'Kalutara', 'Panadura', 'Panadura', 1),
('DIV042', 'KAL-PAN-BAD', 'Kalutara', 'Panadura', 'Bandaragama', 1),
('DIV043', 'KAL-PAN-HOD', 'Kalutara', 'Panadura', 'Horana', 1),
('DIV044', 'KAL-PAN-PIL', 'Kalutara', 'Panadura', 'Piliyandala', 1),
('DIV045', 'KAL-HOD-HOD', 'Kalutara', 'Horana', 'Horana', 1),
('DIV046', 'KAL-HOD-PIN', 'Kalutara', 'Horana', 'Pinyawa', 1),
('DIV047', 'KAL-HOD-MIL', 'Kalutara', 'Horana', 'Millewa', 1),
('DIV048', 'KAL-HOD-BUL', 'Kalutara', 'Horana', 'Bulathkohupitiya', 1),
('DIV049', 'GAL-GAL-GAL', 'Galle', 'Galle', 'Galle Four Gravets', 1),
('DIV050', 'GAL-GAL-HAK', 'Galle', 'Galle', 'Hakmana', 1),
('DIV051', 'GAL-GAL-BOP', 'Galle', 'Galle', 'Bope-Poddala', 1),
('DIV052', 'GAL-GAL-UDA', 'Galle', 'Galle', 'Udayana', 1),
('DIV053', 'GAL-BAL-BAL', 'Galle', 'Balapitiya', 'Balapitiya', 1),
('DIV054', 'GAL-BAL-AMB', 'Galle', 'Balapitiya', 'Ambalangoda', 1),
('DIV055', 'GAL-BAL-KAR', 'Galle', 'Balapitiya', 'Karandeniya', 1),
('DIV056', 'GAL-BAL-WAL', 'Galle', 'Balapitiya', 'Walasmulla', 1),
('DIV057', 'GAL-AKM-AKM', 'Galle', 'Akmeemana', 'Akmeemana', 1),
('DIV058', 'GAL-AKM-BAT', 'Galle', 'Akmeemana', 'Bataduwa', 1),
('DIV059', 'GAL-AKM-ELP', 'Galle', 'Akmeemana', 'Elpitiya', 1),
('DIV060', 'GAL-AKM-BEN', 'Galle', 'Akmeemana', 'Bentara', 1),
('DIV061', 'MAT-MAT-MAT', 'Matara', 'Matara', 'Matara Four Gravets', 1),
('DIV062', 'MAT-MAT-DIC', 'Matara', 'Matara', 'Dickwella', 1),
('DIV063', 'MAT-MAT-HAK', 'Matara', 'Matara', 'Hakmana', 1),
('DIV064', 'MAT-MAT-KAM', 'Matara', 'Matara', 'Kamburupitiya', 1),
('DIV065', 'MAT-WEL-WEL', 'Matara', 'Weligama', 'Weligama', 1),
('DIV066', 'MAT-WEL-MIR', 'Matara', 'Weligama', 'Mirissa', 1),
('DIV067', 'MAT-WEL-AHU', 'Matara', 'Weligama', 'Ahungalla', 1),
('DIV068', 'MAT-WEL-TAN', 'Matara', 'Weligama', 'Tangalle', 1),
('DIV069', 'MAT-TAN-TAN', 'Matara', 'Tangalle', 'Tangalle', 1),
('DIV070', 'MAT-TAN-BAL', 'Matara', 'Tangalle', 'Beliatta', 1),
('DIV071', 'MAT-TAN-SUR', 'Matara', 'Tangalle', 'Sooriyawewa', 1),
('DIV072', 'MAT-TAN-AMB', 'Matara', 'Tangalle', 'Ambalantota', 1),
('DIV073', 'HAM-HAM-HAM', 'Hambantota', 'Hambantota', 'Hambantota', 1),
('DIV074', 'HAM-HAM-TIS', 'Hambantota', 'Hambantota', 'Tissamaharama', 1),
('DIV075', 'HAM-HAM-KAT', 'Hambantota', 'Hambantota', 'Kataragama', 1),
('DIV076', 'HAM-HAM-SUR', 'Hambantota', 'Hambantota', 'Sooriyawewa', 1),
('DIV077', 'HAM-TIS-TIS', 'Hambantota', 'Tissamaharama', 'Tissamaharama', 1),
('DIV078', 'HAM-TIS-KIR', 'Hambantota', 'Tissamaharama', 'Kirinda', 1),
('DIV079', 'HAM-TIS-YAL', 'Hambantota', 'Tissamaharama', 'Yala', 1),
('DIV080', 'HAM-TIS-WAL', 'Hambantota', 'Tissamaharama', 'Walawa', 1),
('DIV081', 'RAT-RAT-RAT', 'Ratnapura', 'Ratnapura', 'Ratnapura', 1),
('DIV082', 'RAT-RAT-NIT', 'Ratnapura', 'Ratnapura', 'Nivitigala', 1),
('DIV083', 'RAT-RAT-AVE', 'Ratnapura', 'Ratnapura', 'Avissawella', 1),
('DIV084', 'RAT-RAT-EHA', 'Ratnapura', 'Ratnapura', 'Eheliyagoda', 1),
('DIV085', 'RAT-BAL-BAL', 'Ratnapura', 'Balangoda', 'Balangoda', 1),
('DIV086', 'RAT-BAL-RAN', 'Ratnapura', 'Balangoda', 'Randeniya', 1),
('DIV087', 'RAT-BAL-RAK', 'Ratnapura', 'Balangoda', 'Rakwana', 1),
('DIV088', 'RAT-BAL-ELA', 'Ratnapura', 'Balangoda', 'Elapatha', 1),
('DIV089', 'RAT-KEG-KEG', 'Ratnapura', 'Kegalle', 'Kegalle', 1),
('DIV090', 'RAT-KEG-RUW', 'Ratnapura', 'Kegalle', 'Ruwanwella', 1),
('DIV091', 'RAT-KEG-KUR', 'Ratnapura', 'Kegalle', 'Kuruwita', 1),
('DIV092', 'RAT-KEG-DED', 'Ratnapura', 'Kegalle', 'Deraniyagala', 1),
('DIV093', 'KEG-KEG-KEG', 'Kegalle', 'Kegalle', 'Kegalle', 1),
('DIV094', 'KEG-KEG-WAR', 'Kegalle', 'Kegalle', 'Warakapola', 1),
('DIV095', 'KEG-KEG-RAM', 'Kegalle', 'Kegalle', 'Rambukkana', 1),
('DIV096', 'KEG-KEG-MUS', 'Kegalle', 'Kegalle', 'Mussali', 1),
('DIV097', 'KEG-RUW-RUW', 'Kegalle', 'Ruwanwella', 'Ruwanwella', 1),
('DIV098', 'KEG-RUW-AVI', 'Kegalle', 'Ruwanwella', 'Avissawella', 1),
('DIV099', 'KEG-RUW-YAT', 'Kegalle', 'Ruwanwella', 'Yatiyantota', 1),
('DIV100', 'KEG-RUW-KIT', 'Kegalle', 'Ruwanwella', 'Kitulgala', 1),
('DIV101', 'KEG-DED-DED', 'Kegalle', 'Deraniyagala', 'Deraniyagala', 1),
('DIV102', 'KEG-DED-KAR', 'Kegalle', 'Deraniyagala', 'Karawanella', 1),
('DIV103', 'KEG-DED-BUL', 'Kegalle', 'Deraniyagala', 'Bulathkohupitiya', 1),
('DIV104', 'KEG-DED-GAL', 'Kegalle', 'Deraniyagala', 'Galagedera', 1),
('DIV105', 'KAN-KAN-KAN', 'Kandy', 'Kandy', 'Kandy Four Gravets', 1),
('DIV106', 'KAN-KAN-AKU', 'Kandy', 'Kandy', 'Akurana', 1),
('DIV107', 'KAN-KAN-PER', 'Kandy', 'Kandy', 'Peradeniya', 1),
('DIV108', 'KAN-KAN-GUN', 'Kandy', 'Kandy', 'Gunnepana', 1),
('DIV109', 'KAN-GAM-GAM', 'Kandy', 'Gampola', 'Gampola', 1),
('DIV110', 'KAN-GAM-UKU', 'Kandy', 'Gampola', 'Ukuwela', 1),
('DIV111', 'KAN-GAM-NAW', 'Kandy', 'Gampola', 'Nawalapitiya', 1),
('DIV112', 'KAN-GAM-AVI', 'Kandy', 'Gampola', 'Avissawella', 1),
('DIV113', 'KAN-DAW-DAW', 'Kandy', 'Dambulla', 'Dambulla', 1),
('DIV114', 'KAN-DAW-GAL', 'Kandy', 'Dambulla', 'Galewela', 1),
('DIV115', 'KAN-DAW-UKU', 'Kandy', 'Dambulla', 'Ukuwela', 1),
('DIV116', 'KAN-DAW-RAN', 'Kandy', 'Dambulla', 'Rattota', 1),
('DIV117', 'KAN-TEL-TEL', 'Kandy', 'Teldeniya', 'Teldeniya', 1),
('DIV118', 'KAN-TEL-KUN', 'Kandy', 'Teldeniya', 'Kundasale', 1),
('DIV119', 'KAN-TEL-PAN', 'Kandy', 'Teldeniya', 'Panvila', 1),
('DIV120', 'KAN-TEL-MED', 'Kandy', 'Teldeniya', 'Medadumbara', 1),
('DIV121', 'MAL-MAL-MAL', 'Matale', 'Matale', 'Matale', 1),
('DIV122', 'MAL-MAL-DAM', 'Matale', 'Matale', 'Dambulla', 1),
('DIV123', 'MAL-MAL-GAL', 'Matale', 'Matale', 'Galewela', 1),
('DIV124', 'MAL-MAL-NAU', 'Matale', 'Matale', 'Naula', 1),
('DIV125', 'MAL-DAM-DAM', 'Matale', 'Dambulla', 'Dambulla', 1),
('DIV126', 'MAL-DAM-GAL', 'Matale', 'Dambulla', 'Galewela', 1),
('DIV127', 'MAL-DAM-LAG', 'Matale', 'Dambulla', 'Laggala', 1),
('DIV128', 'MAL-DAM-RAN', 'Matale', 'Dambulla', 'Rattota', 1),
('DIV129', 'NUW-NUW-NUW', 'Nuwara Eliya', 'Nuwara Eliya', 'Nuwara Eliya', 1),
('DIV130', 'NUW-NUW-HAG', 'Nuwara Eliya', 'Nuwara Eliya', 'Haguranketha', 1),
('DIV131', 'NUW-NUW-WAL', 'Nuwara Eliya', 'Nuwara Eliya', 'Walapane', 1),
('DIV132', 'NUW-NUW-KOT', 'Nuwara Eliya', 'Nuwara Eliya', 'Kotmale', 1),
('DIV133', 'NUW-MAS-MAS', 'Nuwara Eliya', 'Maskeliya', 'Maskeliya', 1),
('DIV134', 'NUW-MAS-NOD', 'Nuwara Eliya', 'Maskeliya', 'Norton Bridge', 1),
('DIV135', 'NUW-MAS-LIN', 'Nuwara Eliya', 'Maskeliya', 'Lindelula', 1),
('DIV136', 'NUW-MAS-AGR', 'Nuwara Eliya', 'Maskeliya', 'Agarapatana', 1),
('DIV137', 'BAD-BAD-BAD', 'Badulla', 'Badulla', 'Badulla', 1),
('DIV138', 'BAD-BAD-HAL', 'Badulla', 'Badulla', 'Hali-Ela', 1),
('DIV139', 'BAD-BAD-ELL', 'Badulla', 'Badulla', 'Ella', 1),
('DIV140', 'BAD-BAD-WEL', 'Badulla', 'Badulla', 'Welimada', 1),
('DIV141', 'BAD-BAN-BAN', 'Badulla', 'Bandarawela', 'Bandarawela', 1),
('DIV142', 'BAD-BAN-HAP', 'Badulla', 'Bandarawela', 'Haputale', 1),
('DIV143', 'BAD-BAN-DEI', 'Badulla', 'Bandarawela', 'Deiyandara', 1),
('DIV144', 'BAD-BAN-ELL', 'Badulla', 'Bandarawela', 'Ella', 1),
('DIV145', 'BAD-MON-MON', 'Badulla', 'Monaragala', 'Monaragala', 1),
('DIV146', 'BAD-MON-BUT', 'Badulla', 'Monaragala', 'Buttala', 1),
('DIV147', 'BAD-MON-OKA', 'Badulla', 'Monaragala', 'Okkampitiya', 1),
('DIV148', 'BAD-MON-WEL', 'Badulla', 'Monaragala', 'Wellawaya', 1),
('DIV149', 'MON-MON-MON', 'Monaragala', 'Monaragala', 'Monaragala', 1),
('DIV150', 'MON-MON-BUT', 'Monaragala', 'Monaragala', 'Buttala', 1),
('DIV151', 'MON-MON-WEL', 'Monaragala', 'Monaragala', 'Wellawaya', 1),
('DIV152', 'MON-MON-BIB', 'Monaragala', 'Monaragala', 'Bibila', 1),
('DIV153', 'MON-BUT-BUT', 'Monaragala', 'Buttala', 'Buttala', 1),
('DIV154', 'MON-BUT-OKA', 'Monaragala', 'Buttala', 'Okkampitiya', 1),
('DIV155', 'MON-BUT-SIY', 'Monaragala', 'Buttala', 'Siyambalanduwa', 1),
('DIV156', 'MON-BUT-MAD', 'Monaragala', 'Buttala', 'Madulla', 1),
('DIV157', 'KUR-KUR-KUR', 'Kurunegala', 'Kurunegala', 'Kurunegala', 1),
('DIV158', 'KUR-KUR-KUL', 'Kurunegala', 'Kurunegala', 'Kuliyapitiya', 1),
('DIV159', 'KUR-KUR-DAM', 'Kurunegala', 'Kurunegala', 'Dambadeniya', 1),
('DIV160', 'KUR-KUR-ALW', 'Kurunegala', 'Kurunegala', 'Alawwa', 1),
('DIV161', 'KUR-GIR-GIR', 'Kurunegala', 'Giriulla', 'Giriulla', 1),
('DIV162', 'KUR-GIR-BIN', 'Kurunegala', 'Giriulla', 'Bingiriya', 1),
('DIV163', 'KUR-GIR-NIK', 'Kurunegala', 'Giriulla', 'Nikaweratiya', 1),
('DIV164', 'KUR-GIR-HIR', 'Kurunegala', 'Giriulla', 'Hiriyala', 1),
('DIV165', 'KUR-WAR-WAR', 'Kurunegala', 'Wariyapola', 'Wariyapola', 1),
('DIV166', 'KUR-WAR-GIG', 'Kurunegala', 'Wariyapola', 'Galgamuwa', 1),
('DIV167', 'KUR-WAR-MAN', 'Kurunegala', 'Wariyapola', 'Mawathagama', 1),
('DIV168', 'KUR-WAR-POL', 'Kurunegala', 'Wariyapola', 'Polpithigama', 1),
('DIV169', 'PUT-PUT-PUT', 'Puttalam', 'Puttalam', 'Puttalam', 1),
('DIV170', 'PUT-PUT-CHI', 'Puttalam', 'Puttalam', 'Chilaw', 1),
('DIV171', 'PUT-PUT-NAT', 'Puttalam', 'Puttalam', 'Nattandiya', 1),
('DIV172', 'PUT-PUT-WEN', 'Puttalam', 'Puttalam', 'Wennappuwa', 1),
('DIV173', 'PUT-CHI-CHI', 'Puttalam', 'Chilaw', 'Chilaw', 1),
('DIV174', 'PUT-CHI-NAT', 'Puttalam', 'Chilaw', 'Nattandiya', 1),
('DIV175', 'PUT-CHI-MAN', 'Puttalam', 'Chilaw', 'Madurankuliya', 1),
('DIV176', 'PUT-CHI-DAN', 'Puttalam', 'Chilaw', 'Dankotuwa', 1),
('DIV177', 'PUT-ANA-ANA', 'Puttalam', 'Anamaduwa', 'Anamaduwa', 1),
('DIV178', 'PUT-ANA-KEE', 'Puttalam', 'Anamaduwa', 'Kekirawa', 1),
('DIV179', 'PUT-ANA-GAN', 'Puttalam', 'Anamaduwa', 'Ganewatta', 1),
('DIV180', 'PUT-ANA-PAD', 'Puttalam', 'Anamaduwa', 'Palavi', 1),
('DIV181', 'ANU-ANU-ANU', 'Anuradhapura', 'Anuradhapura', 'Anuradhapura', 1),
('DIV182', 'ANU-ANU-MED', 'Anuradhapura', 'Anuradhapura', 'Medawachchiya', 1),
('DIV183', 'ANU-ANU-HOD', 'Anuradhapura', 'Anuradhapura', 'Horowpothana', 1),
('DIV184', 'ANU-ANU-KAH', 'Anuradhapura', 'Anuradhapura', 'Kahatagasdigiliya', 1),
('DIV185', 'ANU-KEE-KEE', 'Anuradhapura', 'Kekirawa', 'Kekirawa', 1),
('DIV186', 'ANU-KEE-GAL', 'Anuradhapura', 'Kekirawa', 'Galenbindunuwewa', 1),
('DIV187', 'ANU-KEE-HIR', 'Anuradhapura', 'Kekirawa', 'Hiriyala', 1),
('DIV188', 'ANU-KEE-RAJ', 'Anuradhapura', 'Kekirawa', 'Rajangane', 1),
('DIV189', 'ANU-MED-MED', 'Anuradhapura', 'Medawachchiya', 'Medawachchiya', 1),
('DIV190', 'ANU-MED-PAD', 'Anuradhapura', 'Medawachchiya', 'Padaviya', 1),
('DIV191', 'ANU-MED-MAD', 'Anuradhapura', 'Medawachchiya', 'Madawachchiya', 1),
('DIV192', 'ANU-MED-RAM', 'Anuradhapura', 'Medawachchiya', 'Rajanganaya', 1),
('DIV193', 'POL-POL-POL', 'Polonnaruwa', 'Polonnaruwa', 'Polonnaruwa', 1),
('DIV194', 'POL-POL-MED', 'Polonnaruwa', 'Polonnaruwa', 'Medirigiriya', 1),
('DIV195', 'POL-POL-DIM', 'Polonnaruwa', 'Polonnaruwa', 'Dimbulagala', 1),
('DIV196', 'POL-POL-LAG', 'Polonnaruwa', 'Polonnaruwa', 'Lankapura', 1),
('DIV197', 'POL-MED-MED', 'Polonnaruwa', 'Medirigiriya', 'Medirigiriya', 1),
('DIV198', 'POL-MED-HIG', 'Polonnaruwa', 'Medirigiriya', 'Hingurakgoda', 1),
('DIV199', 'POL-MED-ELL', 'Polonnaruwa', 'Medirigiriya', 'Elahera', 1),
('DIV200', 'POL-MED-ARU', 'Polonnaruwa', 'Medirigiriya', 'Aralaganwila', 1),
('DIV201', 'AMP-AMP-AMP', 'Ampara', 'Ampara', 'Ampara', 1),
('DIV202', 'AMP-AMP-AKK', 'Ampara', 'Ampara', 'Akkaraipattu', 1),
('DIV203', 'AMP-AMP-KAL', 'Ampara', 'Ampara', 'Kalmunai', 1),
('DIV204', 'AMP-AMP-SAM', 'Ampara', 'Ampara', 'Sammanthurai', 1),
('DIV205', 'AMP-KAL-KAL', 'Ampara', 'Kalmunai', 'Kalmunai', 1),
('DIV206', 'AMP-KAL-AKK', 'Ampara', 'Kalmunai', 'Akkaraipattu', 1),
('DIV207', 'AMP-KAL-ADD', 'Ampara', 'Kalmunai', 'Addalachchenai', 1),
('DIV208', 'AMP-KAL-TIR', 'Ampara', 'Kalmunai', 'Tirukkovil', 1),
('DIV209', 'AMP-SAF-SAF', 'Ampara', 'Sainthamaruthu', 'Sainthamaruthu', 1),
('DIV210', 'AMP-SAF-KAR', 'Ampara', 'Sainthamaruthu', 'Karaitivu', 1),
('DIV211', 'AMP-SAF-NAI', 'Ampara', 'Sainthamaruthu', 'Naintativu', 1),
('DIV212', 'AMP-SAF-OLU', 'Ampara', 'Sainthamaruthu', 'Oluvil', 1),
('DIV213', 'BAT-BAT-BAT', 'Batticaloa', 'Batticaloa', 'Batticaloa', 1),
('DIV214', 'BAT-BAT-KAL', 'Batticaloa', 'Batticaloa', 'Kaluwanchikudy', 1),
('DIV215', 'BAT-BAT-VAL', 'Batticaloa', 'Batticaloa', 'Valachchenai', 1),
('DIV216', 'BAT-BAT-ERE', 'Batticaloa', 'Batticaloa', 'Eravur', 1),
('DIV217', 'BAT-KAT-KAT', 'Batticaloa', 'Kattankudy', 'Kattankudy', 1),
('DIV218', 'BAT-KAT-ERE', 'Batticaloa', 'Kattankudy', 'Eravur', 1),
('DIV219', 'BAT-KAT-PAD', 'Batticaloa', 'Kattankudy', 'Paddippalai', 1),
('DIV220', 'BAT-KAT-CHE', 'Batticaloa', 'Kattankudy', 'Chenkalady', 1),
('DIV221', 'TRI-TRI-TRI', 'Trincomalee', 'Trincomalee', 'Trincomalee', 1),
('DIV222', 'TRI-TRI-KAN', 'Trincomalee', 'Trincomalee', 'Kantale', 1),
('DIV223', 'TRI-TRI-SER', 'Trincomalee', 'Trincomalee', 'Seruvawila', 1),
('DIV224', 'TRI-TRI-MUT', 'Trincomalee', 'Trincomalee', 'Muttur', 1),
('DIV225', 'TRI-SER-SER', 'Trincomalee', 'Seruvawila', 'Seruvawila', 1),
('DIV226', 'TRI-SER-VER', 'Trincomalee', 'Seruvawila', 'Verugal', 1),
('DIV227', 'TRI-SER-ALL', 'Trincomalee', 'Seruvawila', 'Allai', 1),
('DIV228', 'TRI-SER-TOP', 'Trincomalee', 'Seruvawila', 'Toppur', 1),
('DIV229', 'VAV-VAV-VAV', 'Vavuniya', 'Vavuniya', 'Vavuniya', 1),
('DIV230', 'VAV-VAV-WEN', 'Vavuniya', 'Vavuniya', 'Vengalacheddikulam', 1),
('DIV231', 'VAV-VAV-NED', 'Vavuniya', 'Vavuniya', 'Nedunkeni', 1),
('DIV232', 'VAV-VAV-OMI', 'Vavuniya', 'Vavuniya', 'Omanthai', 1),
('DIV233', 'MAN-MAN-MAN', 'Mannar', 'Mannar', 'Mannar', 1),
('DIV234', 'MAN-MAN-MUS', 'Mannar', 'Mannar', 'Musali', 1),
('DIV235', 'MAN-MAN-NAD', 'Mannar', 'Mannar', 'Nanaddan', 1),
('DIV236', 'MAN-MAN-MAD', 'Mannar', 'Mannar', 'Madhu', 1),
('DIV237', 'MUL-MUL-MUL', 'Mullativu', 'Mullativu', 'Mullativu', 1),
('DIV238', 'MUL-MUL-PUT', 'Mullativu', 'Mullativu', 'Puthukudiyiruppu', 1),
('DIV239', 'MUL-MUL-THU', 'Mullativu', 'Mullativu', 'Thunukkai', 1),
('DIV240', 'MUL-MUL-WEL', 'Mullativu', 'Mullativu', 'Weli Oya', 1),
('DIV241', 'KIL-KIL-KIL', 'Kilinochchi', 'Kilinochchi', 'Kilinochchi', 1),
('DIV242', 'KIL-KIL-KAN', 'Kilinochchi', 'Kilinochchi', 'Kandawalai', 1),
('DIV243', 'KIL-KIL-PAR', 'Kilinochchi', 'Kilinochchi', 'Paranthan', 1),
('DIV244', 'KIL-KIL-PIL', 'Kilinochchi', 'Kilinochchi', 'Poonakary', 1),
('DIV245', 'JAF-JAF-JAF', 'Jaffna', 'Jaffna', 'Jaffna', 1),
('DIV246', 'JAF-JAF-NAL', 'Jaffna', 'Jaffna', 'Nallur', 1),
('DIV247', 'JAF-JAF-CHU', 'Jaffna', 'Jaffna', 'Chundikuli', 1),
('DIV248', 'JAF-JAF-VAL', 'Jaffna', 'Jaffna', 'Valikamam', 1),
('DIV249', 'JAF-KOP-KOP', 'Jaffna', 'Kopay', 'Kopay', 1),
('DIV250', 'JAF-KOP-VEL', 'Jaffna', 'Kopay', 'Velanai', 1),
('DIV251', 'JAF-KOP-KAR', 'Jaffna', 'Kopay', 'Karainagar', 1),
('DIV252', 'JAF-KOP-TEL', 'Jaffna', 'Kopay', 'Tellippalai', 1);

-- --------------------------------------------------------

--
-- Table structure for table `election`
--

DROP TABLE IF EXISTS `election`;
CREATE TABLE IF NOT EXISTS `election` (
  `Election_ID` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Election_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
('election1', 'Presidential Election', '2025-10-31', '07:00:00', '16:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `party`
--

DROP TABLE IF EXISTS `party`;
CREATE TABLE IF NOT EXISTS `party` (
  `Party_ID` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `PartyName_Sinhala` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `PartyName_English` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Party_Logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Party_Colour` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Party_Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Party_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `party`
--

INSERT INTO `party` (`Party_ID`, `PartyName_Sinhala`, `PartyName_English`, `Party_Logo`, `Party_Colour`, `Party_Description`) VALUES
('PARTY1', 'නිදහස් හා බුද්ධි සන්ධානය', 'Freedom And Wisdom Alliance (FWA)', 'C:\\wamp64\\www\\PROJECT\\backend\\uploads\\candidate_symbols\\Freedom_And_Wisdom_Alliance.jpeg', '#ffdc00', '\"නිදහස සහ බුද්ධිය සන්ධානය\" යනු මනුෂ්‍ය නිදහස, සාධාරණය සහ දැනුම මත පදනම් වූ රටක් ගොඩනගන්න කැපවූ ජාතික චලනයකි. අපගේ ලාංඡනය වන පැන්සල යනු දැනුම, නිවැරදි තීරණ සහ ජනතා මතය ලියන බලය නියෝජනය කරයි.'),
('PARTY2', 'ජාතික සමඟි පෙරමුණ', 'National Unity Front (NUF)', 'C:\\wamp64\\www\\PROJECT\\backend\\uploads\\candidate_symbols\\National_Unity_Front.jpeg', '#221d6f', '\"ජාතික සමඟි පෙරමුණ\" යනු කටයුතු හා පක්ෂ ක්‍රියාවලියන් සමඟිව පවත්වා ගන්නා ඉතාමත් ආකර්ෂණීය සංකල්පයක් වේ. නව තාක්ෂණය හා සමාජ ජාලා මගින්, පක්ෂ සාමාජිකයන්ට සහ මනාපදායකයන්ට ගෙදර සිටම සක්‍රියව දේශපාලන කටයුතු වල නිරත විය හැකි ජාතික පෙරමුණකි.'),
('PARTY3', 'ජාතික අරුණළු පෙරමුණ', 'National Dawn Front (NDF)', 'C:\\wamp64\\www\\PROJECT\\backend\\uploads\\candidate_symbols\\National_Dawn_Front.jpeg', '#1a9c6c', '\"ජාතික අරුණළු පෙරමුණ\" යනු යම්කිසි ආකාරයකින් පැවසුවහොත්, විවිධ ගැටලු හමුවේ වෙනස්වන හා වෙනස් කාරකයන්ට අනුව හැසිරවෙන පක්ෂයක් ලෙස හදුන්වනවා විය හැක. මෙය විවිධ සමාජ හා දේශපාලන අවස්ථාවලදී පෙනී යන ගැටලූ පිළිබඳව සිතීමට හා ඒ පිළිබඳව සාකච්ඡා කිරීමට යොමු කරයි'),
('PARTY4', 'නිදහස් වනිතා පක්ෂය', 'Independent Women Party (IWP)', 'C:\\wamp64\\www\\PROJECT\\backend\\uploads\\candidate_symbols\\Independent_Women_Party.jpeg', '#8c1429', '\"නිදහස් වනිතා පක්ෂය\" යනු ශ්‍රී ලංකාවේ කාන්තා අයිතිවාසිකම් සහ සමාජයීය සාධාරණය සඳහා කටයුතු කරන දේශපාලන සංවිධානයක් වේ. මෙම පක්ෂය කාන්තාවන්ගේ දේශපාලන සහ සමාජීය නියෝජනය, අධ්‍යාපන අවස්ථා විශාල කිරීම, සහ කාන්තා සුරක්ෂිතතාවය සහතික කිරීම අරමුණයි');

-- --------------------------------------------------------

--
-- Table structure for table `vote`
--

DROP TABLE IF EXISTS `vote`;
CREATE TABLE IF NOT EXISTS `vote` (
  `Ballot_ID` int NOT NULL AUTO_INCREMENT,
  `Preference` enum('1','2','3') COLLATE utf8mb4_unicode_ci NOT NULL,
  `Candidate_ID` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Election_ID` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Division_ID` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `STATUS` enum('Pending','Voted') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Ballot_ID`,`Preference`),
  KEY `fk_vote_candidate` (`Candidate_ID`),
  KEY `fk_vote_election` (`Election_ID`),
  KEY `fk_vote_division` (`Division_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  KEY `fk_voter_division` (`Division_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `voter`
--

INSERT INTO `voter` (`NIC`, `FullName_Sinhala`, `FullName_English`, `Gender`, `DOB`, `Address`, `Mobile_Number`, `Email`, `Division_ID`, `STATUS`) VALUES
('200010103861', 'ඩබ්.කේ. කවිදු මදුසංක', 'W.K. Kavindu Madushanka', 'Male', '2000-04-10', 'Rathnan sewana, Nattampitiya, Tawalama', '0711940527', 'kavindumadushanaka527@gmail.com', 'DIV054', ''),
('200011900097', 'ජයලත්ගේ චමිඳු ගිහන්ත ජයලත්', 'Jayalathge Chamindu Gihantha Jayalath', 'Male', '2028-04-20', '134/A, Miriswatta ,Bentota', '0768377104', 'chamindugihantha@gmail.com', 'DIV055', ''),
('200020500221', 'වැලිහිඳ බඩල්ගේ තිසර දේශිත සුමනවීර', 'Welihinda Badalge Thisara Deshitha Sumanaweera', 'Male', '2000-07-23', '314/A, Sudharmarama Road, Bataduwa, Galle', '0716204513', 'thisaradeshitha123@gmail.com', 'DIV055', ''),
('200034000056', 'කඩුපිටි සෙනිෂ්ක දිල්ෂාන් මධුරංග', 'Kadupiti Senishka Dilshan Madhuranga', 'Male', '2000-12-05', 'No:17/14, Suduwella Road, Thalgasgoda, Ambalangoda \r\n\r\n\r\n', '077 342172', 'madurangasenishka@gmail.com', 'DIV054', ''),
('200034502234', 'හවුපේ මානගේ උදිත මදුශංක', 'Howpe Manage Uditha Madushanka', 'Male', '2000-12-10', '217/2, Godauda, Howpe, Galle', '0762432850', 'madhushankauditha@gmail.com', 'DIV054', ''),
('200056500882', 'සසිනි අමන්දා නානායක්කාර', 'Sasini Amanda Nanayakkara', 'Female', '2000-03-05', '101, Karapitiya road, Godakanda, Galle', '0707707935', 'sasininanayakkara2000@gmail.com', 'DIV054', ''),
('200059100213', 'ඇල්වල දේවගේ ඉෂිනි විමන්ෂා', 'Elwala Dewage Ishini Wimansha', 'Female', '2000-03-31', '562/W/98, Walawwatta, Malwatta, Nittambuwa', '0753303851', 'ishiniwimansha31@gmail.com', 'DIV027', ''),
('200070201580', 'වන්නිආරච්චි කංකානම්ගේ තරුෂි නිමේෂිකා', 'Wanniarachchi kankanamge Tharushi Nimeshika', 'Female', '2000-07-20', '123/2, Unawatuna, Galle', '0766210905', 'tharushinimeshika2020@gmail.com', 'DIV056', ''),
('200105400548', 'රමිදු උවන්‍ත රුහුනගේ', 'Ramidu Uwantha Ruhunage', 'Male', '2001-02-23', 'Seenigoda, Balapitiya, Galle.', '076 664470', 'ramindu23@gmil.com', 'DIV053', ''),
('200114102284', 'යුෂාන් ඩිස්මිත හෙට්ටිආරච්චි', 'Yushan Dismitha Hettiarachchi', 'Male', '2001-05-20', '51, Dewala Road, Mahara Nugegoda, Kadawatha', '0767492276', 'YushanHettiarachchi@gmail.com', 'DIV025', ''),
('200167000130', 'ඩබ්.එම්.එස් භාග්‍යා මදුවන්ති', 'W.M.S.B. Maduwanthi', 'Female', '2001-06-18', '115/A, Ihala Imbulgoda,Imbulgoda', '0766624203', 'sbmwijesinghe@gmail.com', 'DIV025', ''),
('200167500137', 'කුරුගලගමගේ හේමානි රුමේෂිකා පෙරේරා', 'Kurugamage Hemani Rumeshika Perera', 'Female', '2001-06-23', 'No: 113/E, Pothukotuwa , Bandigoda ,Ja ela', '0776513391', 'hemaniperera@gmail.com', 'DIV027', ''),
('200170902141', 'මහීපාල මුදලිගේ සිනලි දෙව්නෙත්මි මහීපාල', 'Maheepala Mudalige Sinali Dewnethmi Maheepala', 'Female', '2001-07-27', '58/3, Wathurugama road, Miriswaththa, Mudungoda', '0704311954', 'sinalimaheepala27@gmail.com', 'DIV026', ''),
('200184303368', 'අකුරන්ගේ ජයනි නවෝද්‍යා දසනායක', 'Akurange Jayani Nawodya Dassanayake', 'Female', '2001-12-08', 'Yatiwala, Mudaliwaththa, Mawathagama.', '0768906164', 'jayaninawo2001@gmail.com', 'DIV056', ''),
('991491112V', 'වෙත්තසිංහ පේඩිගේ රුචිර හංසන චතුරංග', 'Weththasinghe Pedige Ruchira Hansana Chathuranga ', 'Male', '1999-05-28', 'No:219 , Doranagaoda East, Bemmulla.', '071 069926', 'ruchirahansana12@gmail.com', 'DIV028', ''),
('997760344V', 'බේරුවලගේ ඉශාරා උදාරි', 'Beruwalage Ishara Udari', 'Female', '1999-10-02', 'Batapola Road, Meetiyagoda', '0767640435', 'udariberuwalage99@gmail.com', 'DIV055', '');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `candidate`
--
ALTER TABLE `candidate`
  ADD CONSTRAINT `fk_candidate_election` FOREIGN KEY (`Election_ID`) REFERENCES `election` (`Election_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_candidate_party` FOREIGN KEY (`Party_ID`) REFERENCES `party` (`Party_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vote`
--
ALTER TABLE `vote`
  ADD CONSTRAINT `fk_vote_candidate` FOREIGN KEY (`Candidate_ID`) REFERENCES `candidate` (`Candidate_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vote_division` FOREIGN KEY (`Division_ID`) REFERENCES `divisions` (`Division_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vote_election` FOREIGN KEY (`Election_ID`) REFERENCES `election` (`Election_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `voter`
--
ALTER TABLE `voter`
  ADD CONSTRAINT `fk_voter_division` FOREIGN KEY (`Division_ID`) REFERENCES `divisions` (`Division_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
