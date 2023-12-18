<?php
session_start();
include 'connection.php';

try {
    $stmt = $conn->prepare("
        SELECT posts.*, users.username AS username 
        FROM posts 
        INNER JOIN users 
        ON posts.user_id = users.user_id
    "); 
    $stmt->execute();
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($posts) {
        // Output posts as JSON if available
        echo json_encode(array("posts" => $posts));
        exit;
    } else {
        // Handle case when no posts are available
        echo json_encode(array("message" => "No posts available"));
        exit;
    }
} catch (PDOException $e) {
    echo json_encode(array("error" => "Error: " . $e->getMessage()));
    exit;
}
?>



