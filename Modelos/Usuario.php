<?php

//MODELO USUARIO



class Usuario implements JsonSerializable
{

    private $id;
    private $nombreUsuario;
    private $contrasena;

    public function __construct($nombreUsuario, $contrasena, $id = null)
    {
        $this->id = $id;
        $this->nombreUsuario = $nombreUsuario;
        $this->contrasena = $contrasena;
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

    public function jsonSerialize()
    {
        return [
            'nombreUsuario' => $this->nombreUsuario,
            'contrasena' => $this->contrasena,
        ];
    }
}
