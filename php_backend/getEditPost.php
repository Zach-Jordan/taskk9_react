<?php
session_start();
include 'connection.php';

// Checking if the request method is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $postId = isset($_GET['postId']) ? $_GET['postId'] : null; 
    
    // Validates numeric validity for postId
    if (!is_numeric($postId)) {
        echo json_encode(array("error" => "Invalid postId"));
        exit;
    }

    // Checks if postId exists
    if ($postId !== null) {
        try {
            // Prepared statement to select a post with a specific post_id
            $stmt = $conn->prepare("SELECT * FROM posts WHERE post_id = ?");
            $stmt->execute([$postId]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($post) {
                echo json_encode($post); 
            } else {
                echo json_encode(array("message" => "No post found with given ID"));
            }
        } catch (PDOException $e) {
            echo json_encode(array("error" => "Error: " . $e->getMessage()));
        }
    } else {
        echo json_encode(array("error" => "No postId received"));
        exit; 
    }
}
?>
