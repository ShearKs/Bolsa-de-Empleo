<?php

include_once '../Dao/DaoAdministrador.php';

$datos = json_decode(file_get_contents('php://input'), true);

$daoAdmin = new DaoAdministrador();

//Lo que obtenemos de la solicitud
$dni = $datos['dni'];
$tipo = $datos['tipo'];

switch ($tipo) {

        //Si es por alumno ...
    case 'Alumno':

        $alumno = $daoAdmin->obtenerAlumno($dni);
        echo $alumno;
        break;

        //Si es por empresa...
    case 'Empresa':
        //Devolvemos la empresa
        $empresa = $daoAdmin->obtenerEmpresa($dni);
        echo $empresa;
        break;

    case 'solicitudesEmpresa':
        $solicitudesEmpresa = $daoAdmin->solicitudesEmpresa($dni);
        echo $solicitudesEmpresa;
        break;
        
    case 'contratosEmpresa':
        $contratosEmpresas = $daoAdmin->contratosEmpresa($dni);
        echo $contratosEmpresas;
        break;    
}
