package com.classteam.skopjetourismguide.repository;

import com.classteam.skopjetourismguide.model.User;
import com.classteam.skopjetourismguide.model.enumerations.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository< User,Long> {
    Optional <User> findByUsername(String username);
    Optional<User> findByUsernameAndPassword(String username, String password);
    Optional <User> findByEmail(String email);
    List<User> findByRole(Role role);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

}
