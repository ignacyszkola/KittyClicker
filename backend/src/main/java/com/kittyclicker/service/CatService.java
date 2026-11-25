package com.kittyclicker.service;

import com.kittyclicker.dto.UserActionResponse;
import com.kittyclicker.entity.PassiveCat;
import com.kittyclicker.entity.UpgradeType;
import com.kittyclicker.entity.User;
import com.kittyclicker.exception.NotEnoughMaterialException;
import com.kittyclicker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.InvalidParameterException;
import java.util.NoSuchElementException;

@Service
public class CatService {

    private final UserRepository userRepository;

    public CatService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Transactional
    public UserActionResponse buyCat(UpgradeType type, Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
        if(type == null){
            throw new InvalidParameterException("You didn't chose a cat");
        }

        if(type == UpgradeType.PASSIVE_CAT){
            if(user.getPassiveCat() == null){
                if(user.getMoney()>=1){
                    user.setPassiveCat(new PassiveCat());
                    user.getPassiveCat().avaiableUpgrades();
                    user.setMoney(user.getMoney() - 1);
                }
                else{
                    throw new NotEnoughMaterialException("You do not have enough money to buy this cat");
                }
            }else {
                throw new InvalidParameterException("You already have this cat");
            }
        }
        else {
            if(!user.getUpgrade(type).isAvailable()){
                if(user.getMoney()>=1){
                    user.getUpgrade(type).purchase();
                    user.setMoney(user.getMoney() - 1);
                }
                else{
                    throw new NotEnoughMaterialException("You do not have enough money to buy this cat");
                }
            }
            else {
                throw new InvalidParameterException("You already have this cat");
            }
        }

        return new UserActionResponse(userId, user.getUsername(), "You bought " + type);
    }
}
