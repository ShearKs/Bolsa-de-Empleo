<?php

include_once 'Conexion.php';
include_once '../Modelos/Utilidades.php';


class DaoUsuario
{

    private $conexion;
    private $utils;

    public function __construct()
    {
        $claseConexion = new Conexion();
        $this->conexion = $claseConexion->getConexion();
        $this->utils = new Utilidades();
    }

    public function inicioSesion($nombreUsuario, $contrasena)
    {

        //Hacemos una consulta a la base de datos
        $sql = "SELECT * FROM usuario WHERE nombre = ?";
        $setencia = $this->conexion->prepare($sql);
        $setencia->bind_param("s", $nombreUsuario);

        $estado = $setencia->execute();
        $resultado = $setencia->get_result();

        if ($estado != null && $resultado->num_rows == 1) {

            $usuario = $resultado->fetch_assoc();

            //Cambiar luego por el password verify
            //Si el usuario existe en la base de datos comprobamos si la contraseña que ha introducido es correcta

            if (password_verify($contrasena, $usuario['contrasena'])) {
                //Ha iniciado sesión de forma satisfactoria

                //Me creo una sesión con el nombre del usuario
                session_start();
                $dni = $this->devuelveDniUser($nombreUsuario);
                $_SESSION['dni'] = $dni;

                //return json_encode($usuario);
                return json_encode(array("Exito" => "Has iniciado sesión correctamente"));
            }
            return json_encode(array("Error" => "La contraseña que has introducido es incorrecta"));
        } else {
            return json_encode(array("Error" => "No se ha encontrado ese alumno en la base de datos"));
        }
    }

    public function cambioContrasena(Usuario $usuario)
    {
        $nombreuser = $usuario->getNombreUsuario();
        $contrasena = $usuario->getContrasena();

        $sql = "UPDATE usuario
                    SET contrasena = ?
                    WHERE nombre = ?";
        $contrasenaEncriptada = password_hash($contrasena, PASSWORD_BCRYPT);

        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("ss", $contrasenaEncriptada, $nombreuser);
        $estado = $sentencia->execute();

        if ($estado) {
            return json_encode(array("Exito" => "Se ha actualizado la contraseña"));
        }

        return json_encode(array("Error" => "Ha habido un problema al cambiar la contraseña"));
    }

    public function devuelveDniUser($nombreUsuario)
    {
        $sql = " SELECT dni from usuario u ,alumno_bolsa al
                 WHERE u.id = al.idUsuario and u.nombre = ? ";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("s", $nombreUsuario);

        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();
        $dni = "";
        if ($estado && $resultado->num_rows == 1) {

            $fila = $resultado->fetch_assoc();
            $dni = $fila['dni'];
        }
        return $dni;
    }

    public function obtenerUsuario($nombreUsuario)
    {


        $sql = "SELECT * from usuario WHERE nombre = ?";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("s", $nombreUsuario);

        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();
        $usuario = "";

        //La consulta va a ser un registro ya que el usuario es unico
        if ($estado && $resultado->num_rows == 1) {
            $usuario = $resultado->fetch_object();
            return $usuario;
        }

        return null;
    }
}
