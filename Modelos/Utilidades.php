<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require('../lib/PHPMailer/src/Exception.php');
require('../lib/PHPMailer/src/PHPMailer.php');
require('../lib/PHPMailer/src/SMTP.php');

//Clase que se encarga de proporcionar funciones utiles que puedan ser útiles en la aplicación.s
class Utilidades
{


    public function __construct()
    {
    }

    public function generarIdAlumno()
    {
        $letras = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $idGenerado = "";

        //Añadimos los numero aletorios al id
        for ($i = 0; $i < 8; $i++) {
            $num = rand(0, 9);
            $idGenerado .= $num;
        }

        //Añadimos letras aleatorias al id
        for ($i = 0; $i < 3; $i++) {
            $letraAle = $letras[rand(0, strlen($letras) - 1)];
            $idGenerado .= $idGenerado;
        }

        //Devolvemos el id Aleatorio
        return $idGenerado;
    }

    public function generarContrasenaAle()
    {

        $caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $longitud = 8;
        $contrasena = '';

        for ($i = 0; $i < $longitud; $i++) {
            $indice = rand(0, strlen($caracteres) - 1);
            $contrasena .= $caracteres[$indice];
        }

        return $contrasena;
    }


    public function enviarCorreo($correoElectronico, $mensaje)
    {

        //Create an instance; passing `true` enables exceptions
        $mail = new PHPMailer(true);

        try {
            //Por si queremos depurar el envio del email descomentar
            //$mail->SMTPDebug = SMTP::DEBUG_SERVER;

            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->Username = "sergiopruebasfernandez@gmail.com";
            $mail->Password = "xygf ebgj gway hjtd";


            $mail->setFrom('sergiopruebasfernandez@gmail.com', 'Bolsa de Empleo IES Leonardo Da Vinci');
            $mail->addAddress($correoElectronico, "Sergio");
            //Content
            $mail->isHTML(true);
            $mail->Subject = 'Correo Enviado';
            $mail->Body    = 'Tienes un nuevo mensaje\n' . $mensaje;

            $mail->send();
            //echo 'El correo ha sido enviado correctamente';
        } catch (Exception $e) {
            echo "El mensanje no pudo ser enviado. Tipo de Error: {$mail->ErrorInfo}";
        }
    }
}
