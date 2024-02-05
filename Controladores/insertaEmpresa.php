<?php

include_once '../Modelos/Empresa.php';
include_once '../Dao/DaoEmpresa.php';

//Obtenemos lo que nos ha enviado el cliente
$arrayEmpresa = json_decode(file_get_contents('php://input'), true);

//Creamos el objeto Empresa a partir del array
$empresa = new Empresa(
    $arrayEmpresa['cif'],
    $arrayEmpresa['nombre'],
    $arrayEmpresa['lugar'],
    $arrayEmpresa['telefono'],
    $arrayEmpresa['direccion'],
    $arrayEmpresa['correo']
);

$nombreUsuario = $arrayEmpresa['usuario'];

$daoEmp = new DaoEmpresa();

$mensaje = $daoEmp->insertarEmpresa($empresa, $nombreUsuario);


