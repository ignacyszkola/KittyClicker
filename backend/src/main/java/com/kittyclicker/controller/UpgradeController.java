package com.kittyclicker.controller;

import com.kittyclicker.dto.UserActionResponse;
import com.kittyclicker.entity.UpgradeType;
import com.kittyclicker.service.UpgradeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UpgradeController {

    private final UpgradeService upgradeService;

    public UpgradeController(UpgradeService upgradeService){
        this.upgradeService = upgradeService;
    }

    @PostMapping(value = "/{userId}/upgrades")
    public UserActionResponse upgradeCat(@PathVariable Long userId, @RequestBody UpgradeType type){
        return upgradeService.upgrade(userId, type);
    }

}
