<?php

include_once '../Dao/DaoAdministrador.php';

$solicitud = json_decode(file_get_contents('php://input'),true);

$idCurso = $solicitud['perfilP'];

$daoAdmin = new DaoAdministrador();

$alumnos = $daoAdmin->obtenerListadoAlumnos($idCurso);

echo json_encode($alumnos);


