<?php
header('Access-Control-Allow-Origin:*'); 
header('Access-Control-Allow-Method:POST,GET');
    include 'conn.php';

    if(isset($_POST['submit'])){
        $phone = $_POST['phone'];
        $password = sha1($_POST['password']);
        $repass = sha1($_POST['repass']);
        $conn->query("insert userinfo values(null,'$phone','$phone','$password','$repass',NOW())");
        header("location:http://localhost/dangdang/src/index123.html");
    }

    if(isset($_GET['phone'])){
        $phone = $_GET['phone'];
        $result = $conn->query("select * from userinfo where phone='$phone'");
        if($result->num_rows>0){
            echo true;
        }else{
            echo false;
        }
    }