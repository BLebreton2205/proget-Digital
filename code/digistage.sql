-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : mer. 19 jan. 2022 à 10:11
-- Version du serveur : 8.0.27
-- Version de PHP : 7.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `digistage`
--

-- --------------------------------------------------------

--
-- Structure de la table `CURSUS`
--

CREATE TABLE `CURSUS` (
  `ID_CURSUS` int NOT NULL,
  `Nom` int NOT NULL,
  `Description` int DEFAULT NULL,
  `infos` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ENTREPRISE`
--

CREATE TABLE `ENTREPRISE` (
  `ID_ENTREPRISE` int NOT NULL,
  `Nom` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Description` text,
  `SiteWeb` varchar(100) DEFAULT NULL,
  `Linkedin` varchar(100) DEFAULT NULL,
  `Twitter` varchar(100) DEFAULT NULL,
  `Facebook` varchar(100) DEFAULT NULL,
  `Mdp` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ETABLISSEMENT`
--

CREATE TABLE `ETABLISSEMENT` (
  `ID_ECOLE` int NOT NULL,
  `Nom` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Description` mediumtext,
  `SiteWeb` varchar(100) DEFAULT NULL,
  `Linkedin` varchar(100) DEFAULT NULL,
  `Twitter` varchar(100) DEFAULT NULL,
  `Facebook` varchar(100) DEFAULT NULL,
  `Mdp` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ETUDIANT`
--

CREATE TABLE `ETUDIANT` (
  `ID_ETUDIANT` int NOT NULL,
  `Nom` varchar(100) NOT NULL,
  `Prenom` varchar(100) NOT NULL,
  `Cursus` varchar(200) NOT NULL,
  `Email` varchar(200) NOT NULL,
  `Numero` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `CV` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `SiteWeb` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Linkedin` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Twitter` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Facebook` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Github` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `GitLab` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `StackOverflow` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `mdp` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `STAGE`
--

CREATE TABLE `STAGE` (
  `ID_StAGE` int NOT NULL,
  `Nom` varchar(100) NOT NULL,
  `Description` text,
  `infos` mediumtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `CURSUS`
--
ALTER TABLE `CURSUS`
  ADD PRIMARY KEY (`ID_CURSUS`),
  ADD UNIQUE KEY `ID_CURSUS` (`ID_CURSUS`);

--
-- Index pour la table `ENTREPRISE`
--
ALTER TABLE `ENTREPRISE`
  ADD PRIMARY KEY (`ID_ENTREPRISE`);

--
-- Index pour la table `ETABLISSEMENT`
--
ALTER TABLE `ETABLISSEMENT`
  ADD PRIMARY KEY (`ID_ECOLE`);

--
-- Index pour la table `ETUDIANT`
--
ALTER TABLE `ETUDIANT`
  ADD PRIMARY KEY (`ID_ETUDIANT`),
  ADD UNIQUE KEY `ID_ETUDIANT` (`ID_ETUDIANT`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
