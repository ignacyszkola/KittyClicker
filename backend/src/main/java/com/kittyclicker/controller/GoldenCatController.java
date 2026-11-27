package com.kittyclicker.controller;

import com.kittyclicker.security.CurrentUser;
import com.kittyclicker.service.GoldenCatService;
import com.kittyclicker.dto.GoldenCatClaimResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/golden-cat")
public class GoldenCatController {

    private final GoldenCatService goldenCatService;
    private final CurrentUser currentUser;

    public GoldenCatController(
            GoldenCatService goldenCatService,
            CurrentUser currentUser
    ) {
        this.goldenCatService = goldenCatService;
        this.currentUser = currentUser;
    }

    @PostMapping("/appear")
    public ResponseEntity<Map<String, Instant>> appear() {
        Instant expiresAt = goldenCatService.startEvent(currentUser.getId());

        return ResponseEntity.ok(Map.of("expiresAt", expiresAt));
    }

    @PostMapping("/claim")
    public ResponseEntity<GoldenCatClaimResponse> claim() {
        return ResponseEntity.ok(
                goldenCatService.claimEvent(currentUser.getId())
        );
    }
}
