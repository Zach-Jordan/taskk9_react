<?php
session_start();
include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = $_POST;

    if(isset($data['postId']) && is_numeric($data['postId'])) {
        $postId = $data['postId'];

        $userId = $data['userId'];

        $categoryId = filter_var($data['category'], FILTER_SANITIZE_STRING); 
        $pageTitle = filter_var($data['pageTitle'], FILTER_SANITIZE_STRING); 
        $content = filter_var($data['content'], FILTER_SANITIZE_STRING); 
        $permalink = filter_var($data['permalink'], FILTER_SANITIZE_STRING); 
        $createdAt = intval($data['created_at']); 

        $uniqueDirectoryName = uniqid(); // Generate a unique identifier for directory name
        $targetDirectory = "uploads/" . $uniqueDirectoryName . "/";

        if (!file_exists($targetDirectory)) {
            mkdir($targetDirectory, 0777, true);
        }

        $targetFile = $targetDirectory . basename($_FILES["media"]["name"]);

        if (move_uploaded_file($_FILES["media"]["tmp_name"], $targetFile)) {
            try {
                $stmt = $conn->prepare("UPDATE posts SET user_id=?, category_id=?, page_title=?, content=?, permalink=?, media=?, created_at=? WHERE post_id=?");
                $stmt->execute([$userId, $categoryId, $pageTitle, $content, $permalink, $targetFile, $createdAt, $postId]);

                echo json_encode(array("message" => "Post updated successfully"));
            } catch (PDOException $e) {
                error_log("Error updating post: " . $e->getMessage());
                echo json_encode(array("error" => "An error occurred while updating the post."));
            }
        } else {
            echo json_encode(array("error" => "Error uploading file"));
        }
    } else {
        echo json_encode(array("error" => "Invalid or missing postId or userId"));
        exit;
    }
}
?>
