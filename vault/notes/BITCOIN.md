# Bitcoin - Funcionamiento y arquitectura

## Por qué existe Bitcoin

Imagínate que quieres crear tu propia moneda, una moneda virtual, poder tenerla en una wallet, pasarla a otros usuarios y poco más, pero sin depender de gobiernos o corporaciones y con un alto grado de privacidad (aunque no anonimato total), ¿cómo lo haces?

En una moneda normal, los usuarios están conectados a una entidad de confianza (el banco), con una base de datos de cada usuario, donde puede verificar si los datos que le llegan son correctos. Nosotros debemos ver esto como una debilidad: la base de datos de esta entidad debería ser extremadamente robusta, pues si falla, pierdes dinero. Aquí es donde está el problema.

> **Nota:** Bitcoin no es anónimo, es *pseudónimo*. Las transacciones son públicas y permanentes; si alguien vincula tu clave pública con tu identidad, puede ver todo tu historial.

## Modelo P2P

Eliminar la dependencia de una entidad de confianza fue un dolor de cabeza para los ingenieros de los años noventa. Wei Dai en 1998 publicó un ensayo donde presentaba el sistema b-money, un sistema descentralizado que usaría criptografía como medio de control y un sistema P2P donde cada nodo almacenaba una copia de los datos de la red. Cuando se efectuase una transacción, esa información debería propagarse y replicarse en el resto de nodos.

Pero primero, ¿qué debía tener esa base de datos?

Se dieron cuenta de que en realidad solo necesitaban guardar las transacciones: qué dinero le pasa quién a quién; todo lo demás se puede deducir de eso.

Entonces cada nodo del sistema debía tener una lista de las transacciones hechas por todos los usuarios. Cuando un usuario realizaba una transacción, esta era anunciada y transmitida al resto de nodos. ¿Simple, verdad?

### Un nuevo nodo

Imagínate que quieres meterte al sistema, ser un nuevo nodo. Lo primero que deberás hacer es abrir el puerto **8333**. Así, cuando un nodo externo nos contacte, su mensaje irá a nuestro código.

Ahora tenemos el puerto abierto, sí, pero si no conocemos a nadie, nadie nos va a hablar. Es por eso que existen las **DNS seeds**, servidores conocidos que mantienen una lista de IPs de nodos del sistema.

Por último debemos saber qué decirle a nuestros nuevos compañeros de red para establecer la conexión. Lo que se envía es un mensaje como este:

```hex
f9beb4d976657273696f6e00000000006f0000004aae42a47c11010005000000000000001436396400000000010000000000000000000000000000000000ffffc1207f8db0d0050000000000000000000000000000000000ffff8a4414c5208df66af23ecba5bd68192f5361746f7368693a302e31322e3128626974636f696e292fc8fb0b0001
```

Estructura simplificada del mensaje:

| Campo        | Bytes | Descripción                                      |
| ------------ | ----- | ------------------------------------------------ |
| Magic bytes  | 4     | Identifican la red (`f9beb4d9` = mainnet)        |
| Comando      | 12    | Nombre del comando, rellenado con ceros (`version`) |
| Payload size | 4     | Tamaño del payload en little-endian              |
| Checksum     | 4     | Primeros 4 bytes del `hash256` del payload       |
| Payload      | N     | Datos del mensaje (versión, servicios, etc.)     |

Los primeros 4 bytes corresponden a los **Magic Bytes**, que identifican la red a la que te quieres conectar:

| Network  | Magic Bytes | Port  | Descripción                                                            |
| -------- | ----------- | ----- | ---------------------------------------------------------------------- |
| Mainnet  | `f9beb4d9`  | 8333  | Red "de verdad" donde los datos son reales                             |
| Testnet3 | `0b110907`  | 18333 | Red de testing, recurre a fondos ficticios o de prueba, sin valor real |
| Regtest  | `fabfb5da`  | 18444 | Red de testing, donde además tienes control total sobre la red         |

Luego pasamos al **comando** a ejecutar en la red. Los más habituales:

| Comando   | Uso                                              |
| --------- | ------------------------------------------------ |
| `version` | Handshake inicial: versión del protocolo         |
| `verack`  | Confirmación de que el handshake fue aceptado      |
| `tx`      | Propagar una transacción                         |
| `getaddr` | Pedir direcciones de otros nodos                 |

Finalmente va el **payload**, con los datos concretos a transmitir (info de una transacción, versión del nodo, etc.).

> **Nota:** Dependiendo del comando, el payload incluye campos adicionales.

Lo primero que pasamos a la red como nuevo nodo será un mensaje con el comando `version`. Así establecemos la versión del protocolo con la que vamos a trabajar; una vez aceptado el handshake (`verack`), ya estamos dentro. Por defecto, un nodo mantiene hasta **8 conexiones salientes** activas con otros nodos. A continuación deberemos pedirles que nos pasen los bloques y transacciones que aún no conocemos, para sincronizar nuestra copia del historial.

## ECDSA (Elliptic Curve Digital Signature Algorithm)

Ya estás: eres un nuevo nodo, ya puedes propagar transacciones a la red y actualizar tu copia local. Es aquí donde se presentan los verdaderos grandes problemas del sistema.

**¿Cómo puede saber la red que estás diciendo la verdad?**

Es aquí donde entran las **firmas digitales**. Si el usuario firma la transacción con su clave privada, el resto de nodos puede verificar que solo quien posee esa clave pudo autorizarla. Pero no basta con eso: debemos asegurarnos de que la transacción no cambia por el camino; es ahí donde entra el ámbito más importante en el mundo de las criptomonedas: la criptografía, el arte de proteger información y comunicaciones usando algoritmos matemáticos.

Lo que se hizo fue buscar un problema matemático que solo un usuario con su número secreto (clave privada) pudiera resolver, publicar el resultado (la firma) y dejar que el resto de nodos lo verifiquen con la clave pública. Si la firma es válida, la transacción es auténtica; si no, se rechaza. El resto de nodos no conocen el número secreto, solo pueden comprobar si el resultado es correcto.

En las criptomonedas se usa una **curva elíptica** para plantear este problema. Una curva elíptica es el conjunto de puntos que satisfacen una ecuación de la forma:

```
y² = x³ + ax + b
```

Pero Bitcoin y, de hecho, la mayoría de criptomonedas usan exactamente la conocida como **secp256k1** (`y² = x³ + 7`), ya que tiene una propiedad de lo más interesante.

La explicación de la propiedad y el uso que se le da prefiero delegarlo a Greg Walker en [learnmeabitcoin.com — Elliptic Curve](https://learnmeabitcoin.com/technical/cryptography/elliptic-curve/).

> Parafraseando a Greg Walker: *"La estructura de la curva nos permite hacer una función matemática para movernos entre los puntos de la curva en una sola dirección, sin poder ir hacia atrás jamás."*

Entonces, usando secp256k1 y nuestra clave privada (el número secreto de antes), a partir de la cual se deriva una clave pública, podremos firmar el hash de nuestra transacción (SHA-256 aplicado dos veces, `hash256`). La firma ECDSA consta de dos números, `r` y `s`. Nosotros le pasaremos a la red la transacción, la firma y la clave pública correspondiente. Con todos estos datos la red ya podrá verificar que somos quienes autorizamos la transacción y que no ha sido alterada.

## Transacciones

Se nos plantea otro problema: si en todas las transacciones reutilizamos la misma clave pública, y alguien averigua que esa clave es nuestra, podrá saber todas las transacciones que hemos hecho. Es por eso que en la práctica cada transacción (o cada pago) puede usar su propia pareja de claves pública/privada, y nosotros solo tenemos que guardar bien cada pareja en nuestra wallet.

Pero entonces, si tienes varias claves, y los nodos deducen la cantidad de criptos que tienes en base a la lista de transacciones, ¿cómo puede saber la red si la transacción que estás haciendo es posible? Pues ahora deberemos cambiar la estructura de las transacciones; ya no vale con:

```
{clave pública emisor} → total a pasar → {clave pública receptor}
```

Ahora deberemos pasar:

| Campo       | Descripción |
| ----------- | ----------- |
| **inputs**  | Lista de salidas anteriores (UTXOs) que prueban que tienes los bitcoins que dices que vas a enviar. |
| **outputs** | Lista de destinos con la cantidad a enviar y un **ScriptPubKey**: script de bloqueo que define las condiciones para gastar esos bitcoins (normalmente la clave pública del receptor o su hash, pero puede ser otra condición). Deben gastarse por completo los inputs; el sobrante vuelve a ti como *cambio*. |
| **witness** | Firmas enlazadas a los inputs para verificar que eres el propietario legítimo (presente en transacciones SegWit). |
| **locktime** | Campo opcional que indica a partir de qué bloque o timestamp Unix la transacción puede incluirse en un bloque. |

Para verificar que la lista de inputs es correcta y que una de las transacciones no ha sido gastada ya, cada nodo mantiene un conjunto **UTXO** (*Unspent Transaction Output*), donde registra cada salida no gastada.


## El problema del doble gasto

Ahora viene el que fue el problema más grande de la criptografía durante 20 años: si un nodo es malicioso, podría mandar la misma transacción a dos personas usando los mismos inputs y enviándolo a dos nodos distintos. Esto rompe el sistema y provoca que haya dos versiones distintas del historial en la red, las dos aparentemente válidas.

Aquí es donde entra nuestro amigo, el programador con el pseudónimo **Satoshi Nakamoto**, que en 2008 publicó un paper de tan solo 9 páginas donde creó Bitcoin y encontró solución al problema del doble gasto.

### El proof of work

Cada nodo tendrá un **mempool**, donde se colocará y validará cada solicitud de transacción recibida. El mempool difiere de un nodo a otro (cada uno ve las transacciones en momentos distintos), pero mientras una transacción solo está en el mempool y no en un bloque confirmado, sigue existiendo el riesgo de doble gasto.

La solución es que los nodos **mineros** compiten continuamente para crear un bloque válido a partir de su mempool. En promedio, uno de ellos lo consigue cada ~10 minutos, y ese bloque es aceptado por toda la red. Entonces ya no tenemos una lista plana de transacciones, sino una lista de bloques de transacciones encadenados: la conocida **blockchain**.

El bloque no se "elige" cada 10 minutos: los mineros trabajan sin parar intentando resolver un puzzle criptográfico. Cuando un nodo encuentra la solución, su bloque se difunde por toda la red; si es válido, los demás lo aceptan y empiezan la carrera para el siguiente bloque.

#### Ciclo de minado

1. El nodo mira su mempool y mete tantas transacciones como puede en un bloque; hay un límite de peso (~4 MB), así que algunas transacciones deben esperar en el mempool.
2. En paralelo, intenta resolver el puzzle de proof of work:

| Paso | Acción |
| ---- | ------ |
| 1 | Construye el **header del bloque** (80 bytes) con los campos de la tabla siguiente. |
| 2 | Aplica **SHA-256 dos veces** (`hash256`) sobre ese header. |
| 3 | El resultado debe ser **≤ target** fijado por la red (en la práctica, un hash con ceros al principio). |
| 4 | Si no cumple, incrementa el `nonce` y vuelve al paso 2 (prueba y error). |
| 5 | Una vez encontrado, transmite el bloque; los demás solo verifican, sin repetir el trabajo. |

**Campos del block header (80 bytes):**

| Campo            | Tamaño | Descripción                              |
| ---------------- | ------ | ---------------------------------------- |
| Version          | 4 B    | Versión del bloque                       |
| `hashPrevBlock`  | 32 B   | Hash del bloque anterior                 |
| `hashMerkleRoot` | 32 B   | Raíz Merkle de las transacciones         |
| Timestamp        | 4 B    | Hora Unix                                |
| `bits`           | 4 B    | Dificultad en formato compacto           |
| `nonce`          | 4 B    | Contador que el minero incrementa        |

El tiempo medio de resolución (~10 minutos) depende de la dificultad (cuántos ceros exige el `target`) y del poder de cómputo total de la red. La red ajusta esa dificultad **cada 2.016 bloques**, con el objetivo de mantener un bloque cada ~10 minutos de media.

En cuanto un nodo encuentra una solución, la comparte junto con el bloque. Si se acepta, se acepta el bloque y vuelve a empezar la carrera.

> **Fork temporal:** Si dos nodos terminan la carrera casi a la vez, no se rompe: se forman dos ramas temporales. Los nodos siguen minando sobre la que reciben primero, y al final la red converge en la cadena con **más trabajo acumulado** (proof of work).


## Los incentivos

Hasta ahora no hemos hablado realmente de dónde se consiguen o salen estas criptos. Antes he comentado que hay transacciones que se quedan esperando en el mempool porque el bloque tiene un límite de tamaño; esas transacciones compiten por entrar en el siguiente bloque ofreciendo **comisiones** al minero.

Existen dos fuentes de ingreso para quien crea un bloque:

| Fuente | Descripción |
| ------ | ----------- |
| **Comisiones de transacción** | En cada transacción incluida en el bloque, la diferencia entre el valor total de los inputs y el valor total de los outputs va para el minero. Los usuarios suelen ofrecer una comisión mayor para que su transacción sea priorizada cuando el bloque se llena. |
| **Recompensa de bloque (coinbase)** | El minero incluye una transacción especial llamada *coinbase* que genera bitcoins nuevos. Solo puede haber **21.000.000 BTC** en total. Cada 210.000 bloques (~4 años) la recompensa se reduce a la mitad (*halving*): empezó en 50 BTC/bloque; tras el halving de 2024, son **3,125 BTC/bloque**. |


## Bibliografía

- [LearnMeABitcoin](https://learnmeabitcoin.com/)
- [Wikipedia — Criptomoneda](https://es.wikipedia.org/wiki/Criptomoneda)
- [YouTube — *viens, on recode Bitcoin pour le comprendre*](https://www.youtube.com/watch?v=U4S-RGNyTJA)
- [Martes Neológico — Criptomoneda](https://blogscvc.cervantes.es/martes-neologico/criptomoneda/)
- [Nakamoto Institute — B-Money by Wei Dai (1998)](https://nakamotoinstitute.org/library/b-money/)
- [Oro y Finanzas — ¿Qué es la Bitcoin Testnet y la Bitcoin Regtest?](https://www.oroyfinanzas.com/2015/02/que-bitcoin-testnet-regtest/)
- [Cornell University — Towards a Secure SECP256K1 for Crypto Wallets](https://arxiv.org/abs/2411.03910)
- [Satoshi Nakamoto — *A Peer-to-Peer Electronic Cash System* (2008)](https://bitcoin.org/bitcoin.pdf)
