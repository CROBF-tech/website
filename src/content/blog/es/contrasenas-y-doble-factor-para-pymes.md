---
title: 'Contraseñas y doble factor para pymes: lo mínimo para que un acceso robado no te deje afuera'
description: 'Un gestor de contraseñas para el equipo, doble factor en las cuentas que importan y un plan para las bajas de personal: cambios chicos que evitan que un acceso robado deje a tu pyme fuera de juego.'
pubDate: '2026-10-20'
heroImage: '/blog/contrasenas-y-doble-factor-para-pymes.png'
author: 'Juan Beresiarte'
tags:
  - 'Software'
readingTime: 8
featured: false
---
Trabajo con pymes, y el tema seguridad casi siempre arranca igual: "somos chicos, nadie nos va a atacar". Entiendo la lógica, pero el problema casi nunca es que alguien los haya elegido: es una contraseña floja, repetida durante años, que otra persona terminó usando. Evitarlo no exige saber de sistemas; exige orden en dos o tres lugares.

## 1. El problema casi nunca es un hacker genio

Cuando una pyme queda afuera de sus propias cuentas, la explicación suele ser aburrida:

- **Contraseñas reutilizadas.** La misma clave en el correo, el banco y un servicio que tuvo una filtración. Reutilizás por comodidad, y una filtración ajena se vuelve tu problema.
- **Contraseñas compartidas por chat.** La clave de las redes rotando por WhatsApp entre tres personas. Cada envío deja copias en chats que nadie borra; cuando alguien se va, se lleva la clave, o la deja para siempre.
- **Contraseñas anotadas a mano.** Anotarlas no es el problema; el lugar sí: el cuaderno del mostrador o el archivo "claves.xls" en la carpeta compartida.

Quien entra en cuentas ajenas casi nunca adivina: prueba claves que ya circularon en filtraciones, porque la gente las repite. Eso se llama relleno de credenciales, y es de los ataques más comunes. Sin repetición y con segundo factor en lo importante, ese ataque deja de funcionar. No te vuelve intocable (más abajo cuento qué puede saltarse un código), pero te saca del montón de blancos fáciles.

## 2. Un gestor de contraseñas para el equipo

Un gestor es una bóveda: cada persona entra con su clave maestra y desde ahí usa las contraseñas de trabajo. Bitwarden y 1Password son los más conocidos; cualquiera similar sirve para arrancar. La marca importa menos que la organización:

- **Bóveda personal por persona.** Su clave maestra es privada; nadie más debe conocerla.
- **Bóveda compartida por área.** Facturación, redes, operación: lo que comparte el equipo va ahí, no en chats.
- **Pocas manos administrando.** Uno o dos con permisos de invitar, dar de baja y crear bóvedas.

¿Qué guardar? Contraseñas, y también lo de esa planilla suelta: notas por servicio (titular, contacto), respuestas de preguntas de seguridad, códigos de recuperación de los demás servicios. Los del propio gestor son la excepción: esos van afuera, impresos o en otro lugar seguro, porque si perdés el acceso al gestor no vas a poder abrirlo para buscarlos. Y una regla que cambia la cultura: lo de la bóveda no se manda por chat; existe para no mandar nada.

## 3. Doble factor: dónde activarlo primero

El doble factor suma a "algo que sabés" (la contraseña) un "algo que tenés": un código temporal en tu teléfono o una llave física. La contraseña robada, sola, deja de alcanzar.

Dónde activarlo, en orden:

1. **El correo del dominio.** Quien controla tu casilla resetea las demás con el "olvidé mi contraseña". Primero, sin discusión.
2. **Banco y facturación.** Todo lo que mueve plata directo.
3. **Dominio y hosting.** Quien toma el dominio tiene tu sitio y, de paso, tu correo; recuperarlo es engorroso.
4. **Redes sociales y pauta.** Recuperar una red robada es lento y a veces imposible: mejor que no entre nadie.
5. **El gestor de contraseñas.** Si su clave maestra va a ser la única barrera, sumale el factor.

**¿App autenticadora o SMS?** Una app autenticadora (Google Authenticator, Microsoft Authenticator y otras) genera el código en tu teléfono. El SMS depende de que el número siga siendo tuyo, y ahí está su punto débil. El riesgo principal es el SIM swapping: alguien convence a la operadora de pasar tu número a otro chip y desde ese momento recibe tus códigos. Además, si la línea se cancela o se reasigna, el código puede acabar en el teléfono de otra persona. Donde se pueda, app; SMS solo si no queda otra.

**Lo que el doble factor frena, y lo que no.** Frena muy bien el relleno de credenciales: con la clave filtrada sola no alcanza. Pero un código de app se puede saltar. En el phishing en tiempo real, una página falsa te pide la contraseña y el código y los usa al instante en el sitio verdadero. En la fatiga de notificaciones, te llenan el teléfono de pedidos de "¿sos vos?" hasta que alguien toca "aprobar" para que paren. La defensa es costumbre: nunca cargar el código desde un link que llegó por mail o chat, y nunca aprobar un inicio de sesión que no hiciste vos. Lo que mejor resiste el phishing son las llaves físicas y las passkeys, porque solo responden ante el sitio real.

**Llaves físicas.** Para los accesos más críticos (el administrador del correo, el dueño del gestor) existe la llave física: un dispositivo chico que conectás por USB o, si tiene NFC, apoyás contra el teléfono al iniciar sesión. Las passkeys, que cada vez más servicios ofrecen, siguen la misma idea usando el propio teléfono o la computadora, sin códigos que tipear. No es urgente para todo el equipo, pero sí para los dos o tres accesos que no podés perder.

**Códigos de recuperación.** Al activarlo te dan códigos para cuando no tenés el teléfono. Guardalos en la bóveda o impresos en un sobre, pero no en la casilla que protegen: el día que lo perdés es justo el día en que no podés entrar ahí. Con el gestor pasa lo mismo, y es el caso que más se olvida: sus códigos de recuperación no pueden vivir dentro del gestor. Imprimilos y guardalos aparte, en un lugar seguro que no dependa de él.

## 4. Altas y bajas de personal: qué cambiar cuando alguien se va

Si las contraseñas compartidas vivían en la bóveda del área, una baja es una lista corta de tareas: sacás el acceso, cambiás las claves desde ahí y el resto del equipo ni se entera. Si vivían en la bóveda personal de esa persona, o peor, en su WhatsApp, el último día se pone feo.

Checklist de baja:

- [ ] Listar todo lo que usaba: correo, gestor, redes, facturación, herramientas diarias.
- [ ] Sacar su acceso del gestor y llevar a la bóveda compartida lo que el equipo necesite.
- [ ] Cambiar la clave de cada cuenta compartida que conocía, y guardar la nueva en la bóveda (si no estaba ahí, es el momento de llevarla).
- [ ] Cerrar las sesiones activas de las cuentas sensibles.
- [ ] Revisar que no quede como dueña o admin del dominio, las redes ni la pauta.
- [ ] Desvincular su teléfono del doble factor antes de que se vaya, y conectar el del reemplazo.
- [ ] Decidir qué pasa con su casilla: reenvío a alguien o baja directa.

En las altas, la misma lógica al revés desde el día uno: usuario propio (nunca un login compartido), acceso a la bóveda de su área, doble factor activado y un dueño claro por cuenta.

## 5. Errores comunes

Todo lo de arriba se desarma de maneras conocidas:

- **La clave maestra floja o compartida.** Abre todas las demás: única, larga y de una sola persona.
- **Doble factor en todo menos en el correo.** Las demás se recuperan desde el correo; si esa cae, se cae todo.
- **Los códigos de recuperación en la casilla que protegen, o los del gestor dentro del gestor.** Es dejar las llaves de repuesto dentro de la caja fuerte cerrada.
- **"Te lo mando por WhatsApp."** Si está en la bóveda, no hay nada que mandar.
- **Una sola persona lo sabe todo.** Clave, factor y códigos en el teléfono de uno son un punto único de falla; hace falta una alternativa documentada, aunque se use poco.
- **Cuentas clave a nombre de correos personales.** El dominio registrado con el correo personal de quien lo cargó es un problema justo cuando menos conviene.
- **Medidas que duran una semana.** Si el proceso es más molesto que el riesgo, el equipo vuelve al chat. Elegí fricciones que el día a día aguante y sostenelas.

## 6. Un punto de partida realista: una tarde

En lugar de un plan anual, agendá una tarde. Al terminarla, correo, plata y lo crítico quedan ordenados y con doble factor.

1. **Listar las cuentas (media hora).** Correo, banco, facturación, dominio, redes, pauta, herramientas diarias. Va a ser más larga de lo que pensabas; está bien.
2. **Elegir el gestor y crear la bóveda del equipo (una hora).** Con una bóveda compartida alcanza; por área se divide después.
3. **Pasar esas contraseñas a la bóveda (una hora).** Aprovechá y cambiá las más importantes, así nadie sigue usando la vieja.
4. **Doble factor en el correo del dominio (veinte minutos).** Con app autenticadora y los códigos de recuperación en la bóveda.
5. **Doble factor en el resto (lo que quede de la tarde).** Banco, dominio, redes y gestor, en ese orden. Los códigos de recuperación del gestor, impresos y fuera de él.
6. **Anotar el dueño de cada cuenta (quince minutos).** Alcanza una planilla mínima o una nota en la bóveda.
7. **Dejar por escrito lo que quedó pendiente.** Lo que no entró hoy va a una lista para la semana próxima, con nombre y apellido, no en el "alguna vez".

## Para cerrar

Nada de esto vuelve inmune a una empresa, y no me creo las promesas que lo afirman. Pero hay una diferencia enorme entre que un acceso robado te deje fuera de juego y que el mismo robo te cueste una tarde de arreglos. La bóveda, el segundo factor y un dueño por cuenta figuran entre lo más barato y lo menos glamoroso que vas a hacer este año, y son justo lo que evita el mal rato. Después siempre queda más por hacer; arrancá el lunes con el correo: con eso cubriste lo principal. Y si querés una segunda mirada sobre cómo quedó tu armado, para eso está CROBF.