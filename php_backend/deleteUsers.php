<?php
include 'connection.php'; 

// Checks if the request method is DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') { 
    $data = json_decode(file_get_contents('php://input'), true); 

    // Retrieves userId from input data
    $userId = isset($data['userId']) ? $data['userId'] : null; 

    // Checking if userId exists
    if ($userId !== null) { 
        try {
            // Prepares statement to delete a user with a specific user_id
            $stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?");
            $stmt->execute([$userId]); 

            $rowCount = $stmt->rowCount(); 

            if ($rowCount > 0) {
                // Returns success message
                echo json_encode(array("message" => "User deleted successfully")); 
            } else {
                // Returns error if no user found
                echo json_encode(array("error" => "No User found with given ID")); 
            }
        } catch (PDOException $e) {
            echo json_encode(array("error" => "Error: " . $e->getMessage())); 
        }
    } else {
        echo json_encode(array("error" => "No UserId received")); 
        exit; 
    }
}
?>
