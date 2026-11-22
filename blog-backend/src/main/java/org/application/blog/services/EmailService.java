package org.application.blog.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("ThoughtBook - Password Reset OTP");
        message.setText(
                "Hello,\n\n" +
                        "Your 6-digit OTP to reset your ThoughtBook password is: " + otp + "\n\n" +
                        "This OTP is valid for 10 minutes. Do not share it with anyone.\n\n" +
                        "Regards,\nTeam ThoughtBook"
        );

        mailSender.send(message);
    }
}
