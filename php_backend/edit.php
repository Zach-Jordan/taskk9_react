<?php
session_start();
include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $postId = isset($_GET['postId']) ? $_GET['postId'] : null; // Access postId as a query parameter
    
    if ($postId !== null) {
        // Retrieve updated post data from the request body
        $data = json_decode(file_get_contents('php://input'), true);

        // Validate and sanitize inputs
        $category = filter_var($data['category'], FILTER_SANITIZE_STRING); 
        $page_title = filter_var($data['page_title'], FILTER_SANITIZE_STRING);
        $content = filter_var($data['content'], FILTER_SANITIZE_STRING);
        $media = filter_var($data['media'], FILTER_SANITIZE_URL);
        $permalink = filter_var($data['permalink'], FILTER_SANITIZE_STRING);

        // Prepared statement to prevent SQL injection
        try {
            $stmt = $conn->prepare("UPDATE posts SET category = ?, page_title = ?, content = ?, media = ?, permalink = ? WHERE post_id = ?");
            $stmt->execute([$category, $page_title, $content, $media, $permalink, $postId]);

            // Check if UPDATE operation was successful
            $rowCount = $stmt->rowCount();
            if ($rowCount > 0) {
                echo json_encode(array("message" => "Post updated successfully"));
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
