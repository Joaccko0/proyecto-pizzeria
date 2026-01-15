package com.pizzeria.backend.config;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/*
Genera tokens JWT

Extrae claims

Valida tokens
*/

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String SECRET_KEY;
    
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    // Extraer el username (email) del token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Generar token CON claims extra (Aquí meteremos el BusinessID luego)
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Generar token SIN claims extra
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(extraClaims) // Sintaxis actualizada
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration)) 
                .signWith(getSignInKey(), Jwts.SIG.HS256) // Sintaxis actualizada: Jwts.SIG
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser() // parserBuilder() cambió a parser() en v0.12+
                .verifyWith(getSignInKey()) // setSigningKey() cambió a verifyWith()
                .build()
                .parseSignedClaims(token) // parseClaimsJws cambió a parseSignedClaims
                .getPayload(); // getBody() cambió a getPayload()
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
