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
                $this->utils->enviarCorreo($correo, "Esta es tu contraseña : " . $contrasena);
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
                $mensaje = "Hola " . $nombre . " " . $apellidos . " has sido seleccionado para una oferta de empleo de la empresa: " . $nombreEmpresa;
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


    public function obtenerSolicitud($cifEmpresa)
    {

        $sql = "SELECT s.id, s.cif_empresa,e.nombre, s.fecha_solicitud, GROUP_CONCAT(c.nombre SEPARATOR ', ') AS cursos " .
            "FROM solicitud s " .
            "JOIN empresa e ON s.cif_empresa = e.cif " .
            "JOIN solicitud_curso sc ON s.id = sc.idSolicitud " .
            "JOIN curso c ON sc.idCurso = c.id WHERE cif_empresa = ? " .
            "GROUP BY s.id;";

        $sentecia = $this->conexion->prepare($sql);
        $sentecia->bind_param("s", $cifEmpresa);
        $estado = $sentecia->execute();
        $resultado = $sentecia->get_result();

        $solicitud = array();

        if ($estado && $resultado->num_rows > 0) {

            while ($fila = $resultado->fetch_assoc()) {

                $solicitud[] = $fila;
            }
            return json_encode($solicitud);
        }

        echo json_encode(array("Error" => "Ha habido un problema no se ha podido obtener nada de la consulta"));
    }

    public function obtenerAlumnosSolici($cifEmpresa, $idSoli)
    {


        $sql = "SELECT distinct al.nombre,al.apellidos,al.dni
                    FROM alumno_bolsa a
                    JOIN alumnoies al ON al.dni = a.dni
                    JOIN solicitud_alumno sa ON a.dni = sa.dniAlumno
                    JOIN solicitud s ON sa.idSolicitud = s.id
                    WHERE s.cif_empresa = ? and s.id = ? ";

        $sentecia = $this->conexion->prepare($sql);
        $sentecia->bind_param("si", $cifEmpresa, $idSoli);
        $estado = $sentecia->execute();
        $resultado = $sentecia->get_result();

        $alumnosSoli = array();

        if ($estado && $resultado->num_rows > 0) {

            while ($fila = $resultado->fetch_assoc()) {

                $alumnosSoli[] = $fila;
            }
            return json_encode($alumnosSoli);
        } else {
            return json_encode(array("Error" => "Ha habido un problema no se ha podido obtener nada de la consulta"));
        }
    }

    public function realizarContratacion($contratoAlumno, $cif)
    {

        //Obtenemos los campos que necesitamos
        $idSolicitud = $contratoAlumno['id'];
        $dniAlum = $contratoAlumno['dni'];

        //Desactivamso el autocommit
        $this->conexion->autocommit(false);

        $sql = "INSERT INTO Empleadora(dniAlum,cifEmpresa) VALUES(?,?)";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("ss", $dniAlum, $cif);

        $resultado = $sentencia->execute();

        if ($resultado) {
            $sentencia->close();
            //Al hacer el insert en empleadora nos encargamos de eliminar la solictud de esa empresa
            //Para hacer este delete hemos hecho en nuestra base de datos un eliminado en cascada para cuando eliminamos una solicitud podamos borrar en las otras 2 tablas
            //tambien se podría haber hecho realizando 3 deletes cada una para las 3 tablas
            $sqlDelete = "DELETE solicitud, solicitud_curso, solicitud_alumno
                            FROM solicitud
                            LEFT JOIN solicitud_curso ON solicitud.id = solicitud_curso.idSolicitud
                            LEFT JOIN solicitud_alumno ON solicitud.id = solicitud_alumno.idSolicitud
                            WHERE solicitud.id = ?";
            $senteciaElim = $this->conexion->prepare($sqlDelete);
            $senteciaElim->bind_param("i", $idSolicitud);
            $estado = $senteciaElim->execute();
            if ($estado) {

                $this->conexion->commit();
                return json_encode(array("Exito" => "Se ha realizado la contratación del alumno!"));
            } else {
                return json_encode(array("Error" => "No se pudo realizar la el borrado de solicitud"));
            }
        } else {

            $this->conexion->rollback();
            return json_encode(array("Error" => "No se pudo realizar la contratación"));
        }
    }



    public function existeCifEmpresa($cifEmpresa)
    {
    }
}
