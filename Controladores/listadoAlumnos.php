<?php

include_once '../Dao/DaoAdministrador.php';


$daoAdmin = new DaoAdministrador();

$alumnos = $daoAdmin->obtenerListadoAlumnos();


echo json_encode($alumnos);


