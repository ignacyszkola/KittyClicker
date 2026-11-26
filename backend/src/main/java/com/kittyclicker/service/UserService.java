package com.kittyclicker.service;

import com.kittyclicker.dto.*;
import com.kittyclicker.entity.CatSkin;
import com.kittyclicker.entity.User;
import com.kittyclicker.exception.InvalidCredentialsException;
import com.kittyclicker.repository.CatSkinRepository;
import com.kittyclicker.repository.UserCatSkinRepository;
import com.kittyclicker.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserCatSkinRepository userCatSkinRepository;
    private final CatSkinRepository catSkinRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
                       UserCatSkinRepository userCatSkinRepository, CatSkinRepository catSkinRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userCatSkinRepository = userCatSkinRepository;
        this.catSkinRepository = catSkinRepository;
    }

    public UserActionResponse register(UserRegistrationRequest request){
        String hashedPassword = passwordEncoder.encode(request.password());

        User user = new User(request.username(), hashedPassword);
        User savedUser = userRepository.save(user);

        return new UserActionResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                "you got registered"
        );
    }

    @Transactional(readOnly = true)
    public UserBalanceResponse getUserById(Long userId){
        User user = userRepository.findById(userId).orElseThrow();

        return new UserBalanceResponse(
                user.getId(),
                user.getUsername(),
                user.getMoney()
        );
    }

    @Transactional
    public UserBalanceResponse addMoney(Long userId, long amount) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setMoney(user.getMoney() + amount);

        return new UserBalanceResponse(
                user.getId(),
                user.getUsername(),
                user.getMoney()
        );
    }

    @Transactional
    public UserActionResponse deleteUserById(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException());
        userRepository.delete(user);

        return new UserActionResponse(
                user.getId(),
                user.getUsername(),
                "Successfully deleted"
        );
    }

    private final Map<Long, Deque<Long>> userClicks = new HashMap<>();
    private static final int MAX_CPS = 15;
    private static final long ONE_SECOND_NANOS = 1_000_000_000L;


    @Transactional
    public UserActionResponse click(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException());

        Deque<Long> timestamps = userClicks.computeIfAbsent(
                userId,
                key -> new ArrayDeque<>()
        );

        synchronized (timestamps) {

            long now = System.nanoTime();

            while (!timestamps.isEmpty()
                    && now - timestamps.peekFirst() >= ONE_SECOND_NANOS) {
                timestamps.removeFirst();
            }

            if (timestamps.size() >= MAX_CPS) {
                throw new ResponseStatusException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        "Maximum of 15 clicks per second exceeded"
                );
            }

            timestamps.addLast(now);
            user.setClicks((int) (user.getClicks() + 1));
        }

        return new UserActionResponse(
                user.getId(),
                user.getUsername(),
                "Click registered"
        );
    }

     public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username()).orElseThrow(() -> new InvalidCredentialsException());

        if (!passwordEncoder.matches(request.password(), user.getHashedPassword())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(user.getId());

        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                token,
                "Bearer"
        );
    }

    @Transactional
    public SelectedCatResponse selectClickableCat(Long userId, Long skinId){
        if(!userCatSkinRepository.existsByUserIdAndCatSkinId(userId, skinId)){
            throw new NoSuchElementException("You do not have this skin");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
        CatSkin choseSkin = catSkinRepository.findById(skinId).orElseThrow(() -> new NoSuchElementException("Skin not found"));

        user.setSelectedSkin(choseSkin);

        return new SelectedCatResponse("Cat skin selected successfully", choseSkin.getId());
    }

    public Map<String, String> getCurrentUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));

        return Map.of("username", user.getUsername());
    }
}
