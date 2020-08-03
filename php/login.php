<?php
    header('Access-Control-Allow-Origin:*'); 
    header('Access-Control-Allow-Method:POST,GET');
    include 'conn.php';
    if(isset($_POST['username']) && isset($_POST['password'])){
        $username = $_POST['username'];
        $password = $_POST['password'];
        $result = $conn->query("select * from userinfo where username='$username' and password='$password'");
        // echo $result->num_rows;
        if($result->num_rows > 0){
            echo true;
        }else{
            echo false;
        }
    }
