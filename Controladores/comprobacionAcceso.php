<?php

include_once '../Dao/DaoUsuario.php';

$solicitud = json_decode(file_get_contents('php://input'),true);

$daoUser = new DaoUsuario();

$idUsuario = $solicitud['idUsuario'];
$nombreUsuario = $solicitud['nombreUser'];

//Cada vez que un usuario inicia sesión se comprueban las fechas de todos los usuarios...
$daoUser->avisoUsuarios();

//Una vez usuario puede acceder sesión con normalidad actualizamos la ultima fecha
$lastAcces = $daoUser->ultimoAcceso($idUsuario, $nombreUsuario);

if (!$lastAcces) {
        return json_encode(array('Error' => 'La actualización de la fecha de inicio no se hizo correctamente'));
}

echo json_encode("Comprobación de inicio hecha");







