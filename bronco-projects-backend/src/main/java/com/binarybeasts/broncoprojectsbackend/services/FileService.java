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
import java.io.IOException;

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
}
