<?php
session_start();
include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if(isset($data['userId']) && is_numeric($data['userId'])) {
        $userId = $data['userId'];

        $categoryId = filter_var($data['category'], FILTER_SANITIZE_STRING); 
        $pageTitle = filter_var($data['pageTitle'], FILTER_SANITIZE_STRING); 
        $content = filter_var($data['content'], FILTER_SANITIZE_STRING); 
        $permalink = filter_var($data['permalink'], FILTER_SANITIZE_STRING); 
        $media = filter_var($data['media'], FILTER_SANITIZE_URL); 
        $createdAt = intval($data['created_at']); 

        try {
            $stmt = $conn->prepare("INSERT INTO posts (user_id, category_id, page_title, content, permalink, media, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$userId, $categoryId, $pageTitle, $content, $permalink, $media, $createdAt]);

            echo json_encode(array("message" => "Post created successfully"));
        } catch (PDOException $e) {
            error_log("Error inserting post: " . $e->getMessage());
            echo json_encode(array("error" => "An error occurred while creating the post."));
        }
    } else {
        echo json_encode(array("error" => "Invalid or missing userId or category"));
        exit;
    }
}
?>
