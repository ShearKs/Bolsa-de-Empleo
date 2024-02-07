<?php


class AlumnoBolsa extends Alumno implements JsonSerializable
{

    private $experienciaLaboral;
    private $residencia;
    private $posiViajar;
    private $disponibilidad;
    private $idUsuario;


    public function __construct($nombre, $apellidos, $dni, $titulacion, $email, $telefono,$residencia,$posiViajar ,$experienciaLaboral,$disponibilidad ,$idUsuario = null)
    {
        parent::__construct($nombre, $apellidos, $dni, $titulacion, $email, $telefono);
        $this->residencia = $residencia;
        $this->disponibilidad = $disponibilidad;
        $this->posiViajar =$posiViajar;
        $this->experienciaLaboral = $experienciaLaboral;
        $this->idUsuario = $idUsuario;
    }

    public function getIdUsuario()
    {
        return $this->idUsuario;
    }

    public function getResidencia(){
        return $this->residencia;
    }

    public function getPosViajar(){
        return $this->posiViajar;
    }
    public function getDisponibilidad(){
        return $this->disponibilidad;
    }


    public function getExperiencia()
    {
        return $this->experienciaLaboral;
    }

    public function jsonSerialize()
    {
        return [
            'nombre' => $this->getNombre(),
            'apellidos' => $this->getApellidos(),
            'dni' => $this->getDni(),
            'curso' => $this->getCurso(),
            'email' => $this->getEmail(),
            'telefono' => $this->getTelefono(),
            'experienciaLaboral' => $this->experienciaLaboral,
            'idUsuario' => $this->idUsuario,
        ];
    }
}
