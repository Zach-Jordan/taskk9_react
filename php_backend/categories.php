<?php
session_start();
include 'connection.php';
  
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM categories");
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($categories);
    } catch (PDOException $e) {
        error_log("Error fetching categories: " . $e->getMessage());
        echo json_encode(array("error" => "An error occurred while fetching categories."));
    }
}
?>
