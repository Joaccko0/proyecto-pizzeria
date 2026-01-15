package com.pizzeria.backend.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.pizzeria.backend.config.JwtService;
import com.pizzeria.backend.dto.auth.AuthenticationResponse;
import com.pizzeria.backend.dto.auth.LoginRequest;
import com.pizzeria.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager; // El manager de Spring Security

    public AuthenticationResponse login(LoginRequest request) {
        // 1. Este método hace la magia: valida email y password (encriptado).
        // Si la contraseña está mal, lanza una excepción automáticamente.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        // 2. Si pasó el paso 1, el usuario es correcto. Lo buscamos.
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // 3. Generamos el token
        var jwtToken = jwtService.generateToken(user);

        return new AuthenticationResponse(jwtToken);
    }
}
