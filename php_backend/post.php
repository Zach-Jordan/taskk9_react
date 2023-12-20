<?php
session_start();
include 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = $_POST;

    if(isset($data['userId']) && is_numeric($data['userId'])) {
        $userId = $data['userId'];

        $categoryId = filter_var($data['category'], FILTER_SANITIZE_STRING); 
        $pageTitle = filter_var($data['pageTitle'], FILTER_SANITIZE_STRING); 
        $content = filter_var($data['content'], FILTER_SANITIZE_STRING); 
        $permalink = filter_var($data['permalink'], FILTER_SANITIZE_STRING); 
        $createdAt = intval($data['created_at']); 

        $targetDirectory = "uploads/";
        $targetFileName = $_FILES["media"]["name"];
        $targetFile = $targetDirectory . basename($targetFileName);

        if (!file_exists($targetDirectory)) {
            mkdir($targetDirectory, 0777, true);
        }

        $isImage = getimagesize($_FILES["media"]["tmp_name"]);
        if ($isImage !== false) {
            if (move_uploaded_file($_FILES["media"]["tmp_name"], $targetFile)) {
                try {
                    $stmt = $conn->prepare("INSERT INTO posts (user_id, category_id, page_title, content, permalink, media, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    $stmt->execute([$userId, $categoryId, $pageTitle, $content, $permalink, $targetFile, $createdAt]);

                    echo json_encode(array("message" => "Post created successfully"));
                } catch (PDOException $e) {
                    error_log("Error inserting post: " . $e->getMessage());
                    echo json_encode(array("error" => "An error occurred while creating the post."));
                }
            } else {
                echo json_encode(array("error" => "Error uploading file"));
            }
        } else {
            echo json_encode(array("error" => "File is not an image"));
        }
    } else {
        echo json_encode(array("error" => "Invalid or missing userId or category"));
        exit;
    }
}
?>
