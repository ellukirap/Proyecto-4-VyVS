# language: es
@login
Característica: Inicio de sesión en la Obra Social de los Trabajadores de Hogwarts
  Como afiliado de la Obra Social
  Quiero iniciar sesión con mi correo electrónico y mi contraseña
  Para acceder a los servicios de la Obra Social

  Reglas de la especificación:
  - Ambos campos son obligatorios.
  - El correo debe tener un formato válido.
  - El único usuario registrado es ron@hogwarts.com / hermione2025.
  - Tras tres intentos seguidos con el correo correcto y la contraseña incorrecta,
    se advierte que al próximo intento erróneo la cuenta será bloqueada.

  Antecedentes:
    Dado que estoy en la página de inicio de sesión

  # ---------------------------------------------------------------------------
  # Ingreso exitoso
  # ---------------------------------------------------------------------------
  @exitoso
  Escenario: LOG-05 Correo registrado y contraseña válida
    Cuando ingreso el correo "ron@hogwarts.com" y la contraseña "hermione2025"
    Y presiono el botón Ingresar
    Entonces accedo a la página de bienvenida de la Obra Social

  # ---------------------------------------------------------------------------
  # Algún campo obligatorio vacío: siempre el mismo mensaje
  # ---------------------------------------------------------------------------
  @campos-vacios
  Esquema del escenario: <caso> - <descripcion>
    Cuando ingreso el correo "<correo>" y la contraseña "<contrasena>"
    Y presiono el botón Ingresar
    Entonces veo el mensaje de error "<mensaje>"
    Y sigo en la página de inicio de sesión

    Ejemplos:
      | caso   | descripcion                                    | correo           | contrasena   | mensaje                           |
      | LOG-01 | Correo vacío y contraseña vacía                |                  |              | Por favor, completa ambos campos. |
      | LOG-02 | Correo vacío y contraseña válida               |                  | hermione2025 | Por favor, completa ambos campos. |
      | LOG-03 | Correo vacío y contraseña inválida             |                  | 123          | Por favor, completa ambos campos. |
      | LOG-04 | Correo registrado y contraseña vacía           | ron@hogwarts.com |              | Por favor, completa ambos campos. |
      | LOG-07 | Correo válido no registrado y contraseña vacía | vyvs@mail.com    |              | Por favor, completa ambos campos. |
      | LOG-10 | Correo con formato inválido y contraseña vacía | harry.com        |              | Por favor, completa ambos campos. |

  # ---------------------------------------------------------------------------
  # Correo con formato inválido (ambos campos completos)
  # ---------------------------------------------------------------------------
  @correo-invalido
  Esquema del escenario: <caso> - <descripcion>
    Cuando ingreso el correo "<correo>" y la contraseña "<contrasena>"
    Y presiono el botón Ingresar
    Entonces veo el mensaje de error "<mensaje>"
    Y sigo en la página de inicio de sesión

    Ejemplos:
      | caso   | descripcion                                       | correo    | contrasena   | mensaje                                          |
      | LOG-11 | Correo con formato inválido y contraseña válida   | harry.com | hermione2025 | Por favor, ingrese un correo electrónico válido. |
      | LOG-12 | Correo con formato inválido y contraseña inválida | harry.com | 123          | Por favor, ingrese un correo electrónico válido. |

  # ---------------------------------------------------------------------------
  # Credenciales incorrectas: acceso no autorizado
  # ---------------------------------------------------------------------------
  @credenciales-incorrectas
  Esquema del escenario: <caso> - <descripcion>
    Cuando ingreso el correo "<correo>" y la contraseña "<contrasena>"
    Y presiono el botón Ingresar
    Entonces veo el mensaje de error "<mensaje>"
    Y sigo en la página de inicio de sesión

    Ejemplos:
      | caso   | descripcion                                       | correo           | contrasena   | mensaje                                             |
      | LOG-06 | Correo registrado y contraseña inválida           | ron@hogwarts.com | 123          | Usuario correcto, pero la contraseña es incorrecta. |
      | LOG-08 | Correo válido no registrado y contraseña válida   | vyvs@mail.com    | hermione2025 | El usuario no es correcto.                          |
      | LOG-09 | Correo válido no registrado y contraseña inválida | vyvs@mail.com    | 123          | El usuario no es correcto.                          |

  # ---------------------------------------------------------------------------
  # Aviso de bloqueo de cuenta
  # Según la especificación, el aviso debe aparecer al tercer intento fallido.
  # ---------------------------------------------------------------------------
  @bloqueo
  Escenario: LOG-13 Aviso de bloqueo tras 3 intentos fallidos con el correo registrado
    Cuando intento ingresar 3 veces seguidas con el correo "ron@hogwarts.com" y la contraseña "123"
    Entonces veo el mensaje de error "Usuario correcto, pero la contraseña es incorrecta."
    Y veo la advertencia "Atención, su cuenta está a punto de ser bloqueada."
    Y sigo en la página de inicio de sesión
