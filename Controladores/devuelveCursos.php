<?php

include_once '../Dao/DaoAlumno.php';

$daoAlumn = new DaoAlumno();

$cursos = $daoAlumn->devuelveCursos();

echo json_encode($cursos);







