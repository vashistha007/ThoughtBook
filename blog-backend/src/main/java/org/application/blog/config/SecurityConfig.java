package org.application.blog.config;

import org.application.blog.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Controllers par @PreAuthorize("hasRole('ADMIN')") jaise annotations enable karne ke liye
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // 1. Password Encoder Bean (Passwords ko BCrypt se hash karne ke liye)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. AuthenticationManager Bean (Login ke waqt username/password verify karne ke liye)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // 3. Main Security Rules (Filter Chain)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                // REST APIs stateless hoti hain aur cookies use nahi karti, isliye CSRF disable karte hain
                .csrf(AbstractHttpConfigurer::disable)

                // URL Authorization Rules
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Register aur Login endpoints sabke liye open rahenge
                        .requestMatchers("/api/auth/**",
                                                  "/v3/api-docs/**",
                                                   "/swagger-ui/**",
                                                   "/swagger-ui.html",
                                                   "/error"
                                              ).permitAll()

                        // Saare GET requests (Posts aur Comments padhna) public rahenge
                        .requestMatchers(HttpMethod.GET, "/api/posts/**", "/api/health","/api/categories/**").permitAll()

                        // Baaki koi bhi request (POST, PUT, DELETE) bina valid JWT token ke allowed nahi hogi
                        .anyRequest().authenticated()
                )

                // Server par koi session store nahi hoga (Pure Stateless JWT Architecture)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        // Hamara custom JwtAuthenticationFilter Spring ke default username-password filter se PEHLE chalega
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource(
            @org.springframework.beans.factory.annotation.Value("${FRONTEND_URL:http://localhost:5173}") String frontendUrl) {
        var config = new org.springframework.web.cors.CorsConfiguration();
        config.setAllowedOrigins(java.util.List.of("http://localhost:5173", frontendUrl));
        config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(java.util.List.of("*"));
        config.setAllowCredentials(true);
        var source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}