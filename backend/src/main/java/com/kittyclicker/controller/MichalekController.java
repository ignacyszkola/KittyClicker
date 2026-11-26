package com.kittyclicker.controller;

import com.kittyclicker.dto.GameStatusResponse;
import com.kittyclicker.security.CurrentUser;
import com.kittyclicker.service.MichalekService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class MichalekController {

    private final CurrentUser currentUser;
    private final MichalekService michalekService;

    public MichalekController(CurrentUser currentUser, MichalekService michalekService) {
        this.currentUser = currentUser;
        this.michalekService = michalekService;
    }

    @GetMapping
    public GameStatusResponse getGame() {
        return michalekService.getGame(currentUser.getId());
    }
}
