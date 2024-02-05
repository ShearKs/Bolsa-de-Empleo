<?php

session_start();

include_once '../Dao/DaoAlumno.php';

$dni = $_SESSION['cif'];

$daoAlumn = new DaoAlumno();


$alumno = $daoAlumn->devuelveAlumno($dni, true);
echo $alumno;
