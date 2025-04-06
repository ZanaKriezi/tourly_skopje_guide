package com.classteam.skopjetourismguide.service;

import com.classteam.skopjetourismguide.dto.RegisterRequest;
import com.classteam.skopjetourismguide.model.User;
import com.classteam.skopjetourismguide.model.enumerations.Gender;
import com.classteam.skopjetourismguide.model.enumerations.Role;
import com.classteam.skopjetourismguide.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User registerUser(RegisterRequest request) {
        // Check if username is taken
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        // Check if email is taken
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        // Create new user
        User user = new User();
        user.getId();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setAge(request.getAge());

        // Set gender if provided
        if (request.getGender() != null) {
            try {
                user.setGender(Gender.valueOf(request.getGender().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Default to OTHER if invalid gender is provided
                user.setGender(Gender.OTHER);
            }
        }

        // Set default role to USER
        user.setRole(Role.ROLE_USER);

        return userRepository.save(user);
    }
}