<?php

include_once 'Conexion.php';
include_once '../Modelos/Utilidades.php';
include_once '../Modelos/Tutor.php';


class DaoTutor
{

  private $conexion;
  private $utils;

  public function __construct()
  {
    $claseConexion = new Conexion();
    $this->conexion = $claseConexion->getConexion();
    $this->utils = new Utilidades();
  }


  public function devuelveAlumnosTutor(Tutor $tutor)
  {

    //Obtenemos el curso del que es tutor...
    $idCursoT = $tutor->getCurso();

    $sql = "SELECT al.nombre,al.apellidos,al.email,mfct.tipo,c.nombre as curso FROM alumnoies al
              INNER JOIN curso c ON c.id = al.curso
              INNER JOIN alumnofct alf ON alf.dni = al.dni
              INNER JOIN modalidad_fct mfct ON mfct.id = alf.modalidad WHERE titulado = 0 AND c.id = ?";
    $sentencia = $this->conexion->prepare($sql);
    $sentencia->bind_param("i", $idCursoT);
    $estado = $sentencia->execute();

    $resultado = $sentencia->get_result();

    //alumnos que tutoriza...
    $alumnos = array();

    if ($estado && $resultado->num_rows > 0) {

      while ($fila = $resultado->fetch_assoc()) {
        $alumnos[] = $fila;
      }

      //Devolvemos los alumnos obtenidos...
      return json_encode($alumnos);
    } else {
      return json_encode(array("Error" => "No se ha podido encontrar ningún alumno"));
    }
  }

  public function devuelvePeticiones($idCurso)
  {
    $sql = "SELECT  distinct  p.id,e.cif,e.nombre as 'Nombre Empresa',p.modalidad,fecha_contrato as 'Fecha Petición' FROM peticionfcts p,empresa e,peticion_alumnos pa,alumnofct af
    WHERE e.cif = p.cif_empresa_solicitante and  pa.idPeticion = p.id  and af.dni = pa.dniAlumno and af.en_practicas = 'NO' AND pa.idCurso = ? ;";
    $sentencia = $this->conexion->prepare($sql);
    $sentencia->bind_param("i", $idCurso);
    $estado = $sentencia->execute();

    $resultado = $sentencia->get_result();

    $peticiones = array();

    if ($estado && $resultado->num_rows > 0) {

      while ($fila = $resultado->fetch_assoc()) {
        $peticiones[] = $fila;
      }

      return json_encode($peticiones);
    } else {
      return json_encode(array("Error" => "No se ha podido encontrar ningúna petición"));
    }
  }

  public function getAlumnosPorPeticion($idPeticion, $idCurso)
  {

    $sql = "SELECT pa.dniAlumno,al.nombre,al.apellidos,al.email from peticionfcts pfct
            INNER JOIN peticion_alumnos pa ON pa.idPeticion = pfct.id
            INNER JOIN alumnofct afct ON afct.dni = pa.dniAlumno
            INNER JOIN modalidad_fct m ON m.id = afct.modalidad
            INNER JOIN alumnoies al ON al.dni = afct.dni WHERE afct.en_practicas='NO' and  pa.idCurso = ? AND pfct.id = ?;";
    $sentencia = $this->conexion->prepare($sql);
    $sentencia->bind_param("ii", $idCurso, $idPeticion);
    $estado = $sentencia->execute();

    $resultado = $sentencia->get_result();
    $alumnosPeticion = array();

    if ($estado && $resultado->num_rows > 0) {
      while ($fila = $resultado->fetch_assoc()) {
        $alumnosPeticion[] = $fila;
      }
      return json_encode($alumnosPeticion);
    } else {
      return json_encode(array("Error" => "No se ha encontrado ningún por esa petición.."));
    }
  }

  public function realizarAsignacion($cif, $alumnosfct, $dniTutor)
  {
    $exito = true;
    $sql = "INSERT INTO Asignacion(cifEmpresa,dniAlum,dniTutor) VALUES(?,?,?)";
    $sentencia = $this->conexion->prepare($sql);

    foreach ($alumnosfct as $alumno) {

      $sentencia->bind_param("sss", $cif, $alumno['dniAlumno'], $dniTutor);
      $estado = $sentencia->execute();

      //Si no se ha ejecutado correctamente lanzamos un mensaje de error
      if (!$estado) {
        $exito = false;
        break;
      }
    }

    $sqlPra = "UPDATE alumnofct SET en_practicas = 'SI' WHERE dni = ? ";
    $sentenciaUpdate = $this->conexion->prepare($sqlPra);

    foreach ($alumnosfct as $alumno) {

      $sentenciaUpdate->bind_param("s", $alumno['dniAlumno']);
      $estadoUp = $sentenciaUpdate->execute();
      //Si no se ha ejecutado correctamente lanzamos un mensaje de error
      if (!$estadoUp) {
        $exito = false;
        break;
      }
    }

    if ($exito) {
      return json_encode(array("Exito" => "Se ha relizado correctamente la asignación"));
    } else {
      return json_encode(array("Error" => "Ha habido un error a relizar la asignación del alumno"));
    }
  }
}
