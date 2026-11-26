package com.kittyclicker.controller;

import com.kittyclicker.dto.*;
import com.kittyclicker.service.ItemService;
import com.kittyclicker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.kittyclicker.security.CurrentUser;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ItemService itemService;
    private final CurrentUser currentUser;

    public UserController(UserService userService, ItemService itemService, CurrentUser currentUser){
        this.userService = userService;
        this.itemService = itemService;
        this.currentUser = currentUser;
    }

    @GetMapping(value = "/{id}")
    public UserBalanceResponse getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }

    @PostMapping(value="/{userId}/items/{itemId}/use", produces = "application/json")
    public UserActionResponse useItem(@PathVariable Long userId, @PathVariable Long itemId){
        return itemService.useItem(userId, itemId);
    }

    @PatchMapping(value="/{userId}/skin", produces = "application/json")
    public SelectedCatResponse selectClickableCat(@PathVariable Long userId, @RequestBody Long skinId){
        return userService.selectClickableCat(userId, skinId);
    }

}