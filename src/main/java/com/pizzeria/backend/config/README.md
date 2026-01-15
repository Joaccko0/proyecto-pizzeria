## 🔐 ¿Qué es JWT?

JWT (JSON Web Token) es un formato de token que se usa para autenticación y autorización en aplicaciones modernas, especialmente APIs REST.

## 🧱 ¿Cómo está compuesto un JWT?

Un JWT tiene 3 partes, separadas por puntos:

### 1️⃣ Header

Describe cómo está firmado el token.
{
  "alg": "HS256",
  "typ": "JWT"
}

### 2️⃣ Payload (claims)

Contiene los datos del usuario (claims).
{
  "sub": "joaquin",
  "role": "ADMIN",
  "businessId": 42,
  "iat": 1710000000,
  "exp": 1710003600
}
📌 Esto NO está cifrado, solo codificado en Base64.

### 3️⃣ Signature

*Garantiza que:*
+ el token no fue modificado
+ fue creado por el servidor
*Se genera con:*
+ los datos anteriores
+ una clave secreta (o clave pública/privada)

## 🔄 Flujo típico de JWT

1️⃣ Usuario hace login (email + password)
2️⃣ Backend valida credenciales
3️⃣ Backend genera un JWT
4️⃣ Cliente guarda el token
5️⃣ Cliente lo envía en cada request:
Authorization: Bearer <token>
6️⃣ Backend valida el token y sus permisos

## ¿Qué es un claim?

Un claim es un dato dentro del token.

Tipos:
+ Standard: sub, exp, iat
+ Custom: role, businessId

## 🔐 Autenticación vs Autorización

Autenticación:
“¿Quién sos?” → sub

Autorización:
“¿Qué podés hacer?” → role, permisos

## 🧠 Resumen final

*JWT es:*
+ un token firmado
+ con datos del usuario
+ que el cliente envía en cada request
+ para autenticar y autorizar
+ sin estado en el servidor