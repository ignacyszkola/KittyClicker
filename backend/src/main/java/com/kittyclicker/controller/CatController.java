package com.kittyclicker.controller;

import com.kittyclicker.dto.UserActionResponse;
import com.kittyclicker.entity.UpgradeType;
import com.kittyclicker.service.CatService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class CatController {

    private final CatService catService;

    public CatController(CatService catService){
        this.catService = catService;
    }

    @PostMapping(value="/{userId}/cats")
    public UserActionResponse buyCat(@PathVariable Long userId, @RequestBody UpgradeType type){
        return catService.buyCat(type, userId);
    }
}
