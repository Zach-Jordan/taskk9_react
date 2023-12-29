<?php
session_start();
include 'connection.php'; 
  
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Query to fetch categories from the database
        $stmt = $conn->query("SELECT * FROM categories");
        // Fetchs categories as associative array
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        // Encoding categories as JSON and outputting
        echo json_encode($categories); 
    } catch (PDOException $e) {
        // Logging error message if an exception occurs during fetching
        error_log("Error fetching categories: " . $e->getMessage());
        echo json_encode(array("error" => "An error occurred while fetching categories."));
    }
}
?>
