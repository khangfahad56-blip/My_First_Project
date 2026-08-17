<?php
// handlers/gold_rate_api.php – Live Pakistani Gold Rate API Architecture & Fallback
// Usage: require_once 'handlers/gold_rate_api.php'; $rates = get_latest_gold_rates($conn);

function get_latest_gold_rates($conn) {
    // Default rates fallback
    $rates = [
        'gold_24k'       => 329500.00,
        'gold_21k'       => 288300.00,
        'silver_normal'  => 3600.00,
        'silver_italian' => 4800.00,
        'rate_date'      => date('Y-m-d'),
        'source'         => 'Local Sarafa Market (Nowshera)'
    ];

    if (!$conn) return $rates;

    // Fetch latest stored rate from DB
    $res = $conn->query("SELECT * FROM gold_rates ORDER BY rate_date DESC, id DESC LIMIT 1");
    if ($res && $res->num_rows > 0) {
        $row = $res->fetch_assoc();
        $rates['gold_24k']       = floatval($row['gold_24k']);
        $rates['gold_21k']       = floatval($row['gold_21k']);
        $rates['silver_normal']  = floatval($row['silver_normal']);
        $rates['silver_italian'] = floatval($row['silver_italian']);
        $rates['rate_date']      = $row['rate_date'];
    }

    /* 
     ===================================================================
     FUTURE LIVE API INTEGRATION ARCHITECTURE (e.g. Peshawar / Islamabad Sarafa API)
     ===================================================================
     If a live REST API endpoint becomes available in the future, connect here:

     $api_url = "https://api.sarafamarket.pk/v1/rates/peshawar";
     $ch = curl_init($api_url);
     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
     curl_setopt($ch, CURLOPT_TIMEOUT, 3);
     $response = curl_exec($ch);
     curl_close($ch);

     if ($response) {
         $data = json_decode($response, true);
         if (isset($data['24K'])) {
             // Update database & return fresh rates
         }
     }
     ===================================================================
    */

    return $rates;
}
?>
