package com.binarybeasts.broncoprojectsbackend.repositories;

import com.binarybeasts.broncoprojectsbackend.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
}
