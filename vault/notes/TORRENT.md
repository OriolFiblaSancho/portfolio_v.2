# El protocolo BitTorrent y los private trackers

## Introducción

BitTorrent fue creado en 2001 por el programador Bram Cohen. Se convirtió rápidamente en uno de los protocolos de distribución de contenido P2P más utilizados del planeta: según estimaciones de la consultora CacheLogic, en 2004 llegó a representar más de la mitad del tráfico total de internet en algunos periodos, aunque esta cifra ha sido objeto de debate y conviene tomarla como una estimación de la época y no como un dato exacto y verificado.

Un protocolo P2P (peer-to-peer) es aquel que funciona gracias a la colaboración de distintas máquinas (nodos), todas con la misma funcionalidad. En una red P2P pura no existe un servidor central que distribuya los archivos: cada usuario actúa simultáneamente como cliente y como servidor. BitTorrent surgió en los inicios de esta tecnología para ofrecer un sistema de distribución de archivos descentralizado. Esto explica en parte su popularidad en la piratería: al no depender de un único servidor que aloje el contenido, resulta mucho más difícil de bloquear que un sitio de descargas tradicional (aunque, como se explica más abajo, BitTorrent sí depende de otros elementos —como los trackers o los archivos .torrent— que pueden convertirse en puntos de ataque).

Cada archivo subido a la red se divide en varios fragmentos (*chunks* o *pieces*) que se reparten entre los distintos usuarios (*peers*) que tienen ese .torrent. Cuando un nuevo usuario quiere descargarlo, se conecta a los *seeders* (usuarios que ya tienen el archivo completo) y a otros *peers* que tengan fragmentos parciales, y va recibiendo los distintos *chunks* necesarios hasta poder reconstruir el archivo completo. Para coordinar esta búsqueda de *peers*, BitTorrent se apoya en *trackers* (servidores que llevan el registro de quién tiene qué) o en una red DHT (*Distributed Hash Table*), que permite encontrar *peers* sin necesidad de un tracker central.

BitTorrent es únicamente un protocolo de transferencia de archivos, por lo que necesita de otros servicios para que los usuarios puedan encontrar contenido. Uno de ellos son las páginas web de indexación. Muchos conocemos algunas de las grandes webs de torrents que han marcado época, como The Pirate Bay, 1337x o TorrentGalaxy. Estas páginas se dedicaban a recopilar e indexar la mayor cantidad posible de archivos .torrent, acumulando así enormes bases de datos de contenido (gran parte de él protegido por derechos de autor), lo que las convirtió en un objetivo claro para las empresas que buscaban combatir la piratería.

## Private Trackers

Por ello fueron surgiendo los *private trackers*: páginas privadas de indexación de archivos .torrent cuyo objetivo declarado suele ser acumular la mayor cantidad de contenido posible (a menudo con un enfoque en la preservación y la calidad) y mantenerlo disponible a largo plazo gracias a una comunidad cerrada de usuarios.

Para entrar en muchos de estos trackers es necesario pasar una entrevista o recibir una invitación de alguien que ya forme parte de la comunidad. Estas invitaciones a veces se compran, aunque existen numerosos casos documentados de estafas, incluso por parte de moderadores de las propias páginas, por lo que conviene actuar con cautela. En foros como 4chan se suele recomendar empezar por trackers que ofrecen un proceso de entrevista público, como RED, e ir subiendo de rango progresivamente aportando contenido y manteniendo buenas ratios de *seed* (compartiendo los archivos descargados durante más tiempo).

## El archivo .torrent

TO DO: 
Que contiene un .torrent, los algoritmos como el Tip-For-Tat o rarest-First, los ratios y porque son importantes DHT, PEX y trackerless torrents

## Bibliografía

- [Understanding BitTorrent: An Experimental Perspective](https://inria.hal.science/inria-00000156/)
- [Unraveling the BitTorrent Ecosystem](https://ieeexplore.ieee.org/abstract/document/5482574)
- [The BitTorrent P2P File-Sharing System: Measurements and Analysis](https://link.springer.com/chapter/10.1007/11558989_19)
- [BitTorrent Part 1: The Engineering Behind the BitTorrent Protocol](https://medium.com/@abhinavcv007/bittorrent-part-1-the-engineering-behind-the-bittorrent-protocol-04e70ee01d58)