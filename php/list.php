<?php
header('Access-Control-Allow-Origin:*'); 
header('Access-Control-Allow-Method:POST,GET');
    include 'conn.php';
    
    $pagelength = 10;//单页长度
    //当前页数
    if(isset($_POST['page'])){
        $page = $_POST['page'];
    }else{
        $page = 1;     
    }
    $index = ($page-1) * $pagelength;   //每页起始索引
    //接收排序方式
    if(isset($_POST['sortType'])){
        $type = $_POST['sortType'];
    }else{
        $type = 'z';
    }
    switch($type){
        case 'z'://按NO递增
            $result = $conn->query("select * from booklist limit $index,$pagelength");
            break;
        case 'u'://价格递增
            $result = $conn->query("select * from booklist order by nowprice limit $index,$pagelength");
            break;
        case 'd'://价格递减
            $result = $conn->query("select * from booklist order by nowprice desc limit $index,$pagelength");
            break;
    } 
    $arr = [];
    for($i=0;$i<$result->num_rows;$i++){
        $arr[$i] = $result->fetch_assoc();
    }
    echo json_encode($arr);