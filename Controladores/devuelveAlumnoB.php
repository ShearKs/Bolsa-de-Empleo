<?php

session_start();

include_once '../Dao/DaoAlumno.php';

$dni = $_SESSION['dni'];

$daoAlumn = new DaoAlumno();


$alumno = $daoAlumn->devuelveAlumno($dni, true);
echo $alumno;
