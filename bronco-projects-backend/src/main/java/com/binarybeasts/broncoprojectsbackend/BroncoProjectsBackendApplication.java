package com.binarybeasts.broncoprojectsbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;



@SpringBootApplication
public class BroncoProjectsBackendApplication {
    public static void main(String[] args)  throws IOException {
        Preconditions.checkNotNull("A", "String must not be null!");
        SpringApplication.run(BroncoProjectsBackendApplication.class, args);
        
        //Jsoup demo
        Document doc = Jsoup.connect("https://en.wikipedia.org/").get();
        System.out.println(doc.title());
        Elements newsHeadlines = doc.select("#mp-itn b a");
        for (Element headline : newsHeadlines) {
            System.out.println(headline.attr("title") + ", " + headline.absUrl("href"));
        }
    
    }
}
