package com.kittyclicker.service;

import com.kittyclicker.dto.UserActionResponse;
import com.kittyclicker.entity.PassiveCat;
import com.kittyclicker.entity.Upgrade;
import com.kittyclicker.entity.UpgradeType;
import com.kittyclicker.entity.User;
import com.kittyclicker.exception.NotEnoughMaterialException;
import com.kittyclicker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.InvalidParameterException;
import java.util.NoSuchElementException;

@Service
public class UpgradeService {

    private final UserRepository userRepository;

    public UpgradeService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private long calculateCost(int level) {
        return (long) Math.ceil(1 + level * 1.5);
    }

    @Transactional
    public UserActionResponse upgrade(Long userId, UpgradeType type){
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));

        if(type == null){
            throw new InvalidParameterException("Invalid upgrade type");
        }


        if(type == UpgradeType.PASSIVE_CAT && user.getPassiveCat() == null){
            throw new InvalidParameterException("You do not own a Passive Cat");
        }
        else if(type == UpgradeType.PASSIVE_CAT && user.getPassiveCat() != null){
            PassiveCat passiveCat = user.getPassiveCat();
            long cost = calculateCost(passiveCat.getLevel());

            if(user.getMoney() < cost){
                throw new NotEnoughMaterialException("You don't have enough money");
            }
            user.setMoney(user.getMoney() - cost);

            passiveCat.upgrade();
            userRepository.save(user);
        }

        else {
            Upgrade upgrade = user.getUpgrade(type);
            long cost = calculateCost(upgrade.getLevel());
            if (user.getMoney() < cost) {
                throw new NotEnoughMaterialException("You don't have enough money");
            }

            user.setMoney(user.getMoney() - cost);

            upgrade.levelUp(type);
            userRepository.save(user);
        }

        return new UserActionResponse(userId, user.getUsername(), "You successfully upgraded " + type);
    }
}
