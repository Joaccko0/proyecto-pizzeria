package com.pizzeria.backend.dto.order;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = OrderItemXorValidator.class)
public @interface OrderItemXor {
    String message() default "El item debe tener exactamente un productId O comboId, no ambos ni ninguno";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

class OrderItemXorValidator implements ConstraintValidator<OrderItemXor, OrderItemRequest> {
    @Override
    public boolean isValid(OrderItemRequest value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        
        boolean hasProduct = value.productId() != null;
        boolean hasCombo = value.comboId() != null;
        
        // XOR: exactamente uno debe ser true
        return hasProduct ^ hasCombo;
    }
}
