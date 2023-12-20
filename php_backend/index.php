<?php
session_start();
include 'connection.php';

$query = "SELECT posts.*, users.username AS username, categories.category_name AS category 
          FROM posts 
          INNER JOIN users ON posts.user_id = users.user_id
          INNER JOIN categories ON posts.category_id = categories.category_id";

$params = array(); 

if (isset($_GET['category'])) {
    $categoryId = $_GET['category'];
    $query .= " WHERE posts.category_id = :categoryId";
    $params['categoryId'] = $categoryId; 
}


try {
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($posts) {
        echo json_encode(array("posts" => $posts));
        exit;
    } else {
        echo json_encode(array("message" => "No posts available"));
        exit;
    }
} catch (PDOException $e) {
    echo json_encode(array("error" => "Error: " . $e->getMessage()));
    exit;
}
?>



