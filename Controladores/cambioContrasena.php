<?php

session_start();

include_once '../Dao/DaoUsuario.php';
include_once '../Modelos/Usuario.php';

//Obtenemos los datos por parte del cliente
$datos = json_decode(file_get_contents('php://input'), true);


if (isset($datos['modo'])) {

    if ($datos['modo'] == 1) {

        // Verificamos que los datos esperados estén presentes
        if (isset($datos['valor']) && isset($datos['correo'])) {
            $valorIntro = $datos['valor'];
            $correo = $datos['correo'];


            // Comprobamos la contraseña que tenemos en sesión con lo que ha pasado el usuario
            if ($_SESSION['codigoTemporal'] == $valorIntro) {
                // Si son iguales enviaremos un mensaje al usuario diciéndole que puede cambiar la contraseña
                echo json_encode(array('Exito' => 'Los valores coinciden, el usuario puede cambiar la contraseña'));
            } else {
                echo json_encode(array('Error' => 'Los valores no coinciden'));
            }
        } else {
            echo json_encode(array('Error' => 'Datos incompletos en la solicitud'));
        }
    } else if ($datos['modo'] == 2) {



        $contrasena = $datos['contrasena'];
        $usuario = $datos['usuario'];

        $daouser = new DaoUsuario();
        $usuario = new Usuario($usuario, $contrasena);
        $mensaje = $daouser->cambioContrasena($usuario);

        echo $mensaje;
    } else {
        echo json_encode(array('Error' => 'No se ha indicado un modo correcto'));
    }
}
