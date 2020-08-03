<?php
header('Access-Control-Allow-Origin:*'); 
header('Access-Control-Allow-Method:POST,GET');
    include 'conn.php';
    if(isset($_POST['bid'])){
        $bid = $_POST['bid'];
        $result = $conn->query("select * from booklist where bid='$bid'");
        echo json_encode($result->fetch_assoc());
    }