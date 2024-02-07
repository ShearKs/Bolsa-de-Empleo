<?php
session_start();


include_once '../Modelos/Alumno.php';
include_once '../Modelos/AlumnoBolsa.php';
include_once '../Modelos/Empresa.php';
include_once '../Dao/DaoUsuario.php';


// Obtén los datos del cuerpo de la solicitud POST
$datos = json_decode(file_get_contents('php://input'), true);

// Extrae el usuario y el rol de los datos
$usuario = $datos['usuario'];
$rol = $datos['rol'];

$daoUser = new DaoUsuario();

//Objecto vacio que pasaremos al dao
$objeto = "";

switch ($rol) {
        //Alumno
    case 1:
        $objeto = new AlumnoBolsa(
            $usuario['nombre'],
            $usuario['apellidos'],
            $_SESSION['cif'],
            $usuario['curso'],
            $usuario['email'],
            $usuario['Teléfono'],
            $usuario['residencia'],
            $usuario['posViaje'],
            $usuario["Experiencia Laboral"],
            $usuario['posDis']
        );
        break;
        //Empresas    
    case 2:
        $objeto = new Empresa($usuario['cif'], $usuario['nombre'], $usuario['lugar'], $usuario['telefono'], $usuario['direccion'], $usuario['email']);
        break;
        //Tutor
    case 3:

    default:
        break;
}

$mensaje = $daoUser->actualizarUsuarioBolsa($objeto,$rol);

echo $mensaje;
