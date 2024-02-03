<?php

include_once '../Modelos/Usuario.php';
include_once '../Dao/DaoUsuario.php';


$datosObtenidos = json_decode(file_get_contents('php://input'), true);

$nombreUsuario = $datosObtenidos['usuario'];
$contrasena = $datosObtenidos['contrasena'];

//Creamos un objeto Usuario
$usuarioCliente = new Usuario($nombreUsuario, $contrasena);

$daoUser = new DaoUsuario();

$usuarioDevuelto = $daoUser->inicioSesion($nombreUsuario,$contrasena);


echo $usuarioDevuelto;
