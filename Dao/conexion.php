<?php

/**
 * Description of Conexion
 *
 * @author Sergio
 */
class Conexion {

    private $host;
    private $baseDatos;
    private $usuario;
    private $contrasena;
    //Conexion
    private $conexion;


    //Método constructor que siempre que los inicialicemos se nos va crear la conexión con la base de datos
    public function __construct() {
      
        $this->host = "localhost";
        $this->usuario = "root";
        $this->contrasena = "";
        $this->baseDatos = "bolsaempleo_sfe";

        $this->conexion = new mysqli($this->host, $this->usuario, $this->contrasena, $this->baseDatos);
        
        //Para evitar que haga cosas raras con las tildes
        $this->conexion->set_charset("utf8");
       
        if ($this->conexion->connect_error) {
            
            echo "<p>Error conectando con la base de datos:".
                    $this->conexion->connect_error + "</p>";
            exit();
        }
        
    }
    
    //Esta clase nos devuelve la conexión para poder utilizarla en los daos
    public function getConexion() {
        return $this->conexion;
    }

    //Cierra la conexión
    public function cerrarConexion() {

        $this->conexion->close();
    }

}
