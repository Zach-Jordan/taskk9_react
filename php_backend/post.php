<?php
session_start();
include 'connection.php';

// checks is the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = $_POST;

    if (isset($data['userId']) && is_numeric($data['userId'])) {
        $userId = $data['userId'];
        $categoryId = filter_var($data['category'], FILTER_SANITIZE_STRING);
        $pageTitle = filter_var($data['pageTitle'], FILTER_SANITIZE_STRING);
        // content is not sanitized to send data as raw HTML
        $content = $_POST['content'];
        $permalink = filter_var($data['permalink'], FILTER_SANITIZE_STRING);
        $createdAt = $data['created_at'];

        // Check if a file is uploaded
        if (isset($_FILES["media"]) && $_FILES["media"]["error"] !== UPLOAD_ERR_NO_FILE) {
            // Process file upload
            if ($_FILES["media"]["error"] === UPLOAD_ERR_OK) {
                $targetDirectory = "uploads/";
                $targetFileName = $_FILES["media"]["name"];
                $targetFile = $targetDirectory . basename($targetFileName);

                $isImage = getimagesize($_FILES["media"]["tmp_name"]);

                // Create the directory if it doesn't exist
                if ($isImage !== false) {
                    if (!file_exists($targetDirectory)) {
                        mkdir($targetDirectory, 0777, true);
                    }

                    // Move uploaded file to the target directory
                    if (move_uploaded_file($_FILES["media"]["tmp_name"], $targetFile)) {
                        try {
                            $completePath = $targetDirectory . $targetFileName;

                            $stmt = $conn->prepare("INSERT INTO posts (user_id, category_id, page_title, content, permalink, media, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
                            $stmt->execute([$userId, $categoryId, $pageTitle, $content, $permalink, $completePath, $createdAt]);

                            // Respond with a success message
                            echo json_encode(array("message" => "Post created successfully"));
                        } catch (PDOException $e) {
                            error_log("Error inserting post: " . $e->getMessage());
                            echo json_encode(array("error" => "An error occurred while creating the post. Database error: " . $e->getMessage()));
                        }
                    } else {
                        echo json_encode(array("error" => "Error moving uploaded file"));
                    }
                } else {
                    echo json_encode(array("error" => "File is not an image"));
                }
            } else {
                echo json_encode(array("error" => "File upload error"));
            }
        } else {
            // If no file uploaded, proceed to insert post without media
            try {
                $stmt = $conn->prepare("INSERT INTO posts (user_id, category_id, page_title, content, permalink, created_at) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$userId, $categoryId, $pageTitle, $content, $permalink, $createdAt]);

                // Respond with a success message
                echo json_encode(array("message" => "Post created successfully without media"));
            } catch (PDOException $e) {
                error_log("Error inserting post: " . $e->getMessage());
                echo json_encode(array("error" => "An error occurred while creating the post. Database error: " . $e->getMessage()));
            }
        }
    } else {
        echo json_encode(array("error" => "Invalid or missing userId"));
        exit;
    }
}
?>
