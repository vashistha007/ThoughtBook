package org.application.blog.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp) {
        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            System.out.println("BREVO_API_KEY missing - OTP for " + toEmail + " : " + otp);
            return;
        }

        String url = "https://api.brevo.com/v3/smtp/email";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);

        Map<String, Object> body = Map.of(
                "sender", Map.of("name", "ThoughtBook", "email", fromEmail),
                "to", List.of(Map.of("email", toEmail)),
                "subject", "ThoughtBook - Password Reset OTP",
                "textContent", "Hello,\n\nYour 6-digit OTP to reset your ThoughtBook password is: " + otp + "\n\nThis OTP is valid for 10 minutes.\n\nRegards,\nTeam ThoughtBook"
        );

        var entity = new HttpEntity<>(body, headers);
        restTemplate.postForEntity(url, entity, String.class);
    }
}