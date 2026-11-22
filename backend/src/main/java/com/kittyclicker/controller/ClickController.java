
package com.kittyclicker.controller;

import com.kittyclicker.security.CurrentUser;
import com.kittyclicker.service.ClickService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clicks")
public class ClickController {

    private final ClickService clickService;
    private final CurrentUser currentUser;

    public ClickController(
            ClickService clickService,
            CurrentUser currentUser
    ) {
        this.clickService = clickService;
        this.currentUser = currentUser;
    }

    @PostMapping
    public ResponseEntity<?> click() {
        return ResponseEntity.ok(
                clickService.click(currentUser.getId())
        );
    }
}
