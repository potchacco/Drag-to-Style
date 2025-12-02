<?php
include 'config.php';

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    echo json_encode(["success" => false, "message" => "User ID required"]);
    exit();
}

try {
    $sql = "SELECT score, created_at FROM scores WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 10";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['user_id' => $userId]);
    $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "scores" => $scores
    ]);
    
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
