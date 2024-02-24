<?php

include_once '../Dao/DaoAdministrador.php';

$solicitud = json_decode(file_get_contents('php://input'), true);

$idCurso = $solicitud['perfilP'];
$modo = $solicitud['modo'];

$daoAdmin = new DaoAdministrador();

switch ($modo) {
    //Para el lista
    case 1:
        $alumnos = $daoAdmin->obtenerListadoAlumnos($idCurso);
        echo json_encode($alumnos);
        break;
    case 2:
        $empresas = $daoAdmin->obtenerListadoEmpresas($idCurso);
        echo json_encode($empresas);
        break;    
}
