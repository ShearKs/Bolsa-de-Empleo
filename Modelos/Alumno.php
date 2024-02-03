<?php


class Alumno
{

    private $nombre;
    private $apellidos;
    private $dni;
    private $email;
    private $curso;
    private $telefono;


    public function __construct($nombre, $apellidos, $dni, $curso, $email,$telefono)
    {
        $this->nombre = $nombre;
        $this->apellidos = $apellidos;
        $this->dni = $dni;
        $this->curso = $curso;
        $this->email = $email;
        $this->telefono = $telefono;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getApellidos()
    {
        return $this->apellidos;
    }

    public function getDni()
    {
        return $this->dni;
    }


    public function getCurso()
    {
        return $this->curso;
    }


    public function getEmail()
    {
        return $this->email;
    }

    public function getTelefono(){
        return $this->telefono;
    }
}
