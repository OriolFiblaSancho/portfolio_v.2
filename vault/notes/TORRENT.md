# BitTorrent - Introduccion al protocolo y a los private trackers

## Introducción

BitTorrent fue creado en 2001 por el programador Bram Cohen. Se convirtió rápidamente en uno de los protocolos de distribución de contenido P2P más utilizados del planeta: según estimaciones de la consultora CacheLogic, en 2004 llegó a representar más de la mitad del tráfico total de internet en algunos periodos, aunque esta cifra ha sido objeto de debate y conviene tomarla como una estimación de la época y no como un dato exacto y verificado.

Un protocolo P2P (peer-to-peer) es aquel que funciona gracias a la colaboración de distintas máquinas (nodos), todas con la misma funcionalidad. En una red P2P pura no existe un servidor central que distribuya los archivos: cada usuario actúa simultáneamente como cliente y como servidor. BitTorrent surgió en los inicios de esta tecnología para ofrecer un sistema de distribución de archivos descentralizado. Esto explica en parte su popularidad en la piratería: al no depender de un único servidor que aloje el contenido, resulta mucho más difícil de bloquear que un sitio de descargas tradicional (aunque, como se explica más abajo, BitTorrent sí depende de otros elementos —como los trackers o los archivos .torrent— que pueden convertirse en puntos de ataque).

## Funcionamiento
Cada archivo subido a la red se divide en varios fragmentos (*chunks* o *pieces*) que se reparten entre los distintos *peers* que tienen ese .torrent. Cuando un nuevo usuario quiere descargarlo, se conecta a los *seeders* y a otros *peers* que tengan fragmentos parciales, y va recibiendo los distintos *chunks* necesarios hasta poder reconstruir el archivo completo. Para coordinar esta búsqueda de *peers*, BitTorrent se apoya en *trackers* (servidores que llevan el registro de quién tiene qué) o en una red DHT (*Distributed Hash Table*), que permite encontrar *peers* sin necesidad de un tracker central.

## Piezas

Cuando se quiere compartir un archivo, este se divide en varias piezas del mismo tamaño. Cuando un usuario pide una pieza, realmente solicita un bloque: una subdivisión de una pieza, normalmente de 16 KB. Los peers se comunican entre ellos mediante un proceso llamado "choking" y "unchoking", en el que intercambian información sobre qué piezas poseen y cuáles necesitan. Basándose en esta información, deciden qué piezas solicitar a qué peers. El protocolo se encarga automáticamente de que un peer no esté descargando la misma pieza desde múltiples fuentes simultáneamente.

## ¿Qué son los Peers?

Los peers son los clientes de torrent que participan en la red. Existen dos tipos principales:

- **Seeders**: clientes que han completado la descarga del archivo completo y contribuyen a la red sembrando (compartiendo) ese contenido con otros usuarios.
- **Leechers**: clientes que aún no han terminado la descarga pero que también contribuyen compartiendo los fragmentos que ya poseen.

Los seeders de la red son identificados por los nuevos peers a través de los trackers, que mantienen una lista actualizada de todos los clientes que están distribuyendo ese archivo. También existen redes que no dependen de un tracker centralizado y utilizan tecnologías alternativas como DHT (Distributed Hash Table) o PEX (Peer Exchange) para encontrar otros seeders.

## El archivo .torrent

Un archivo torrent tiene varios metadatos que describen informacion importante sobre el archivo al que se hace referencia, por ejemplo:
- Nombre del archivo
- Peso del archivo
- Hashes de las distintas piezas
- Informacion del tracker
- Estructura del archivo

## Algoritmos principales

El protocolo BitTorrent utiliza diversos algoritmos para optimizar la distribución de archivos. Además del algoritmo Choke/Unchoke mencionado anteriormente, destacan:

- **Tit for Tat**: Este algoritmo prioriza compartir datos con los peers que han compartido más datos con nosotros, creando un incentivo para que todos los participantes contribuyan equitativamente.

- **Rarest First**: Determina qué piezas descargar buscando preferentemente las piezas más escasas disponibles en la red. De esta manera mantiene la diversidad de fragmentos disponibles y previene la pérdida de contenido si algún peer abandona la red.


## Private Trackers

BitTorrent es únicamente un protocolo de transferencia de archivos, por lo que necesita de otros servicios para que los usuarios puedan encontrar contenido. Uno de ellos son las páginas web de indexación. Muchos conocemos algunas de las grandes webs de torrents que han marcado época, como The Pirate Bay, 1337x o TorrentGalaxy. Estas páginas se dedicaban a recopilar e indexar la mayor cantidad posible de archivos .torrent, acumulando así enormes bases de datos de contenido (gran parte de él protegido por derechos de autor), lo que las convirtió en un objetivo claro para las empresas que buscaban combatir la piratería.

Por ello fueron surgiendo los *private trackers*: páginas privadas de indexación de archivos .torrent cuyo objetivo declarado suele ser acumular la mayor cantidad de contenido posible (a menudo con un enfoque en la preservación y la calidad) y mantenerlo disponible a largo plazo gracias a una comunidad cerrada de usuarios.

Para entrar en muchos de estos trackers es necesario pasar una entrevista o recibir una invitación de alguien que ya forme parte de la comunidad. Estas invitaciones a veces se compran, aunque existen numerosos casos documentados de estafas, incluso por parte de moderadores de las propias páginas, por lo que conviene actuar con cautela. En foros como 4chan se suele recomendar empezar por trackers que ofrecen un proceso de entrevista público, como RED, e ir subiendo de rango en la comunidad aportando contenido y manteniendo buenas ratios de *seed* (compartiendo los archivos descargados durante más tiempo).

Uno de los requisitos para mejorar el estatus en las comunidades privadas es mantener un buen ratio en los torrents que activamente se comparten. El ratio se calcula dividiendo los datos subidos entre los datos descargados. Por ejemplo, si has descargado 10 GB y compartido 20 GB, tu ratio es de 2.0.

## Conclusión

El protocolo BitTorrent es extremadamente complejo y posee una profundidad considerable. Este documento apenas raspa la superficie de esta tecnología. Te recomiendo investigar más a fondo para comprender completamente el alcance y las posibilidades de este protocolo fundamental en la distribución de contenido en internet. 

## Bibliografía

- [Understanding BitTorrent: An Experimental Perspective](https://inria.hal.science/inria-00000156/)
- [Unraveling the BitTorrent Ecosystem](https://ieeexplore.ieee.org/abstract/document/5482574)
- [The BitTorrent P2P File-Sharing System: Measurements and Analysis](https://link.springer.com/chapter/10.1007/11558989_19)
- [BitTorrent Part 1: The Engineering Behind the BitTorrent Protocol](https://medium.com/@abhinavcv007/bittorrent-part-1-the-engineering-behind-the-bittorrent-protocol-04e70ee01d58)
- [How Torrent Works? ](https://dev.to/samyak112/how-torrent-works-bka)