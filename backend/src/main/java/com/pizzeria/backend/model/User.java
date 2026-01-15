package com.pizzeria.backend.model;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "app_users") // "users" suele ser palabra reservada en SQL
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
// UserDetails es parte de Spring Security para manejar autenticación y autorización
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    // Relación Many-to-Many con Business a través de la tabla de roles
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<UserBusinessRole> roles;

    // --- MÉTODOS DE USER DETAILS ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Aquí convertimos tus roles a "Autoridades" que Spring entienda.
        // Por ahora, tomamos el primer rol como ejemplo, luego lo haremos más complejo.
        if (roles == null || roles.isEmpty()) return List.of();
        return List.of(new SimpleGrantedAuthority("ROLE_" + roles.get(0).getRole().name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}