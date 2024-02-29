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

    public function devuelveCampos($cif)
    {

        if (!$this->comprobacionCif($cif)) {
            $sql = "SHOW COLUMNS FROM Empresa";
            $query = $this->conexion->query($sql);

            $campos = array();

            if ($query->num_rows > 0) {

                while ($fila = $query->fetch_assoc()) {
                    $campos[] = $fila['Field'];
                }
            }

            return json_encode($campos);
        } else {
            return json_encode(array('Error' => 'Ese cif ya existe en la aplicación...'));
        }
    }

    //Función que comprube si no existe un usuario con ese dni o usuario
    private function comprobacionCif($cif)
    {

        $sql = "SELECT 
                    CASE 
                        WHEN al.idUsuario IS NOT NULL THEN al.dni 
                        WHEN e.idUsuario IS NOT NULL THEN e.cif 
                        WHEN tu.idUsuario IS NOT NULL THEN tu.dni 
                        WHEN a.idUsuario IS NOT NULL THEN a.dni 
                    END AS cif
                FROM usuario u
                LEFT JOIN alumno_bolsa al ON u.id = al.idUsuario
                LEFT JOIN empresa e ON u.id = e.idUsuario
                LEFT JOIN tutor tu ON u.id = tu.idUsuario
                LEFT JOIN Administrador a ON u.id = a.idUsuario 
                WHERE cif = ? ";
        $sentecia = $this->conexion->prepare($sql);
        $sentecia->bind_param("s", $cif);
        $estado = $sentecia->execute();
        $resultado = $sentecia->get_result();

        //Si se cif de usuario existe
        if ($estado && $resultado->num_rows > 0) {
            return true;
        }

        return false;
    }

    private function comprobacionUsuario($usuario)
    {

        $sql = "SELECT * FROM usuario WHERE nombre = ?";
        $sentecia = $this->conexion->prepare($sql);
        $sentecia->bind_param("s", $usuario);
        $estado = $sentecia->execute();
        $resultado = $sentecia->get_result();

        //El usuario de ese usuario
        if ($estado && $resultado->num_rows > 0) {
            return true;
        }

        return false;
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

        //Antes de insertar al usuario de la empresa o en la tabla empresa comprobamso que no existe
        if (!$this->comprobacionUsuario($nombreUsuario)) {
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
        } else {
            echo json_encode(array("Error" => "Existe algun usuario con ese nombre..."));
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

    //Petición  de alumnos por parte de una empresa estará marcada según los criterios indicados
    public function realizarSolicitud($alumnosOferta, $empresa, $criterios)
    {
        // Deshabilitar autocommit para iniciar una transacción
        $this->conexion->autocommit(false);

        //nombre del oferta de trabajo
        $nombre = $criterios['nombreOferta'];

        //Obtenemos el cif de la empresa
        $cifEmpresa = $empresa['cif'];
        $nombreEmpresa = $empresa['nombre'];

        //Obtenemos todos los cursos para los que va la solicitud
        $cursos = $criterios['cursos[]'];

        $expLaboral = $criterios['experienciaLaboral'] === "Si" ? 1 : 0;
        $posViajar = $criterios['posViajar'] === "Si" ? 1 : 0;
        $residencia = $criterios['residencia'] === "Sí" ? 1 : 0;

        $sql = "INSERT INTO solicitud(nombre,cif_empresa,expLaboral,dispuestoViajar,otraResidencia) VALUES (?,?,?,?,?)";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("ssiii", $nombre, $cifEmpresa, $expLaboral, $posViajar, $residencia);

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
        }
        return json_encode(array("Error" => "Ha habido un error al enviar las solicitudes"));
    }


    public function obtenerSolicitud($cifEmpresa)
    {

        $sql = "SELECT s.id, s.cif_empresa,s.nombre as 'Nombre de la Oferta', s.fecha_solicitud, GROUP_CONCAT(c.nombre SEPARATOR ', ') AS cursos " .
            "FROM solicitud s " .
            "JOIN empresa e ON s.cif_empresa = e.cif " .
            "JOIN solicitud_curso sc ON s.id = sc.idSolicitud " .
            "JOIN curso c ON sc.idCurso = c.id WHERE cif_empresa = ? AND estado = 'ACTIVA' " .
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

        $sql = "SELECT distinct al.nombre,al.apellidos,al.dni,al.telefono,al.email
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

            //Dejamos esa solicitud como no disponible
            $sqlUpdate = "UPDATE solicitud SET estado = 'INACTIVA' WHERE id = ? ";
            $sentenciaU = $this->conexion->prepare($sqlUpdate);
            $sentenciaU->bind_param("i", $idSolicitud);
            $estado = $sentenciaU->execute();
            if ($estado) {
                $sentenciaU->close();
                //Nos ecargamos de poner la disponibilidad a 0 para el alumno ya que ha sido contratado
                $sqlUpdate = "UPDATE alumno_bolsa SET disponibilidad = 0 where dni = ?";
                $sentenciaNoDis = $this->conexion->prepare($sqlUpdate);
                $sentenciaNoDis->bind_param("s", $dniAlum);
                $resultadoUpdate = $sentenciaNoDis->execute();

                if ($resultadoUpdate) {
                    $this->conexion->commit();
                    return json_encode(array("Exito" => "Se ha realizado la contratación del alumno!"));
                }
                $this->conexion->rollback();
                return json_encode(array("Error" => "No se ha podido poner al alumno como no disponible"));
            } else {
                $this->conexion->rollback();
                return json_encode(array("Error" => "No se pudo realizar la el borrado de solicitud"));
            }
        } else {

            $this->conexion->rollback();
            return json_encode(array("Error" => "No se pudo realizar la contratación"));
        }
    }

    public function devuleveModalidadFCT()
    {

        $sql = "SELECT * FROM modalidad_fct";

        $query = $this->conexion->query($sql);

        $modalidades = array();

        if ($query->num_rows > 0) {

            while ($fila = $query->fetch_assoc()) {

                $modalidades[] = $fila;
            }
            return json_encode($modalidades);
        } else {
            return json_encode(array("Error" => "Ha habido un problema no se ha podido obtener nada de la consulta"));
        }
    }

    public function alumnosModalidadFct($modalidad)
    {

        $sql = "SELECT fct.dni,al.nombre,al.apellidos,al.email,mo.tipo,c.nombre as 'curso',c.id as 'idcurso' FROM alumnofct fct
                    INNER JOIN alumnoies al ON al.dni = fct.dni 
                    INNER JOIN curso c ON c.id = al.curso
                    INNER JOIN modalidad_fct mo ON mo.id = fct.modalidad WHERE fct.en_practicas = 'NO' AND  mo.id = ? ";

        $sentecia = $this->conexion->prepare($sql);
        $sentecia->bind_param("i", $modalidad);
        $estado = $sentecia->execute();
        $resultado = $sentecia->get_result();
        $alumnosFct = array();

        if ($estado != null &&  $resultado->num_rows) {

            while ($fila = $resultado->fetch_assoc()) {

                $alumnosFct[] = $fila;
            }
            return json_encode($alumnosFct);
        } else {

            return json_encode(array('Error' => "No se han encontrado alumnos para esa modalidad de Fct"));
        }
    }

    public function realizarPeticion($alumnos, $tipo, Empresa $empresa)
    {

        //Ponemos el autocommit en falso ya que no vamos a crear la peticion sin asignar los alumnos a la petición de fcts
        $this->conexion->autocommit(false);

        //Obtenemos el cif de la empresa al que asignaremos la petición....
        $cifEmpresa = $empresa->getCif();

        $sql = "INSERT INTO peticionfcts (modalidad,cif_empresa_solicitante) VALUES(?,?)";
        $sentecia = $this->conexion->prepare($sql);
        $sentecia->bind_param("ss", $tipo, $cifEmpresa);
        $estado = $sentecia->execute();

        if ($estado) {
            $idPeticion = $sentecia->insert_id;
            $sentecia->close();

            foreach ($alumnos as $alum) {

                $dni = $alum['dni'];
                $idCurso = intval($alum['idcurso']);

                $sqlAsig = "INSERT INTO peticion_alumnos(idPeticion,dniAlumno,idCurso) VALUES (?,?,?) ";
                $sentenciaAsig = $this->conexion->prepare($sqlAsig);
                $sentenciaAsig->bind_param("isi", $idPeticion, $dni, $idCurso);
                $estado = $sentenciaAsig->execute();

                if (!$estado) {
                    $this->conexion->rollback();
                    return json_encode(array('Error' => 'No se ha podido asignar la petición al alumno'));
                }
            }
            $this->conexion->autocommit(true);
            return json_encode(array('Exito' => 'Se ha creado la petición correctamte'));
        } else {
            return json_encode(array('Error' => 'No se ha podido crear la petición'));
        }
    }


}
