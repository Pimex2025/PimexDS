-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-09-2025 a las 02:41:35
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pimexds`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('superadmin','admin','moderator') DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `full_name`, `email`, `role`, `is_active`, `last_login`, `created_at`) VALUES
(1, 'PimexDS', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador Principal', 'admin@pimexds.com', 'superadmin', 1, NULL, '2025-09-04 00:30:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `analysis_documents`
--

CREATE TABLE `analysis_documents` (
  `id` int(11) NOT NULL,
  `analysis_id` int(11) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `saved_name` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `file_hash` varchar(32) NOT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comparison_results`
--

CREATE TABLE `comparison_results` (
  `id` int(11) NOT NULL,
  `analysis_id` int(11) NOT NULL,
  `comparison_type` varchar(50) NOT NULL,
  `similarity_score` float DEFAULT NULL,
  `status` enum('match','partial_match','no_match') NOT NULL,
  `reference_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`reference_data`)),
  `compared_with` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `country_code` varchar(2) NOT NULL,
  `country_name` varchar(100) NOT NULL,
  `phone_code` varchar(5) NOT NULL,
  `flag_emoji` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `countries`
--

INSERT INTO `countries` (`id`, `country_code`, `country_name`, `phone_code`, `flag_emoji`, `created_at`) VALUES
(1, 'GQ', 'Guinea Ecuatorial', '+240', '🇬🇶', '2025-09-04 00:30:40'),
(2, 'CM', 'Camerún', '+237', '🇨🇲', '2025-09-04 00:30:40'),
(3, 'GA', 'Gabón', '+241', '🇬🇦', '2025-09-04 00:30:40'),
(4, 'NG', 'Nigeria', '+234', '🇳🇬', '2025-09-04 00:30:40'),
(5, 'ES', 'España', '+34', '🇪🇸', '2025-09-04 00:30:40'),
(6, 'FR', 'Francia', '+33', '🇫🇷', '2025-09-04 00:30:40'),
(7, 'US', 'Estados Unidos', '+1', '🇺🇸', '2025-09-04 00:30:40'),
(8, 'MX', 'México', '+52', '🇲🇽', '2025-09-04 00:30:40'),
(9, 'AR', 'Argentina', '+54', '🇦🇷', '2025-09-04 00:30:40'),
(10, 'CN', 'China', '+86', '🇨🇳', '2025-09-04 00:30:40'),
(11, 'BR', 'Brasil', '+55', '🇧🇷', '2025-09-04 00:30:40'),
(12, 'DE', 'Alemania', '+49', '🇩🇪', '2025-09-04 00:30:40'),
(13, 'IT', 'Italia', '+39', '🇮🇹', '2025-09-04 00:30:40'),
(14, 'RU', 'Rusia', '+7', '🇷🇺', '2025-09-04 00:30:40'),
(15, 'ZA', 'Sudáfrica', '+27', '🇿🇦', '2025-09-04 00:30:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `document_analyses`
--

CREATE TABLE `document_analyses` (
  `id` int(11) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `authenticity_score` float NOT NULL,
  `confidence_level` float NOT NULL,
  `document_type` varchar(50) DEFAULT NULL,
  `file_size` varchar(20) DEFAULT NULL,
  `resolution` varchar(20) DEFAULT NULL,
  `analysis_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `processing_time` int(11) DEFAULT NULL,
  `is_authentic` tinyint(1) DEFAULT NULL,
  `results_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`results_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `document_templates`
--

CREATE TABLE `document_templates` (
  `id` int(11) NOT NULL,
  `country_code` varchar(2) NOT NULL,
  `document_type` varchar(100) NOT NULL,
  `institution_type` varchar(100) DEFAULT NULL,
  `template_name` varchar(255) NOT NULL,
  `template_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`template_data`)),
  `security_features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`security_features`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entities`
--

CREATE TABLE `entities` (
  `id` int(11) NOT NULL,
  `entity_name` varchar(255) NOT NULL,
  `entity_type` enum('government','education','business','church','police','health','ngo') NOT NULL,
  `country_code` varchar(2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `sector` varchar(100) NOT NULL,
  `pyme` tinyint(1) DEFAULT 0,
  `contact_person` varchar(255) NOT NULL,
  `contact_email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo_path` varchar(500) DEFAULT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('active','inactive','pending') DEFAULT 'active',
  `verification_token` varchar(100) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metadata_results`
--

CREATE TABLE `metadata_results` (
  `id` int(11) NOT NULL,
  `analysis_id` int(11) NOT NULL,
  `metadata_key` varchar(100) NOT NULL,
  `metadata_value` text DEFAULT NULL,
  `metadata_type` varchar(50) DEFAULT NULL,
  `is_suspicious` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recent_activity`
--

CREATE TABLE `recent_activity` (
  `id` int(11) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `activity_type` varchar(50) NOT NULL,
  `activity_title` varchar(255) NOT NULL,
  `activity_description` text DEFAULT NULL,
  `related_id` int(11) DEFAULT NULL,
  `authenticity_score` float DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `activity_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `security_elements`
--

CREATE TABLE `security_elements` (
  `id` int(11) NOT NULL,
  `analysis_id` int(11) NOT NULL,
  `element_name` varchar(100) NOT NULL,
  `element_type` varchar(50) DEFAULT NULL,
  `status` enum('verified','suspicious','fake') NOT NULL,
  `confidence` float DEFAULT NULL,
  `description` text DEFAULT NULL,
  `detected_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`detected_data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stats`
--

CREATE TABLE `stats` (
  `id` int(11) NOT NULL,
  `entities_count` int(11) DEFAULT 0,
  `countries_count` int(11) DEFAULT 0,
  `documents_analyzed` int(11) DEFAULT 0,
  `fake_documents` int(11) DEFAULT 0,
  `avg_processing_time` float DEFAULT 0,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `stats`
--

INSERT INTO `stats` (`id`, `entities_count`, `countries_count`, `documents_analyzed`, `fake_documents`, `avg_processing_time`, `last_updated`) VALUES
(1, 0, 0, 0, 0, 0, '2025-09-04 00:30:40');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `analysis_documents`
--
ALTER TABLE `analysis_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_documents_analysis` (`analysis_id`);

--
-- Indices de la tabla `comparison_results`
--
ALTER TABLE `comparison_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `analysis_id` (`analysis_id`);

--
-- Indices de la tabla `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `country_code` (`country_code`);

--
-- Indices de la tabla `document_analyses`
--
ALTER TABLE `document_analyses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_analyses_entity` (`entity_id`),
  ADD KEY `idx_analyses_date` (`analysis_date`);

--
-- Indices de la tabla `document_templates`
--
ALTER TABLE `document_templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `country_code` (`country_code`);

--
-- Indices de la tabla `entities`
--
ALTER TABLE `entities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contact_email` (`contact_email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_entities_country` (`country_code`),
  ADD KEY `idx_entities_type` (`entity_type`);

--
-- Indices de la tabla `metadata_results`
--
ALTER TABLE `metadata_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `analysis_id` (`analysis_id`);

--
-- Indices de la tabla `recent_activity`
--
ALTER TABLE `recent_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_activity_entity` (`entity_id`),
  ADD KEY `idx_activity_date` (`activity_date`);

--
-- Indices de la tabla `security_elements`
--
ALTER TABLE `security_elements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_security_analysis` (`analysis_id`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `analysis_documents`
--
ALTER TABLE `analysis_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comparison_results`
--
ALTER TABLE `comparison_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `document_analyses`
--
ALTER TABLE `document_analyses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `document_templates`
--
ALTER TABLE `document_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `entities`
--
ALTER TABLE `entities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `metadata_results`
--
ALTER TABLE `metadata_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `recent_activity`
--
ALTER TABLE `recent_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `security_elements`
--
ALTER TABLE `security_elements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `stats`
--
ALTER TABLE `stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `analysis_documents`
--
ALTER TABLE `analysis_documents`
  ADD CONSTRAINT `analysis_documents_ibfk_1` FOREIGN KEY (`analysis_id`) REFERENCES `document_analyses` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `comparison_results`
--
ALTER TABLE `comparison_results`
  ADD CONSTRAINT `comparison_results_ibfk_1` FOREIGN KEY (`analysis_id`) REFERENCES `document_analyses` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `document_analyses`
--
ALTER TABLE `document_analyses`
  ADD CONSTRAINT `document_analyses_ibfk_1` FOREIGN KEY (`entity_id`) REFERENCES `entities` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `document_templates`
--
ALTER TABLE `document_templates`
  ADD CONSTRAINT `document_templates_ibfk_1` FOREIGN KEY (`country_code`) REFERENCES `countries` (`country_code`);

--
-- Filtros para la tabla `entities`
--
ALTER TABLE `entities`
  ADD CONSTRAINT `entities_ibfk_1` FOREIGN KEY (`country_code`) REFERENCES `countries` (`country_code`);

--
-- Filtros para la tabla `metadata_results`
--
ALTER TABLE `metadata_results`
  ADD CONSTRAINT `metadata_results_ibfk_1` FOREIGN KEY (`analysis_id`) REFERENCES `document_analyses` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `recent_activity`
--
ALTER TABLE `recent_activity`
  ADD CONSTRAINT `recent_activity_ibfk_1` FOREIGN KEY (`entity_id`) REFERENCES `entities` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `security_elements`
--
ALTER TABLE `security_elements`
  ADD CONSTRAINT `security_elements_ibfk_1` FOREIGN KEY (`analysis_id`) REFERENCES `document_analyses` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
