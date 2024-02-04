<?php

include_once '../Dao/DaoAlumno.php';

//Recogemos el modo si va a ser del centro o no
$modo = $_REQUEST['modo'];

$daoAlumn = new DaoAlumno();

$cursos = $daoAlumn->devuelveCursos($modo);

echo json_encode($cursos);







