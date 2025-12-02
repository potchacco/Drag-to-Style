<?php
include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['user_id'] ?? null;
$score = $data['score'] ?? null;

if (!$userId || $score === null) {
    echo json_encode(["success" => false, "message" => "Missing data"]);
    exit();
}

try {
    $sql = "INSERT INTO scores (user_id, score) VALUES (:user_id, :score)";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['user_id' => $userId, 'score' => $score]);
    
    echo json_encode([
        "success" => true,
        "message" => "Score saved successfully"
    ]);
    
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
