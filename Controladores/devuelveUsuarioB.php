<?php

session_start();

include_once '../Dao/DaoAlumno.php';
include_once '../Dao/DaoUsuario.php';

$dni = $_SESSION['cif'];
$rol = $_GET['rol'];

$daoAlumn = new DaoAlumno();

$daoUser = new DaoUsuario($dni);


$datosUsuario = $daoUser->obtenerDatosUsuario($dni,$rol);
//$alumno = $daoAlumn->devuelveAlumno($dni, true);

echo $datosUsuario;
