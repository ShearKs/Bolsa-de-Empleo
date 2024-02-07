<?php

include_once 'Conexion.php';
include_once '../Modelos/Usuario.php';
include_once '../Modelos/Utilidades.php';
include_once '../Modelos/Empresa.php';
include_once '../Modelos/Alumno.php';
include_once '../Modelos/AlumnoBolsa.php';



class DaoEmpresa
{


    private $conexion;
    private $utils;

    public function __construct()
    {

        $claseConexion = new Conexion();
        $this->conexion = $claseConexion->getConexion();
        $this->utils = new Utilidades();
    }

    public function devuelveCampos()
    {

        $sql = "SELECT column_name FROM information_schema.columns WHERE table_name = 'Empresa'";
        $query = $this->conexion->query($sql);

        $campos = array();

        if ($query->num_rows > 0) {

            while ($fila = $query->fetch_assoc()) {
                $campos[] = $fila;
            }
        }

        return $campos;
    }

    public function insertarEmpresa(Empresa $empresa, $nombreUsuario)
    {

        //Obtenemos todo el contenido de un objeto
        $nombre = $empresa->getNombre();
        $cif = $empresa->getCif();
        $lugar = $empresa->getLugar();
        $telefono = $empresa->getTelefono();
        $direccion = $empresa->getDireccion();
        $correo = $empresa->getCorreo();

        $this->conexion->autocommit(false);

        $contrasena = $this->utils->generarContrasenaAle();

        $usuario = new Usuario($nombreUsuario, $contrasena, 2);

        $idUsuario = $this->insertarUsuarioEmpresa($usuario);

        if ($idUsuario != -1) {

            $sql = "INSERT INTO Empresa(cif,nombre,lugar,telefono,direccion,correo,idUsuario) VALUES (? ,? ,? ,? ,? ,?,?)";
            $sentencia = $this->conexion->prepare($sql);
            $sentencia->bind_param("sssdssd", $cif, $nombre, $lugar, $telefono, $direccion, $correo, $idUsuario);
            $estado = $sentencia->execute();
            if ($estado && $sentencia->affected_rows == 1) {
                $this->utils->enviarCorreo($correo, "Esta es tu contraseña empresa de mierda: " . $contrasena);
                $this->conexion->commit();
                echo json_encode(array("Exito" => "Se ha insertado la empresa correctamente"));
            } else {
                echo json_encode(array("Error" => "Ha habido algún problema al insertar a la empresa"));
            }
        } else {
            echo json_encode(array("Error" => "No se ha podido añadir un usuario de empresa"));
        }
    }

    private function insertarUsuarioEmpresa(Usuario $usuario)
    {

        $nombre = $usuario->getNombreUsuario();
        $contrasena = $usuario->getContrasena();
        $rol = $usuario->getRol();

        $sql = "INSERT INTO usuario(nombre,contrasena,rol) VALUES(? ,?,?)";

        $contrasenaEncrip = password_hash($contrasena, PASSWORD_BCRYPT);

        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("ssd", $nombre, $contrasenaEncrip, $rol);

        $estado = $sentencia->execute();
        $idUser = -1;
        if ($estado) {
            $idUser = $sentencia->insert_id;

            return $idUser;
        }

        return $idUser;
    }

    public function realizarSolicitud($alumnosOferta, $empresa)
    {
        // Deshabilitar autocommit para iniciar una transacción
        $this->conexion->autocommit(false);


        try {
            // Insertar una fila en la tabla solicitud para cada alumno
            foreach ($alumnosOferta as $alumno) {


                // Obtener el ID del alumno y sus cursos
                $dniAlum = $alumno['dni'];
                $idCurso = $alumno['idCurso'];
                $cifEmpresa = $empresa['cif'];

                // Insertar la solicitud para el alumno actual
                $sqlInsertSolicitud = "INSERT INTO solicitud (cif_empresa, dni_alumno) VALUES (?, ?)";
                $stmtInsertSolicitud = $this->conexion->prepare($sqlInsertSolicitud);
                $stmtInsertSolicitud->bind_param("ss", $cifEmpresa, $dniAlum);
                $stmtInsertSolicitud->execute();
                $idSolicitud = $stmtInsertSolicitud->insert_id;
                $stmtInsertSolicitud->close();

            }

            // Commit de la transacción si todas las operaciones se realizaron correctamente
            $this->conexion->commit();

            // Habilitar autocommit nuevamente
            $this->conexion->autocommit(true);

            // Devolver un mensaje indicando que la solicitud ha sido realizada con éxito
            return "La solicitud ha sido realizada con éxito";
        } catch (Exception $e) {
            // En caso de error, hacer un rollback para deshacer todas las operaciones
            $this->conexion->rollback();

            // Habilitar autocommit nuevamente
            $this->conexion->autocommit(true);

            // Devolver un mensaje de error
            return "Error al realizar la solicitud: " . $e->getMessage();
        }
    }






    public function existeCifEmpresa($cifEmpresa)
    {
    }
}
