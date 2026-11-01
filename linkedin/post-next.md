Hace unas semanas os enseñé PrintAllPDFs, la herramienta que creamos para dejar de imprimir los albaranes B2B uno a uno.

Funcionaba. Pero nuestros albaranes pesan unos 3 MB cada uno (escaneos, logos, firmas…) y con 20 o 30 de golpe algunas impresoras de almacén se atascaban.

Así que la hemos rehecho desde cero en Next.js y React:

📦 Impresión por lotes: divides la cola en trabajos de 5, 10 o 20 albaranes. La app te dice "Imprimir lote 1 de 3", "lote 2 de 3"… y marca cuáles ya se han enviado.
🖨️ Las copias se piden en el diálogo de la impresora, así que el archivo no se duplica.
✋ Arrastras los albaranes para ordenarlos, o por tienda A→Z con un clic.
📄 Doble cara sin mezclas: cada albarán empieza en hoja nueva.
🔒 Y como siempre, nada se sube a ningún servidor ni se comprime: los códigos de barras salen nítidos.

Detalles pequeños que evitan sustos grandes.

👉 printallpdfs.vercel.app

¿Cuántos albaranes sale cada mañana de vuestro almacén? 👇

#logística #almacén #retail #b2b #nextjs #react
