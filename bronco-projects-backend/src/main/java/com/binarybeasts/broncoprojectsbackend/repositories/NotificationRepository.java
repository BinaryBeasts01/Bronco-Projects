package com.binarybeasts.broncoprojectsbackend.repositories;

import com.binarybeasts.broncoprojectsbackend.entities.Notification;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Collection;
import java.util.List;

public interface NotificationRepository  extends MongoRepository<Notification, String> {
    List<Notification> findAllByUuidIn(Collection<String> uuids, Sort sort);
}
