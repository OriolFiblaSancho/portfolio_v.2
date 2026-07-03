# BitTorrent - Introducción al protocolo y a los private trackers

## Introducción

BitTorrent fue creado en 2001 por el programador Bram Cohen. Se convirtió rápidamente en uno de los protocolos de distribución de contenido P2P más utilizados del planeta: según estimaciones de la época (como las de CacheLogic), en 2004 pudo llegar a representar alrededor de un tercio del tráfico de internet en ciertos contextos.

Un protocolo P2P (peer-to-peer) es aquel que funciona gracias a la colaboración de distintas máquinas (nodos), todas con la misma funcionalidad. En una red P2P pura no existe un servidor central que distribuya los archivos: cada usuario actúa simultáneamente como cliente y como servidor. BitTorrent surgió en los inicios de esta tecnología para ofrecer un sistema de distribución de archivos descentralizado. Esto explica en parte su popularidad en la piratería: al no depender de un único servidor que aloje el contenido, resulta mucho más difícil de bloquear que un sitio de descargas tradicional (aunque, como se explica más abajo, BitTorrent sí depende de otros elementos de descubrimiento y distribución de metadatos, como trackers, DHT, PEX, archivos .torrent o enlaces magnet).

## Funcionamiento
Cada archivo subido a la red se divide en varios fragmentos (*chunks* o *pieces*) que se reparten entre los distintos *peers* que tienen ese .torrent. Cuando un nuevo usuario quiere descargarlo, se conecta a los *seeders* y a otros *peers* que tengan fragmentos parciales, y va recibiendo los distintos *chunks* necesarios hasta poder reconstruir el archivo completo. Para coordinar esta búsqueda de *peers*, BitTorrent se apoya en *trackers* (servidores que llevan el registro de quién tiene qué) o en una red DHT (*Distributed Hash Table*), que permite encontrar *peers* sin necesidad de un tracker central.

## Piezas

Las piezas suelen tener un tamaño fijo dentro del mismo torrent. Al descargarlas, el cliente no siempre pide la pieza completa: normalmente pide bloques más pequeños (por ejemplo, de 16 KB).

Entre peers hay una negociación constante llamada *choking* y *unchoking*. En simple: cada cliente decide con quién intercambia datos en ese momento. Esa decisión cambia según velocidad, reciprocidad y disponibilidad de piezas.

En la práctica, esto ayuda a que la descarga sea eficiente y a que la red no se atasque pidiendo siempre lo mismo a los mismos peers.

## ¿Qué son los Peers?

Los peers son los clientes de torrent que participan en la red. Existen dos tipos principales:

- **Seeders**: clientes que han completado la descarga del archivo completo y contribuyen a la red sembrando (compartiendo) ese contenido con otros usuarios.
- **Leechers**: clientes que aún no han terminado la descarga pero que también contribuyen compartiendo los fragmentos que ya poseen.

Los seeders de la red pueden ser identificados por los nuevos peers a través de trackers, DHT (Distributed Hash Table) o PEX (Peer Exchange). Los trackers mantienen listas de peers, pero no son el único mecanismo de descubrimiento.

## El archivo .torrent

Un archivo .torrent contiene metadatos sobre lo que se va a descargar. Por ejemplo:

- Nombre del archivo
- Tamaño del archivo
- Hashes de las distintas piezas
- Información del tracker
- Estructura del archivo

## Algoritmos principales

BitTorrent usa varios algoritmos para repartir mejor los datos. Además de *choke/unchoke*, destacan:

- **Tit for Tat**: prioriza, mediante las reglas de *choking/unchoking* y *optimistic unchoking*, a quienes también contribuyen. Es una forma de incentivar la reciprocidad en la red.

- **Rarest First**: intenta descargar antes las piezas menos comunes. Así se mantiene la diversidad y se reduce el riesgo de que falten piezas si se desconectan varios peers.


## Private Trackers

BitTorrent es únicamente un protocolo de transferencia de archivos, por lo que necesita de otros servicios para que los usuarios puedan encontrar contenido. Uno de ellos son las páginas web de indexación. Muchos conocemos algunas de las grandes webs de torrents que han marcado época, como The Pirate Bay, 1337x o TorrentGalaxy. Estas páginas se dedicaban a recopilar e indexar la mayor cantidad posible de archivos .torrent, acumulando así enormes bases de datos de contenido (gran parte de él protegido por derechos de autor), lo que las convirtió en un objetivo claro para las empresas que buscaban combatir la piratería.

En ese contexto crecieron los *private trackers*: comunidades cerradas que indexan torrents y suelen enfocarse en calidad, organización y preservación.

Para entrar en muchos de estos trackers es necesario pasar una entrevista o recibir una invitación de alguien que ya forme parte de la comunidad. Estas invitaciones a veces se compran, aunque existen numerosos casos documentados de estafas, incluso por parte de moderadores de las propias páginas, por lo que conviene actuar con cautela. En foros como 4chan se suele recomendar empezar por trackers que ofrecen un proceso de entrevista público, como RED, e ir subiendo de rango en la comunidad aportando contenido y manteniendo buenas ratios de *seed* (compartiendo los archivos descargados durante más tiempo).

Uno de los puntos más importantes dentro de un private tracker es el ratio.

El ratio = datos subidos / datos descargados.

Ejemplo: si descargas 10 GB y subes 20 GB, tu ratio es 2.0.


## Conclusión

El protocolo BitTorrent es extremadamente complejo y posee una profundidad considerable. Este documento apenas raspa la superficie de esta tecnología. Te recomiendo investigar más a fondo para comprender completamente el alcance y las posibilidades de este protocolo fundamental en la distribución de contenido en internet. 

## Bibliografía

- [Understanding BitTorrent: An Experimental Perspective](https://inria.hal.science/inria-00000156/)
- [Unraveling the BitTorrent Ecosystem](https://ieeexplore.ieee.org/abstract/document/5482574)
- [The BitTorrent P2P File-Sharing System: Measurements and Analysis](https://link.springer.com/chapter/10.1007/11558989_19)
- [BitTorrent Part 1: The Engineering Behind the BitTorrent Protocol](https://medium.com/@abhinavcv007/bittorrent-part-1-the-engineering-behind-the-bittorrent-protocol-04e70ee01d58)
- [How Torrent Works? ](https://dev.to/samyak112/how-torrent-works-bka)