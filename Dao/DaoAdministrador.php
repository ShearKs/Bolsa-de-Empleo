<?php

include_once 'Conexion.php';
include_once '../Modelos/Alumno.php';
include_once '../Modelos/AlumnoBolsa.php';
include_once '../Modelos/Empresa.php';
include_once '../Modelos/Utilidades.php';


class DaoAdministrador
{

    private $conexion;
    private $utils;

    public function __construct()
    {
        $claseConexion = new Conexion();
        $this->conexion = $claseConexion->getConexion();
        $this->utils = new Utilidades();
    }

    public function obtenerAlumno($dni){


        $sql = "SELECT a.dni,a.nombre,a.apellidos,a.email as 'Correo Electronico',a.telefono as 'teléfono',ab.expLaboral as 'Experiencia Laboral' FROM alumnoies a
                INNER JOIN alumno_bolsa ab ON ab.dni = a.dni  WHERE ab.dni = ?  ;";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("s",$dni);
        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();

        $alumno = array();

        //Una fila como es por dni obtendremos solo a un alumno...
        if($estado !== null && $resultado->num_rows == 1  ){

            $alumno = $resultado->fetch_assoc();
            if(empty($alumno["Experiencia Laboral"])){
                $alumno["Experiencia Laboral"] = "No tiene experiencia laboral...";
            }
            return json_encode($alumno);
        }else{
            return json_encode(array('Error' => "No se ha encontrado a ningún alummno con el dni: ".$dni));
        }

    }

    public function obtenerEmpresa($cif){
        $sql = "SELECT nombre,lugar,direccion as 'dirección',correo,telefono as 'teléfono' FROM Empresa WHERE cif = ? ";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("s",$cif);

        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();

        //Como el cif es único y solo vamos a sacar los datos de una empresa...
        if($estado && $resultado->num_rows == 1){
            $empresa = $resultado->fetch_assoc();
           
            echo json_encode($empresa);
        }else{
            //Si no existe la empresa que hemos pasado por parámetro...
            echo json_encode(array("Error" => "La empresa que has indicado no existe.."));
        }
    }
    
    public function solicitudesEmpresa($cif){

        $sql = "SELECT s.nombre as 'Nombre Oferta',s.fecha_solicitud as 'fecha',group_concat(c.nombre) as 'Cursos de la Oferta'  from solicitud s 
                    INNER JOIN solicitud_curso sc ON s.id = sc.idSolicitud
                    INNER JOIN curso c ON c.id = sc.idCurso
                    where cif_empresa = ?
                    group by s.id;";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("s",$cif);
        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();

        $solicitudes = array();

        if($estado && $resultado->num_rows > 0){

            while($fila = $resultado->fetch_assoc()){
                $solicitudes[] = $fila;
            }

            return json_encode($solicitudes);

        }else{
            return json_encode(array('Error' => "La empresa indicada no tiene solicitudes.."));
        }

    }

    public function contratosEmpresa($cif){

        $sql = "SELECT ab.dni,concat(a.nombre,' ',a.apellidos) as 'Alumno contratado',group_concat(c.nombre) as 'Cursos del alumno',expLaboral as 'Experiencia Laboral',ab.activo,fecha_contrato as 'Fecha Contrato' FROM empleadora e
                INNER JOIN alumno_bolsa ab ON ab.dni = e.dniAlum
                INNER JOIN alumnoies a ON a.dni = ab.dni
                INNER JOIN cursa_alumn cur ON cur.dniAlum = ab.dni
                INNER JOIN curso c ON c.id = cur.idCurso
                WHERE cifEmpresa = ?
                group by e.id;";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param("s",$cif);
        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();

        $contratos = array();

        if($estado && $resultado->num_rows > 0){

            while($fila = $resultado->fetch_assoc()){
                $contratos[] = $fila;
            }

            return json_encode($contratos);

        }else{
            return json_encode(array('Error' => "La empresa indicada no tiene contratos"));
        }

    }



    public function obtenerListadoAlumnos($idCurso)
    {
        //$condicionCurso = ($idCurso == 0) ? "" : "AND idCurso = ?";

        $sql = "SELECT a.dni,a.nombre,a.apellidos,a.email,group_concat(c.nombre) as 'cursos'   FROM alumnoies a
                    INNER JOIN alumno_bolsa ab ON ab.dni = a.dni
                    INNER JOIN cursa_alumn cur ON cur.dniAlum = ab.dni
                    INNER JOIN curso c ON c.id = cur.idCurso
                    WHERE activo ='SI' "; 
                
        if ($idCurso !== 0){
            $sql .=  " AND c.id = ? ";
        }

        $sql .= "GROUP BY ab.dni";
        
        $sentencia = $this->conexion->prepare($sql);

        if($idCurso !== 0){
            $sentencia->bind_param("i",$idCurso);
        }
    
        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();

        $alumnos = array();

        if ($estado && $resultado->num_rows > 0 ) {
            while ($fila = $resultado->fetch_assoc()) {
                $alumnos[] = $fila;
            }
        }
        return $alumnos;
    }

    public function obtenerListadoEmpresas($idCurso){

        $sql = "SELECT a.* from empresa a
                INNER JOIN solicitud s ON s.cif_empresa = a.cif
                INNER JOIN solicitud_curso sa ON sa.idSolicitud = s.id ";
        
        if($idCurso !== 0){
            $sql .= " WHERE sa.idCurso = ?";
        }
        $sql .= " GROUP BY a.cif";
        $sentencia = $this->conexion->prepare($sql);
        if($idCurso !== 0){
            $sentencia->bind_param("i",$idCurso);
        }
        $estado = $sentencia->execute();
        $resultado = $sentencia->get_result();

        $empresas = array();

        if($estado && $resultado->num_rows > 0){
            while($fila = $resultado->fetch_assoc()){
                $empresas[] = $fila;
            }

        }
        return $empresas;
    }

}
