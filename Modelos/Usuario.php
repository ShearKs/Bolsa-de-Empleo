<?php

//MODELO USUARIO



class Usuario implements JsonSerializable
{

    private $id;
    private $nombreUsuario;
    private $contrasena;
    private $rol;

    public function __construct($nombreUsuario, $contrasena,$rol = null ,$id = null)
    {
        $this->id = $id;
        $this->nombreUsuario = $nombreUsuario;
        $this->contrasena = $contrasena;
        $this->rol = $rol;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getNombreUsuario()
    {
        return $this->nombreUsuario;
    }
    public function getContrasena()
    {
        return $this->contrasena;
    }

    public function getRol(){
        return $this->rol;
    }

    public function jsonSerialize()
    {
        return [
            'nombreUsuario' => $this->nombreUsuario,
            'contrasena' => $this->contrasena,
        ];
    }
}
