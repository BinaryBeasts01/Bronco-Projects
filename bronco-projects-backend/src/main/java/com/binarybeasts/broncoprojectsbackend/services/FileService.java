package com.binarybeasts.broncoprojectsbackend.services;

import com.binarybeasts.broncoprojectsbackend.dtos.FileDTO;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@Service
public class FileService {
    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private GridFsOperations operations;

    public String addPdf(MultipartFile file) throws IOException {
        DBObject metaData = new BasicDBObject();
        metaData.put("fileSize", file.getSize());
        ObjectId id = gridFsTemplate.store(
                file.getInputStream(), file.getName(), file.getContentType(), metaData);
        return id.toString();
    }

    public FileDTO getPdf(String id) throws IllegalStateException, IOException {
        GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
        FileDTO pdf = new FileDTO();

        pdf.setName(file.getFilename());
        pdf.setType(file.getMetadata().get("_contentType").toString());
        pdf.setSize(file.getMetadata().get("fileSize").toString());
        pdf.setFile(operations.getResource(file).getInputStream().readAllBytes());

        return pdf;
    }

    public String addPhoto(MultipartFile file) throws IOException {
        DBObject metaData = new BasicDBObject();
        metaData.put("fileSize", file.getSize());
        ObjectId id = gridFsTemplate.store(
                new ByteArrayInputStream(Base64.getEncoder().encode(file.getBytes())), file.getName(), file.getContentType(), metaData);
        return id.toString();
    }

    public FileDTO getPhoto(String id) throws IllegalStateException, IOException {
        GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
        FileDTO photo = new FileDTO();

        photo.setName(file.getFilename());
        photo.setType(file.getMetadata().get("_contentType").toString());
        photo.setSize(file.getMetadata().get("fileSize").toString());
        photo.setFile(operations.getResource(file).getInputStream().readAllBytes());

        return photo;
    }
}
