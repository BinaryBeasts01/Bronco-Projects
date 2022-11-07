package com.binarybeasts.broncoprojectsbackend.dtos;

import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class ProjectFilterDTO {
    private String createdBy;
    private Date before;
    private Date after;
    private Date on;
    private List<String> tags;
}
