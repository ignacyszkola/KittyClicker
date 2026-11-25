package com.kittyclicker.service;

import com.kittyclicker.dto.UserActionResponse;
import com.kittyclicker.entity.InventoryItem;
import com.kittyclicker.entity.Item;
import com.kittyclicker.entity.User;
import com.kittyclicker.exception.NotEnoughMaterialException;
import com.kittyclicker.repository.InventoryItemRepository;
import com.kittyclicker.repository.ItemRepository;
import com.kittyclicker.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.NoSuchElementException;

@Service
public class ItemService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final InventoryItemRepository inventoryItemRepository;

    public ItemService(UserRepository userRepository, ItemRepository itemRepository, InventoryItemRepository inventoryItemRepository) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.inventoryItemRepository = inventoryItemRepository;
    }

    @Transactional
    public UserActionResponse useItem(Long userId, Long itemId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));

        Instant now = Instant.now();

        if (user.getActiveItemExpiresAt() != null && user.getActiveItemExpiresAt().isAfter(now)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Another item is already active"
            );
        }

        Item item = itemRepository.findById(itemId).orElseThrow(() -> new NoSuchElementException("Item not found"));
        InventoryItem inventoryItem = inventoryItemRepository.findByUserIdAndItemId(userId, itemId)
                .orElseThrow(() -> new NotEnoughMaterialException("You do not have this item"));

        inventoryItem.consume();

        user.setActiveItem(item);
        user.setActiveItemExpiresAt(now.plusSeconds(item.getDurationSeconds()));

        return new UserActionResponse(
                userId, user.getUsername(), "You activated " + item.getName()
        );
    }
}