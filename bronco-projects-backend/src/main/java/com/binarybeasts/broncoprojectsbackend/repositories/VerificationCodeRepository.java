package com.binarybeasts.broncoprojectsbackend.repositories;

import com.binarybeasts.broncoprojectsbackend.entities.VerificationCode;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface VerificationCodeRepository extends MongoRepository<VerificationCode, String> {

}
