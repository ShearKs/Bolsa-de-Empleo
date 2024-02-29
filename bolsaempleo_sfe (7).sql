-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-02-2024 a las 23:38:28
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bolsaempleo_sfe`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `dni` varchar(9) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `apellidos` varchar(80) DEFAULT NULL,
  `correo` varchar(50) DEFAULT NULL,
  `idUsuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`dni`, `nombre`, `apellidos`, `correo`, `idUsuario`) VALUES
('47401293N', 'Administrador', 'Administrador', 'sergio96fernandez@gmail.com', 100);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnofct`
--

CREATE TABLE `alumnofct` (
  `dni` varchar(9) NOT NULL,
  `modalidad` int(11) DEFAULT NULL,
  `en_practicas` enum('Si','NO') DEFAULT 'NO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alumnofct`
--

INSERT INTO `alumnofct` (`dni`, `modalidad`, `en_practicas`) VALUES
('45141202N', 1, 'Si'),
('47141258B', 1, 'Si'),
('47451412M', 3, 'NO'),
('47470953N', 1, 'Si'),
('48412012G', 2, 'NO'),
('49562510N', 1, 'NO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnoies`
--

CREATE TABLE `alumnoies` (
  `dni` varchar(9) NOT NULL,
  `nombre` varchar(25) DEFAULT NULL,
  `apellidos` varchar(50) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `telefono` int(11) DEFAULT NULL,
  `titulado` tinyint(4) DEFAULT NULL,
  `curso` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alumnoies`
--

INSERT INTO `alumnoies` (`dni`, `nombre`, `apellidos`, `email`, `telefono`, `titulado`, `curso`) VALUES
('45141202N', 'Pedro', 'Gómez', 'sergiofdez.esp@gmail.com', 645141202, 0, 1),
('45141220B', 'Juan', 'Lopez', 'juan@gmail.com', 697845200, 1, 1),
('47141258B', 'Alonso', 'Ferrando', 'sergio96fernandez@gmail.com', 2147483647, 0, 1),
('47451410N', 'Erwin', 'gmail.com', 'sergio96fernandez@gmail.com', 697899702, 1, 2),
('47451412M', 'Eustaquio', 'Perez', 'sergio@gmail.com', 645451402, 0, 2),
('47452012C', 'Carlos', 'Garcia Martinez', 'carlos@gmail.com', 2147483647, 1, 3),
('47454110J', 'Jonatan', 'Reyes', 'joantan-94@gmail.com', 645202148, 1, 2),
('47470953N', 'Joaquín', 'Hernandez', 'sergio@gmail.com', 665425028, 0, 1),
('48261713P', 'Sergio', 'Fernández Esparcia', 'sergio96fernandez@gmail.com', 697899703, 1, 2),
('48412012G', 'Lucía', 'Perez Martin', 'sergio96fernandez@gmail.com', 678451202, 0, 1),
('49562510N', 'Marta ', 'Diaz', 'sergiofdez.esp@gmail.com', 666254208, 0, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumno_bolsa`
--

CREATE TABLE `alumno_bolsa` (
  `dni` varchar(9) NOT NULL,
  `expLaboral` varchar(100) DEFAULT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `otraResidencia` varchar(60) DEFAULT NULL,
  `posiViajar` tinyint(4) DEFAULT NULL,
  `disponibilidad` tinyint(4) DEFAULT NULL,
  `activo` enum('SI','NO') DEFAULT 'SI'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alumno_bolsa`
--

INSERT INTO `alumno_bolsa` (`dni`, `expLaboral`, `idUsuario`, `otraResidencia`, `posiViajar`, `disponibilidad`, `activo`) VALUES
('47451410N', 'mucha', 92, 'Huesca', 1, 0, 'SI'),
('47452012C', '1 año como abogado', 99, '', 1, 0, 'SI'),
('47454110J', '', 93, '', 1, 0, 'SI'),
('48261713P', 'I-habite anteriormente', 40, 'Madrid', 0, 1, 'NO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignacion`
--

CREATE TABLE `asignacion` (
  `idAsignacion` int(11) NOT NULL,
  `cifEmpresa` varchar(9) DEFAULT NULL,
  `dniAlum` varchar(9) DEFAULT NULL,
  `dniTutor` varchar(9) DEFAULT NULL,
  `fecha_asignación` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asignacion`
--

INSERT INTO `asignacion` (`idAsignacion`, `cifEmpresa`, `dniAlum`, `dniTutor`, `fecha_asignación`) VALUES
(10, '05455587N', '45141202N', '47451022K', '2024-02-29 14:43:51'),
(11, '05455587N', '45141202N', '47451022K', '2024-02-29 14:43:51'),
(12, '05455587N', '47141258B', '47451022K', '2024-02-29 14:43:51'),
(13, '05455587N', '45141202N', '47451022K', '2024-02-29 14:43:51'),
(14, '05455587N', '47470953N', '47451022K', '2024-02-29 22:35:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aviso`
--

CREATE TABLE `aviso` (
  `idAviso` int(11) NOT NULL,
  `cif` varchar(9) DEFAULT NULL,
  `fecha_aviso` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `aviso`
--

INSERT INTO `aviso` (`idAviso`, `cif`, `fecha_aviso`) VALUES
(2, '48261713P', '2024-02-29 20:26:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursa_alumn`
--

CREATE TABLE `cursa_alumn` (
  `id` int(11) NOT NULL,
  `dniAlum` varchar(9) DEFAULT NULL,
  `idCurso` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursa_alumn`
--

INSERT INTO `cursa_alumn` (`id`, `dniAlum`, `idCurso`) VALUES
(2, '47451410N', 2),
(7, '47452012C', 1),
(19, '47452012C', 2),
(5, '47452012C', 3),
(28, '47452012C', 4),
(4, '47454110J', 2),
(26, '48261713P', 1),
(25, '48261713P', 2),
(24, '48261713P', 3),
(27, '48261713P', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) DEFAULT NULL,
  `nombreCentroEstudio` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `curso`
--

INSERT INTO `curso` (`id`, `nombre`, `nombreCentroEstudio`) VALUES
(1, 'DAW', 'Ies Leonardo Da Vinci'),
(2, 'DAM', 'Ies Leonardo Da Vinci'),
(3, 'ASIR', 'Ies Leonardo Da Vinci'),
(4, 'Robotica Insutrial', 'Virrey Morcillo'),
(5, 'Paisajismo y Medio R', 'ies Catalino'),
(6, 'Comercio Internacion', 'Ies Federico Garcia Lorca'),
(7, 'Transporte Y Logisti', 'Ies Almansa'),
(8, 'Mantenimiento Electr', 'Ies Don Bosco');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleadora`
--

CREATE TABLE `empleadora` (
  `id` int(11) NOT NULL,
  `dniAlum` varchar(9) DEFAULT NULL,
  `cifEmpresa` varchar(9) DEFAULT NULL,
  `fecha_contrato` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleadora`
--

INSERT INTO `empleadora` (`id`, `dniAlum`, `cifEmpresa`, `fecha_contrato`) VALUES
(2, '48261713P', '05455587N', '2024-02-11 18:42:47'),
(3, '48261713P', '05455587N', '2024-02-11 18:42:49'),
(4, '48261713P', '05455587N', '2024-02-11 18:42:53'),
(29, '47452012C', '05455587N', '2024-02-25 12:02:51'),
(30, '47452012C', '0548888N', '2024-02-27 11:22:35'),
(31, '47454110J', '05455587N', '2024-02-28 12:16:49'),
(32, '47451410N', '05455587N', '2024-02-28 12:21:22'),
(33, '47454110J', '05455587N', '2024-02-29 17:07:35'),
(34, '47454110J', '05455587N', '2024-02-29 17:07:45'),
(35, '47454110J', '05455587N', '2024-02-29 17:59:48'),
(36, '47452012C', '05455587N', '2024-02-29 18:01:03'),
(37, '47452012C', '05455587N', '2024-02-29 18:04:18'),
(38, '47451410N', '05455587N', '2024-02-29 18:14:27'),
(39, '47454110J', '05455587N', '2024-02-29 18:18:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `cif` varchar(9) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `lugar` varchar(60) DEFAULT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `telefono` int(11) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `correo` varchar(50) DEFAULT NULL,
  `activo` enum('SI','NO') DEFAULT 'SI'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empresa`
--

INSERT INTO `empresa` (`cif`, `nombre`, `lugar`, `idUsuario`, `telefono`, `direccion`, `correo`, `activo`) VALUES
('02451412M', 'empresa', 'ab', 102, 65541245, 'Calle', 'sergio96fernandez@gmail.com', 'SI'),
('05455587N', 'Colegio Aparejadores', 'Huesca', 90, 697899703, 'C/Avenida Isabel La Catolica', 'ihabite11188@gmail.com', 'SI'),
('0548888N', 'Indra', 'Madrid', 101, 967220245, 'C/Ejemplo', 'indra@gmail.com', 'SI'),
('087565453', 'empresa de Palo', 'Albacete', 104, 688745125, 'C/La Rotonda', 'sergio96fernandez@gmail.com', 'SI');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modalidad_fct`
--

CREATE TABLE `modalidad_fct` (
  `id` int(11) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `periodo` varchar(75) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modalidad_fct`
--

INSERT INTO `modalidad_fct` (`id`, `tipo`, `periodo`) VALUES
(1, 'FCT Marzo', 'Marzo-Abril'),
(2, 'FCT Septiembre', 'Septiembre-Diciembre'),
(3, 'FP-Dual', 'Sptiembre-Junio'),
(4, 'DualTec', 'Abril-Noviembre');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peticionfcts`
--

CREATE TABLE `peticionfcts` (
  `id` int(11) NOT NULL,
  `modalidad` varchar(25) DEFAULT NULL,
  `fecha_contrato` timestamp NOT NULL DEFAULT current_timestamp(),
  `cif_empresa_solicitante` varchar(9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `peticionfcts`
--

INSERT INTO `peticionfcts` (`id`, `modalidad`, `fecha_contrato`, `cif_empresa_solicitante`) VALUES
(24, 'FCT Marzo', '2024-02-22 22:28:09', '05455587N'),
(25, 'FCT Marzo', '2024-02-29 09:47:37', '05455587N'),
(26, 'FCT Marzo', '2024-02-29 22:36:22', '05455587N'),
(27, 'FCT Septiembre', '2024-02-29 22:36:27', '05455587N'),
(28, 'FP-Dual', '2024-02-29 22:36:54', '05455587N');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peticion_alumnos`
--

CREATE TABLE `peticion_alumnos` (
  `idPeticion` int(11) NOT NULL,
  `dniAlumno` varchar(9) NOT NULL,
  `idCurso` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `peticion_alumnos`
--

INSERT INTO `peticion_alumnos` (`idPeticion`, `dniAlumno`, `idCurso`) VALUES
(24, '45141202N', 1),
(24, '47141258B', 1),
(25, '47470953N', 1),
(27, '48412012G', 1),
(28, '47451412M', 2),
(25, '49562510N', 3),
(26, '49562510N', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` int(11) NOT NULL,
  `nombre` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `nombre`) VALUES
(4, 'Administrador'),
(1, 'Alumno'),
(2, 'Empresa'),
(3, 'TutorFct');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud`
--

CREATE TABLE `solicitud` (
  `id` int(11) NOT NULL,
  `cif_empresa` varchar(10) DEFAULT NULL,
  `fecha_solicitud` timestamp NOT NULL DEFAULT current_timestamp(),
  `expLaboral` tinyint(4) DEFAULT NULL,
  `dispuestoViajar` tinyint(4) DEFAULT NULL,
  `otraResidencia` tinyint(4) DEFAULT NULL,
  `nombre` varchar(85) DEFAULT NULL,
  `estado` enum('ACTIVA','INACTIVA') DEFAULT 'ACTIVA'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitud`
--

INSERT INTO `solicitud` (`id`, `cif_empresa`, `fecha_solicitud`, `expLaboral`, `dispuestoViajar`, `otraResidencia`, `nombre`, `estado`) VALUES
(64, '05455587N', '2024-02-29 17:39:37', 0, 0, 0, 'Desarollador Java', 'INACTIVA'),
(65, '05455587N', '2024-02-29 17:45:31', 0, 0, 0, 'Desarollador Junior', 'INACTIVA'),
(66, '05455587N', '2024-02-29 17:58:55', 0, 0, 0, 'Desarollador Junior', 'INACTIVA'),
(67, '05455587N', '2024-02-29 18:03:59', 0, 0, 0, 'Desarollador Java', 'INACTIVA'),
(68, '05455587N', '2024-02-29 18:04:08', 0, 0, 0, 'Desarollador Java', 'INACTIVA'),
(69, '05455587N', '2024-02-29 18:18:50', 0, 0, 0, 'Desarollador Java', 'INACTIVA'),
(70, '05455587N', '2024-02-29 21:41:59', 0, 0, 0, 'Desarollador Junior', 'ACTIVA'),
(71, '0548888N', '2024-02-29 21:54:13', 0, 0, 0, 'Desarollador junior de Software', 'ACTIVA'),
(72, '0548888N', '2024-02-29 21:54:25', 0, 0, 0, 'Desarollador junior de Software', 'ACTIVA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_alumno`
--

CREATE TABLE `solicitud_alumno` (
  `idSolicitud` int(11) NOT NULL,
  `dniAlumno` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitud_alumno`
--

INSERT INTO `solicitud_alumno` (`idSolicitud`, `dniAlumno`) VALUES
(64, '47451410N'),
(64, '47454110J'),
(64, '48261713P'),
(65, '47452012C'),
(66, '47452012C'),
(66, '47454110J'),
(67, '47451410N'),
(67, '48261713P'),
(68, '47452012C'),
(69, '47454110J'),
(69, '48261713P'),
(70, '48261713P'),
(71, '48261713P'),
(72, '48261713P');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_curso`
--

CREATE TABLE `solicitud_curso` (
  `idSolicitud` int(11) NOT NULL,
  `idCurso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitud_curso`
--

INSERT INTO `solicitud_curso` (`idSolicitud`, `idCurso`) VALUES
(64, 1),
(64, 2),
(64, 3),
(65, 1),
(66, 2),
(66, 3),
(67, 1),
(67, 2),
(67, 3),
(68, 1),
(68, 2),
(68, 3),
(69, 1),
(69, 2),
(69, 3),
(70, 2),
(71, 1),
(72, 2),
(72, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tutor`
--

CREATE TABLE `tutor` (
  `dni` varchar(9) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `apellidos` varchar(80) DEFAULT NULL,
  `telefono` int(11) DEFAULT NULL,
  `correo` varchar(50) DEFAULT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `idCursoT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tutor`
--

INSERT INTO `tutor` (`dni`, `nombre`, `apellidos`, `telefono`, `correo`, `idUsuario`, `idCursoT`) VALUES
('47451022K', 'Inma', 'Galdon Guitierrez', 688785146, 'sergio96fernandez@gmail.com', 10, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `contrasena` varchar(275) DEFAULT NULL,
  `ultimoInicio` date DEFAULT NULL,
  `rol` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `contrasena`, `ultimoInicio`, `rol`) VALUES
(10, 'inma', '$2y$10$iywA9ZBbEUMWHqjnrUqztuI2Qo7.qqva544XNwKuM5BYYOpCwMqD.', '2024-02-29', 3),
(40, 'sergio4', '$2y$10$mHkSU71sSP00AyVKM8foZ.5dp8JIsY.67Fx5OQzjt7j80H3NETmw.', '2024-02-29', 1),
(90, 'ihabite', '$2y$10$7cOE1GfVbdFvJqqoZGUqqOKN6Oee8wMhsHHzIQPlUcxPPpdIFZ9NW', '2024-02-29', 2),
(92, 'erwin99', '$10$mHkSU71sSP00AyVKM8foZ.5dp8JIsY.67Fx5OQzjt7j80H3NETmw.', '2024-02-25', 1),
(93, 'jonatan94', '$2y$10$zcLpIdptPwASrDMx1kAJXuofu3C.noETqcqVXJRRCPXdDyw3i.erq', '2024-02-29', 1),
(94, 'erwin4', '$2y$10$Y1o3lVxTFRIjApWo3fAi/OvlL7rwIsEbVd7gjtWXrbPdjtWj7VbSu', '2024-02-25', 1),
(99, 'carlos96', '$2y$10$1nqPtuMwFLysyMoDybiXj.KQtwUcZIriUpHDS30F3ioagmqBfKTIi', '2024-02-29', 1),
(100, 'admin', '$2y$10$rhSKPrXy0SiqSeoS9SdaIe9ujiQfkkJb0vlfaUNF4VFP2MVTtyYXW', '2024-02-29', 4),
(101, 'indra1', '$2y$10$iuw8G8gIwIqfcIVLAEsecO5UZgojXvFHkIzEQkBH3snTf1aTda/oq', '2024-02-29', 2),
(102, 'empresa1', '$2y$10$LGk1z8KEabCn6TPQqKadU.b14J1y.YkiouqABwbodVDl4tnjhZh8m', '2024-02-28', 2),
(104, 'empresa2', '$2y$10$CEfcWC5GbohhDJf/tOCpseR6vdWijuUf9Z2NJ0jzQ9iPICFowEq6.', '2024-02-29', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`dni`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `alumnofct`
--
ALTER TABLE `alumnofct`
  ADD PRIMARY KEY (`dni`),
  ADD KEY `modalidad` (`modalidad`);

--
-- Indices de la tabla `alumnoies`
--
ALTER TABLE `alumnoies`
  ADD PRIMARY KEY (`dni`),
  ADD KEY `fk_alumnCurso` (`curso`);

--
-- Indices de la tabla `alumno_bolsa`
--
ALTER TABLE `alumno_bolsa`
  ADD PRIMARY KEY (`dni`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `asignacion`
--
ALTER TABLE `asignacion`
  ADD PRIMARY KEY (`idAsignacion`),
  ADD KEY `cifEmpresa` (`cifEmpresa`),
  ADD KEY `dniAlum` (`dniAlum`),
  ADD KEY `dniTutor` (`dniTutor`);

--
-- Indices de la tabla `aviso`
--
ALTER TABLE `aviso`
  ADD PRIMARY KEY (`idAviso`);

--
-- Indices de la tabla `cursa_alumn`
--
ALTER TABLE `cursa_alumn`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_dni_idcurso` (`dniAlum`,`idCurso`),
  ADD KEY `idCurso` (`idCurso`);

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `empleadora`
--
ALTER TABLE `empleadora`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cifEmpresa` (`cifEmpresa`),
  ADD KEY `dniAlum` (`dniAlum`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`cif`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `modalidad_fct`
--
ALTER TABLE `modalidad_fct`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `peticionfcts`
--
ALTER TABLE `peticionfcts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cif_empresa_solicitante` (`cif_empresa_solicitante`);

--
-- Indices de la tabla `peticion_alumnos`
--
ALTER TABLE `peticion_alumnos`
  ADD PRIMARY KEY (`idPeticion`,`dniAlumno`),
  ADD KEY `dniAlumno` (`dniAlumno`),
  ADD KEY `icurso_fk` (`idCurso`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `solicitud`
--
ALTER TABLE `solicitud`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cif_empresa` (`cif_empresa`);

--
-- Indices de la tabla `solicitud_alumno`
--
ALTER TABLE `solicitud_alumno`
  ADD PRIMARY KEY (`idSolicitud`,`dniAlumno`),
  ADD KEY `dniAlumno` (`dniAlumno`);

--
-- Indices de la tabla `solicitud_curso`
--
ALTER TABLE `solicitud_curso`
  ADD PRIMARY KEY (`idSolicitud`,`idCurso`),
  ADD KEY `idCurso` (`idCurso`);

--
-- Indices de la tabla `tutor`
--
ALTER TABLE `tutor`
  ADD PRIMARY KEY (`dni`),
  ADD KEY `idUsuario` (`idUsuario`),
  ADD KEY `idCursoT` (`idCursoT`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `unique_user` (`nombre`),
  ADD KEY `fk_usuario_ibfk1` (`rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asignacion`
--
ALTER TABLE `asignacion`
  MODIFY `idAsignacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `aviso`
--
ALTER TABLE `aviso`
  MODIFY `idAviso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `cursa_alumn`
--
ALTER TABLE `cursa_alumn`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `curso`
--
ALTER TABLE `curso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `empleadora`
--
ALTER TABLE `empleadora`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `modalidad_fct`
--
ALTER TABLE `modalidad_fct`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `peticionfcts`
--
ALTER TABLE `peticionfcts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `solicitud`
--
ALTER TABLE `solicitud`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD CONSTRAINT `administrador_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `alumnofct`
--
ALTER TABLE `alumnofct`
  ADD CONSTRAINT `alumnofct_ibfk_1` FOREIGN KEY (`dni`) REFERENCES `alumnoies` (`dni`),
  ADD CONSTRAINT `alumnofct_ibfk_2` FOREIGN KEY (`modalidad`) REFERENCES `modalidad_fct` (`id`);

--
-- Filtros para la tabla `alumnoies`
--
ALTER TABLE `alumnoies`
  ADD CONSTRAINT `fk_alumnCurso` FOREIGN KEY (`curso`) REFERENCES `curso` (`id`);

--
-- Filtros para la tabla `alumno_bolsa`
--
ALTER TABLE `alumno_bolsa`
  ADD CONSTRAINT `alumno_bolsa_ibfk_2` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `alumno_bolsa_ibfk_3` FOREIGN KEY (`dni`) REFERENCES `alumnoies` (`dni`);

--
-- Filtros para la tabla `asignacion`
--
ALTER TABLE `asignacion`
  ADD CONSTRAINT `asignacion_ibfk_1` FOREIGN KEY (`cifEmpresa`) REFERENCES `empresa` (`cif`),
  ADD CONSTRAINT `asignacion_ibfk_2` FOREIGN KEY (`dniAlum`) REFERENCES `alumnofct` (`dni`),
  ADD CONSTRAINT `asignacion_ibfk_3` FOREIGN KEY (`dniTutor`) REFERENCES `tutor` (`dni`);

--
-- Filtros para la tabla `cursa_alumn`
--
ALTER TABLE `cursa_alumn`
  ADD CONSTRAINT `cursa_alumn_ibfk_1` FOREIGN KEY (`idCurso`) REFERENCES `curso` (`id`),
  ADD CONSTRAINT `cursa_alumn_ibfk_2` FOREIGN KEY (`dniAlum`) REFERENCES `alumno_bolsa` (`dni`);

--
-- Filtros para la tabla `empleadora`
--
ALTER TABLE `empleadora`
  ADD CONSTRAINT `empleadora_ibfk_1` FOREIGN KEY (`cifEmpresa`) REFERENCES `empresa` (`cif`),
  ADD CONSTRAINT `empleadora_ibfk_2` FOREIGN KEY (`dniAlum`) REFERENCES `alumno_bolsa` (`dni`);

--
-- Filtros para la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD CONSTRAINT `empresa_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `peticionfcts`
--
ALTER TABLE `peticionfcts`
  ADD CONSTRAINT `peticionfcts_ibfk_1` FOREIGN KEY (`cif_empresa_solicitante`) REFERENCES `empresa` (`cif`);

--
-- Filtros para la tabla `peticion_alumnos`
--
ALTER TABLE `peticion_alumnos`
  ADD CONSTRAINT `icurso_fk` FOREIGN KEY (`idCurso`) REFERENCES `curso` (`id`),
  ADD CONSTRAINT `peticion_alumnos_ibfk_1` FOREIGN KEY (`idPeticion`) REFERENCES `peticionfcts` (`id`),
  ADD CONSTRAINT `peticion_alumnos_ibfk_2` FOREIGN KEY (`dniAlumno`) REFERENCES `alumnofct` (`dni`);

--
-- Filtros para la tabla `solicitud`
--
ALTER TABLE `solicitud`
  ADD CONSTRAINT `solicitud_ibfk_1` FOREIGN KEY (`cif_empresa`) REFERENCES `empresa` (`cif`);

--
-- Filtros para la tabla `solicitud_alumno`
--
ALTER TABLE `solicitud_alumno`
  ADD CONSTRAINT `fk_idSolicitud_solicitud_alumno` FOREIGN KEY (`idSolicitud`) REFERENCES `solicitud` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `solicitud_alumno_ibfk_1` FOREIGN KEY (`idSolicitud`) REFERENCES `solicitud` (`id`);

--
-- Filtros para la tabla `solicitud_curso`
--
ALTER TABLE `solicitud_curso`
  ADD CONSTRAINT `fk_idSolicitud_solicitud_curso` FOREIGN KEY (`idSolicitud`) REFERENCES `solicitud` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `solicitud_curso_ibfk_1` FOREIGN KEY (`idSolicitud`) REFERENCES `solicitud` (`id`);

--
-- Filtros para la tabla `tutor`
--
ALTER TABLE `tutor`
  ADD CONSTRAINT `tutor_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `tutor_ibfk_2` FOREIGN KEY (`idCursoT`) REFERENCES `curso` (`id`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_ibfk1` FOREIGN KEY (`rol`) REFERENCES `rol` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
