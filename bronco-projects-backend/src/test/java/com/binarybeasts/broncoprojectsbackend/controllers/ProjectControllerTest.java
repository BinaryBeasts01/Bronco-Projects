package com.binarybeasts.broncoprojectsbackend.controllers;

import com.binarybeasts.broncoprojectsbackend.dtos.ProjectCreateDTO;
import com.binarybeasts.broncoprojectsbackend.dtos.ProjectFilterDTO;
import com.binarybeasts.broncoprojectsbackend.entities.Project;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@WithUserDetails("gkhughes@cpp.edu")
public class ProjectControllerTest {
    @Autowired
    private ProjectController controller;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void contextLoads() {
        assertNotNull(controller);
    }

    //create 10 projects, should fail if already exists
    /*@Test
    public void testCreate() throws Exception {
        System.out.println("\n\nCreate Test\n");
        ObjectMapper mapper = new ObjectMapper();

        for(int i = 0; i < 10; ++i) {
            ArrayList<String> tags = new ArrayList<>();
            tags.add("test");
            tags.add("project");
            tags.add(Integer.toString(i % 2));

            ProjectCreateDTO createDTO = new ProjectCreateDTO();
            createDTO.setName("Test Project " + new Random().nextLong());
            createDTO.setDescription("This is a test project");
            createDTO.setDepartment("Department of Testing");
            createDTO.setTags(tags);

            MvcResult res = this.mockMvc.perform(MockMvcRequestBuilders.post("/api/projects/create")
                    .content(mapper.writeValueAsString(createDTO))
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andReturn();

            System.out.println(res.getResponse().getStatus());
        }

        System.out.println("\n");
    }*/

    //return projects matching filters, may not return all as default pageable limits to 10
    @Test
    public void testGetByTags() throws Exception {
        System.out.println("\n\nTags Test\n");
        ObjectMapper mapper = new ObjectMapper();
        ArrayList<String> tags = new ArrayList<>();

        tags.add("tag1");
        tags.add("test");

        ProjectFilterDTO filterDTO = new ProjectFilterDTO();
        //filterDTO.setCreatedBy("Mr. Test");
        filterDTO.setTags(tags);

        MvcResult res = this.mockMvc.perform(MockMvcRequestBuilders.get("/api/projects/tags")
                .content(mapper.writeValueAsString(filterDTO))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andReturn();

        List<Project> projects = new ObjectMapper().readValue(res.getResponse().getContentAsString(),  new TypeReference<List<Project>>() {});
        for(Project p : projects) System.out.println(p);
        System.out.println("\n");
    }

    //returns empty list right now as user's don't have departments/projects have one set test department in testCreate()
    @Test
    public void testGetRecentWithUser() throws Exception {
        System.out.println("\n\nRecent Test With User\n");

        MvcResult res = this.mockMvc.perform(MockMvcRequestBuilders.get("/api/projects/latest_projects")
                .accept(MediaType.APPLICATION_JSON))
                .andReturn();

        List<Project> projects = new ObjectMapper().readValue(res.getResponse().getContentAsString(),  new TypeReference<List<Project>>() {});
        for(Project p : projects) System.out.println(p);
        System.out.println("\n");
    }

    //couldn't figure out how to allow test with user that doesn't exist, so made throwaway function in controller to test call to mongo when no authenticated user
    @Test
    public void testGetRecentWithoutUser() throws Exception {
        System.out.println("\n\nRecent Test Without User\n");

        MvcResult res = this.mockMvc.perform(MockMvcRequestBuilders.get("/api/projects/top")
                .accept(MediaType.APPLICATION_JSON))
                .andReturn();

        List<Project> projects = new ObjectMapper().readValue(res.getResponse().getContentAsString(),  new TypeReference<List<Project>>() {});
        for(Project p : projects) System.out.println(p);
        System.out.println("\n");
    }
}
