<?php
session_start();
include 'connection.php';

// Checks if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = $_POST;

    // Checking if postId exists and is numeric
    if (isset($data['postId']) && is_numeric($data['postId'])) {
        $postId = $data['postId'];
        $categoryId = filter_var($data['category'], FILTER_SANITIZE_STRING);
        $pageTitle = filter_var($data['pageTitle'], FILTER_SANITIZE_STRING);
        // content is not sanitized as to send data as raw HTML
        $content = $_POST['content'];
        $permalink = filter_var($data['permalink'], FILTER_SANITIZE_STRING);
        $updatedAt = date('Y-m-d H:i:s');

        // Check if an image is uploaded
        if (isset($_FILES["media"]) && $_FILES["media"]["error"] === UPLOAD_ERR_OK) {
            $targetDirectory = "uploads/";
            $targetFileName = $_FILES["media"]["name"];
            $targetFile = $targetDirectory . basename($targetFileName);

            // Check if the uploaded file is an image
            $isImage = getimagesize($_FILES["media"]["tmp_name"]);

            // If the uploaded file is an image
            if ($isImage !== false) {
                if (!file_exists($targetDirectory)) {
                    mkdir($targetDirectory, 0777, true);
                }

                if (move_uploaded_file($_FILES["media"]["tmp_name"], $targetFile)) {
                    // Update both image and textual data
                    try {
                        $stmt = $conn->prepare("UPDATE posts SET category_id=?, page_title=?, content=?, permalink=?, media=?, updated_at=? WHERE post_id=?");
                        $stmt->execute([$categoryId, $pageTitle, $content, $permalink, $targetFile, $updatedAt, $postId]);

                        echo json_encode(array("message" => "Post updated successfully"));
                        exit;
                    } catch (PDOException $e) {
                        error_log("SQL Error: SQLSTATE[" . $e->errorInfo[0] . "], Code: " . $e->errorInfo[1] . ", Message: " . $e->errorInfo[2]);
                        echo json_encode(array("error" => "An error occurred while updating the post: " . $e->getMessage()));
                        exit;
                    }
                } else {
                    echo json_encode(array("error" => "Error uploading file"));
                    exit;
                }
            } else {
                echo json_encode(array("error" => "File is not an image"));
                exit;
            }
        }

        // If no new image is uploaded, update only textual data
        try {
            $stmt = $conn->prepare("UPDATE posts SET category_id=?, page_title=?, content=?, permalink=?, updated_at=? WHERE post_id=?");
            $stmt->execute([$categoryId, $pageTitle, $content, $permalink, $updatedAt, $postId]);

            echo json_encode(array("message" => "Post updated successfully"));
        } catch (PDOException $e) {
            error_log("SQL Error: SQLSTATE[" . $e->errorInfo[0] . "], Code: " . $e->errorInfo[1] . ", Message: " . $e->errorInfo[2]);
            echo json_encode(array("error" => "An error occurred while updating the post: " . $e->getMessage()));
        }
    } else {
        echo json_encode(array("error" => "Invalid or missing postId"));
        exit;
    }
}
?>
