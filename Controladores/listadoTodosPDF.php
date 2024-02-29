<?php

include_once '../Dao/DaoAdministrador.php';

$solicitud = json_decode(file_get_contents('php://input'), true);

$tipo = $solicitud['tipo'];

$daoAdmin = new DaoAdministrador();


$usuario = $daoAdmin->obtenerListadoTodosPDF($tipo);
echo $usuario;
