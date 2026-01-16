package com.pizzeria.backend.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pizzeria.backend.config.JwtService;
import com.pizzeria.backend.dto.auth.AuthenticationResponse;
import com.pizzeria.backend.dto.auth.LoginRequest;
import com.pizzeria.backend.dto.auth.RegisterRequest;
import com.pizzeria.backend.model.User;
import com.pizzeria.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager; // El manager de Spring Security
    final PasswordEncoder passwordEncoder;

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

    public AuthenticationResponse register(RegisterRequest request) {
        // 1. Validar si existe usando isPresent()
        if (userRepository.findByEmail(request.email()).isPresent()) {
            // Esto devolverá un error 500 por defecto, luego podemos manejarlo mejor
            throw new IllegalArgumentException("El email ya está registrado");
        }

        // 2. Crear el Usuario
        var user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();
        
        
        // 3. Guardar en BD
        userRepository.save(user);
        // 4. Generar Token
        var jwtToken = jwtService.generateToken(user);
        
        // 5. Devolver Token
        return new AuthenticationResponse(jwtToken);
    }
}
