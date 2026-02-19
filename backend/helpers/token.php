<?php

class Token {

    private static string $secret = "kaiceviolation";

    public static function generate(array $payload): string {
        $header = base64_encode(json_encode([
            "alg" => "HS256",
            "typ" => "JWT"
        ]));

        $body = base64_encode(json_encode($payload));

        $signature = hash_hmac(
            "sha256",
            "$header.$body",
            self::$secret
        );

        return "$header.$body.$signature";
    }

    public static function verify(string $token): array|false {
        $parts = explode(".", $token);

        if (count($parts) !== 3) {
            return false;
        }

        [$header, $body, $signature] = $parts;

        $validSignature = hash_hmac(
            "sha256",
            "$header.$body",
            self::$secret
        );

        if (!hash_equals($validSignature, $signature)) {
            return false;
        }

        return json_decode(base64_decode($body), true);
    }
}