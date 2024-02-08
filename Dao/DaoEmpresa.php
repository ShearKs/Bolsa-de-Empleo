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


    public function realizarSolicitud($alumnosOferta, $empresa, $criterios)
    {
        // Deshabilitar autocommit para iniciar una transacción
        $this->conexion->autocommit(false);

        //Obtenemos el cif de la empresa
        $cifEmpresa = $empresa['cif'];
        $nombreEmpresa = $empresa['nombre'];

        //Obtenemos todos los cursos para los que va la solicitud
        $cursos = $criterios['cursos[]'];

        $expLaboral = $criterios['experienciaLaboral'] === "Si" ? 1 : 0;
        $posViajar = $criterios['posViajar'] === "Si" ? 1 : 0;
        $residencia = $criterios['residencia'] === "Sí" ? 1 : 0;

        $sql = "INSERT INTO solicitud(cif_empresa,expLaboral,dispuestoViajar,otraResidencia) VALUES (?,?,?,?)";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("siii", $cifEmpresa, $expLaboral, $posViajar, $residencia);

        $estado = $sentencia->execute();
        if ($estado) {
            $idSoli = $sentencia->insert_id;
            $sentencia->close();
            //Nos encargamos de recorrer los cursos
            foreach ($cursos as $curso) {

                $sqlInsC = "INSERT INTO solicitud_curso VALUES (?,?)";
                $senteciaSyC = $this->conexion->prepare($sqlInsC);
                $senteciaSyC->bind_param("ii", $idSoli, $curso);
                $estadoS = $senteciaSyC->execute();

                if (!$estadoS) {
                    // Si hay algún error al insertar un curso, hacemos rollback y retornamos el error
                    $this->conexion->rollback();
                    return json_encode(array("Error" => "Problema al añadir las solicitudes a los cursos"));
                }
                $senteciaSyC->close();
            }

            $dniAlumns = "";

            //Nos encargamos de asignar las solicitudes con los alumnos
            //Recorremos todos los alumnos de la oferta
            foreach ($alumnosOferta as $alumno) {
                $nombre = $alumno['nombre'];
                $apellidos = $alumno['apellidos'];
                $dniAlumn = $alumno['dni'];
                $correo = $alumno['email'];

                $dniAlumns .= " " . $dniAlumn;

                //return json_encode($cifEmpresa);

                $sqlIA = "INSERT INTO solicitud_alumno(idSolicitud,dniAlumno) VALUES (?,?)";
                $sentenciaAlum = $this->conexion->prepare($sqlIA);
                $sentenciaAlum->bind_param("is", $idSoli, $dniAlumn);
                $estadoA = $sentenciaAlum->execute();

                if (!$estadoA) {
                    $this->conexion->rollback();
                    return json_encode(array("Error" => "Problema a la añadir las solicitudes a los cursos"));
                }

                //Si todo ha ido bien nos encargamos de mandarle la oferta a los alumnos
                $mensaje = "Hola " . $nombre . " " . $apellidos . " has sido seleccionado para una oferta de empleo de la empresa: ".$nombreEmpresa;
                //Enviamos el correo a todos los candidatos
                $this->utils->enviarCorreo($correo, $mensaje);
            }

            //Si todos las solicitudes se han insertado correctamente
            $this->conexion->commit();

            return json_encode(array("Exito" => "Se enviaron las solicitudes"));
            //return json_encode(array("Exito" => $dniAlumns . " para la solicitud: " . $idSoli));
        }

        return json_encode(array("Error" => "Ha habido un error al enviar las solicitudes"));
    }


    public function obtenerSolicitudes($cifEmpresa){




    }

    public function existeCifEmpresa($cifEmpresa)
    {
    }
}
