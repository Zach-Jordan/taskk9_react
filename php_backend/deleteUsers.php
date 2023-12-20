<?php
 include 'connection.php';
 
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);

    $userId = isset($data['userId']) ? $data['userId'] : null;

    if ($userId !== null) {
        try {
            $stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?");
            $stmt->execute([$userId]);

            $rowCount = $stmt->rowCount();
            if ($rowCount > 0) {
                echo json_encode(array("message" => "User deleted successfully"));
            } else {
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
