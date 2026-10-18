---
title: 'Dominio y correo propio para pymes: que el dominio sea tuyo y tus mails lleguen'
description: 'Guía práctica para pymes: por qué conviene un dominio propio y correo profesional, cómo asegurar que el dominio esté a nombre de la empresa, DNS básico, SPF/DKIM/DMARC y errores comunes.'
pubDate: '2026-10-15'
heroImage: '/blog/dominio-y-correo-propio-para-pymes.png'
author: 'Juan Beresiarte'
tags:
  - 'Software'
readingTime: 6
featured: false
---
Tu cliente te escribe a `juan@gmail.com` y vos respondés desde ahí. Funciona, hasta que deja de funcionar: un proveedor se va con la cuenta del dominio, un ex-empleado era el único con la contraseña del registrador, o tus presupuestos caen directo en spam. El problema casi nunca es “no tener web”. Es no ser dueño de la identidad digital del negocio.

Un dominio propio y un correo profesional no son un lujo de empresa grande. Son la dirección de tu empresa en internet: el lugar donde te encuentran, te escriben y deciden si sos confiable. Acá va una guía práctica para que el dominio sea tuyo de verdad y tus mails lleguen.

## 1. Por qué @tudominio.com no es lo mismo que @gmail.com

El correo gratuito sirve para arrancar. Para una pyme que factura, cotiza y firma contratos, manda otro mensaje:

- **Confianza.** `ventas@tuempresa.com` se lee como empresa. `tuempresa.ventas99@gmail.com` se lee como improvisación.
- **Continuidad.** Si alguien se va, la casilla de la empresa se queda. La casilla personal, no.
- **Marca.** El dominio aparece en el sitio, en facturas, en firmas y en Google. Es el nombre que controlás.

No hace falta un servidor de correo en la oficina. La mayoría usa un proveedor profesional atado al dominio. Lo importante no es la marca del proveedor: es que **el dominio esté a tu nombre** y que puedas cambiar de proveedor si hace falta.

## 2. El dominio tiene que ser de la empresa, no de “el que lo registró”

Este es el error caro que más veo: el dominio lo registró el diseñador, el primo que “sabía de computadoras”, o un empleado que ya no está. Mientras todo anda, nadie se entera. El día que hay que renovar, migrar o recuperar el acceso, descubrís que la cuenta del registrador no es tuya.

Checklist de propiedad:

- [ ] La cuenta del registrador (donde se paga el dominio) está a nombre de la empresa o de un socio, no de un proveedor externo
- [ ] Más de una persona tiene acceso (o las credenciales están en un gestor de contraseñas compartido de la empresa)
- [ ] El correo de contacto del registrador es uno de la empresa, no el Gmail personal de alguien
- [ ] Sabés la fecha de vencimiento y tenés renovación automática activada
- [ ] Tenés facturas o comprobantes que demuestran que pagás vos el dominio

Si el dominio “vive” en la cuenta de un tercero, transferilo. Es aburrido y vale más que cualquier rediseño.

## 3. Renovación: el dominio que se vence es el dominio que perdés

Los dominios no son eternos: se renuevan cada año (a veces más). Si se vence y nadie lo nota, primero entra en un período de gracia, después en una etapa de recuperación cara, y al final queda disponible para cualquiera, incluido un competidor o alguien que lo compra para revenderlo.

Prácticas mínimas:

1. Activá la **renovación automática** en el registrador
2. Poné un recordatorio en el calendario 30 días antes del vencimiento (por si falla el pago)
3. Usá una tarjeta o medio de pago que no expire sin que nadie se entere
4. Revisá una vez al año quiénes tienen acceso a esa cuenta

Renovar un `.com` o `.com.ar` cuesta poco frente a recuperar un dominio perdido. No es el lugar para ahorrar atención.

## 4. DNS en criollo: A, CNAME y MX

El DNS es la libreta de direcciones de internet. Tu dominio no “es” el sitio ni el correo: apunta a ellos mediante registros. Los tres que más te importan:

- **A:** dice “este nombre (por ejemplo `tudominio.com` o `www`) vive en esta dirección IP”. Es lo típico para el sitio web.
- **CNAME:** dice “este nombre es un alias de otro nombre”. Útil para `www` apuntando al mismo lugar que el dominio raíz, o para servicios de terceros.
- **MX:** dice “el correo de este dominio lo atiende este servidor”. Sin MX correctos, el mail no llega (o llega al lugar equivocado).

No necesitás memorizar la RFC. Lo que necesitás es saber **quién administra el DNS** (a veces el registrador, a veces el hosting) y poder entrar a ese panel. Si no podés entrar, no controlás el dominio.

Al cambiar hosting o correo, casi siempre vas a tocar estos registros. Pedile al proveedor nuevo la lista exacta y cambialos de a uno, con calma. Un MX mal puesto deja a la empresa sin correo en minutos.

## 5. SPF, DKIM y DMARC: por qué tus mails van a spam

Acá está el misterio que más frustra: “tengo dominio propio y igual caigo en spam”. Suele faltar la autenticación del correo. En simple:

- **SPF:** una lista pública de quiénes pueden enviar mail en nombre de tu dominio.
- **DKIM:** una firma criptográfica que el servidor agrega a cada mensaje para probar que no fue alterado.
- **DMARC:** la política que dice qué hacer si SPF o DKIM fallan, y (opcionalmente) te manda reportes.

Sin estos registros, los filtros de Gmail, Outlook y compañía tratan tu dominio como sospechoso. No es castigo personal: es higiene básica de internet.

Ejemplos genéricos (reemplazá `example.com` y los valores por los que te dé tu proveedor de correo):

```text
; SPF — TXT en example.com
v=spf1 include:_spf.ejemplo-proveedor.com ~all

; DKIM — TXT en selector._domainkey.example.com
v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...clave-publica...

; DMARC — TXT en _dmarc.example.com
v=DMARC1; p=none; rua=mailto:dmarc@example.com
```

Empezá con `p=none` en DMARC para observar; cuando estés seguro de que todo tu correo legítimo está autenticado, endurecé a `quarantine` o `reject`. Tu proveedor casi siempre te da los valores exactos: copialos, no los inventes.

## 6. Casillas personales, aliases y qué pasa cuando alguien se va

No organices el correo solo alrededor de personas. Organizalo alrededor de **roles**:

- `info@`, `ventas@`, `soporte@`, `facturacion@` — aliases o casillas compartidas que sobreviven al alta y baja de gente
- `nombre.apellido@` — casillas personales para el día a día

Cuando alguien se va:

1. Revocá el acceso el mismo día (contraseña, 2FA, dispositivos)
2. Redirigí o compartí la casilla el tiempo necesario
3. Sacá esa persona de la cuenta del registrador, del DNS y del panel de correo
4. Revisá firmas, listas de distribución y reenvíos automáticos

El offboarding de correo importa tanto como devolver la notebook. Si el acceso sigue vivo, el dominio “es tuyo” solo en el papel.

## 7. Checklist rápido (una tarde alcanza)

- [ ] Dominio registrado a nombre/cuenta de la empresa
- [ ] Acceso al registrador documentado y compartido con más de una persona
- [ ] Renovación automática ON + recordatorio 30 días antes
- [ ] Sabés dónde se edita el DNS
- [ ] Registros A/CNAME apuntan al sitio correcto
- [ ] MX apuntan al proveedor de correo actual
- [ ] SPF, DKIM y DMARC publicados según el proveedor
- [ ] Casillas de rol (`info@`, `ventas@`, etc.) además de las personales
- [ ] Procedimiento de baja: revocar acceso + redirigir mail

## 8. Errores comunes

- **Dejar el dominio en la cuenta del proveedor web “porque ellos lo manejan”.** Ellos pueden ayudar; la propiedad tiene que ser tuya.
- **Un solo humano con todas las claves.** Vacaciones, renuncia o un celular perdido se convierten en incidente.
- **Comprar el dominio y nunca configurar SPF/DKIM/DMARC.** El dominio bonito no sirve si el mail no llega.
- **Usar solo casillas personales.** El día que se va “el de ventas”, se va la memoria del cliente.
- **Cambiar hosting y olvidarse del MX.** El sitio nuevo anda; el correo muere en silencio.
- **Desactivar la renovación automática “para controlar el gasto”.** Controlás el gasto; perdés el dominio.

## El cierre

Dominio y correo propio no son marketing: son infraestructura chica con consecuencias grandes. Si hoy dependés de un Gmail personal, un registrador ajeno o un DNS que nadie sabe tocar, no hace falta un rediseño: hace falta ordenar propiedad, renovación y autenticación.

Si querés una segunda mirada sobre dominio y correo, en CROBF vemos estos temas seguido con pymes que prefieren claridad antes de que duela. El mejor momento es un martes tranquilo — no el viernes en que el dominio venció.
