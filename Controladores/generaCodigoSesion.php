<?php

session_start();


include_once '../Modelos/Utilidades.php';

$correo = $_REQUEST['correo'];

$utils = new Utilidades();

$codigoTemporal = $utils->generarContrasenaAle();

$_SESSION['codigoTemporal'] = $codigoTemporal;

if (isset($_SESSION['codigoTemporal']) && $_SESSION['codigoTemporal'] != null) {
    $mensaje = "Se ha generado un correo temporal para cambiar la contraseña\n".
                " Código Temporal: " .$codigoTemporal;
    $utils->enviarCorreo($correo,$mensaje);
    echo json_encode(array("Exito" => "Se ha generado un código temporal"));
} else {
    echo json_encode(array("Error" => "No se ha podido generar el codigo temporal"));
}
