package com.pizzeria.backend.config;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/*
Se ejecuta en cada request
Lee el header Authorization
Extrae el JWT
Valida el token
Carga el usuario
Marca al usuario como autenticado
*/

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService; // Interfaz de Spring para buscar usuarios

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // 1. Chequeo básico: ¿Tiene el token?
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // Si no tiene, que siga (luego rebotará si la ruta es privada)
            return;
        }
        try {
            // 2. Extraer token
            String jwt = authHeader.substring(7);
            String userEmail = jwtService.extractUsername(jwt);

            // 3. Si hay email y no está autenticado aún en el contexto
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // Buscar usuario en BD
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // Validar token
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // Crear objeto de autenticación
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // MARCAR AL USUARIO COMO AUTENTICADO
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Log the error but don't block the request - let Spring Security handle it
            logger.error("Cannot set user authentication: {}", e);
        }
        // Continuar la cadena
        filterChain.doFilter(request, response);
    }
}
