<?php


class AlumnoBolsa extends Alumno implements JsonSerializable
{

    private $experienciaLaboral;
    private $idUsuario;


    public function __construct($nombre, $apellidos, $dni, $titulacion, $email, $telefono, $experienciaLaboral, $idUsuario = null)
    {
        parent::__construct($nombre, $apellidos, $dni, $titulacion, $email, $telefono);
        $this->experienciaLaboral = $experienciaLaboral;
        $this->idUsuario = $idUsuario;
    }

    public function getIdUsuario()
    {
        return $this->idUsuario;
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
