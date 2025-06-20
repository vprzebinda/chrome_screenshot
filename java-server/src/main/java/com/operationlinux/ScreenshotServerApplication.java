package com.operationlinux;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.*;
import java.security.MessageDigest;

@SpringBootApplication
@RestController
public class ScreenshotServerApplication {

    private static final String SCREENSHOT_DIRECTORY = "screenshots";

    public static void main(String[] args) {
        SpringApplication.run(ScreenshotServerApplication.class, args);
    }

    @GetMapping("/")
    public String root() {
        System.out.println("Root endpoint called");
        return "";
    }

    @GetMapping("/blank")
    public String blank() {
        System.out.println("/blank endpoint called");
        return "";
    }

    @PostMapping("/upload")
    public String upload(@RequestBody byte[] body) throws Exception {
        System.out.println("/upload endpoint called with body length: " + body.length);
        if (body.length == 0) {
            System.out.println("Received empty body, returning empty string");
            return "";
        }
        String hashname = calculateHash(body);
        Path path = Paths.get(SCREENSHOT_DIRECTORY, hashname + ".png");
        System.out.println("The path you will write the ss:  " + path.toAbsolutePath());
        Files.write(path, body);
        System.out.println("hash " + hashname + " " + body.length);
        return hashname;
    }

    @GetMapping("/screenshots/{key}")
    public ResponseEntity<byte[]> getImage(@PathVariable String key) throws Exception {
        System.out.println("/screenshots/{key} endpoint called with key: " + key);
        // long intKey = Long.parseLong(key);
        // System.out.println("loading " + key + " " + intKey);
        // no reason to mention key twice
        // Path path = Paths.get(SCREENSHOT_DIRECTORY, intKey + ".png");
        Path path = Paths.get(SCREENSHOT_DIRECTORY, key + ".png");
        byte[] image = Files.readAllBytes(path);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(image, headers, HttpStatus.OK);
    }

    private String calculateHash(byte[] data) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(data);
        long hashLong = 0;
        for (int i = 0; i < 8; i++) {
            hashLong = (hashLong << 8) | (hash[i] & 0xff);
        }
        return Long.toUnsignedString(hashLong);
    }
}