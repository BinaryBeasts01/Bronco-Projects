package com.binarybeasts.broncoprojectsbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.google.common.base.Preconditions;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

@SpringBootApplication
public class BroncoProjectsBackendApplication {
    public static void main(String[] args) {
        Preconditions.checkNotNull("A", "String must not be null!");
        SpringApplication.run(BroncoProjectsBackendApplication.class, args);
        
        //Jsoup demo
        Document doc = Jsoup.connect("https://en.wikipedia.org/").get();
        System.out.println(doc.title());
        Elements newsHeadlines = doc.select("#mp-itn b a");
        for (Element headline : newsHeadlines) {
            System.out.println("%s\n\t%s", headline.attr("title"), headline.absUrl("href"));
        }
    
    }
}
