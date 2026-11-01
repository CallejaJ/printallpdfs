# PDFallprint (web)

Web estática para imprimir muchos PDF de una vez. Los PDF se unen en el navegador con
[pdf-lib](https://pdf-lib.js.org/) y se abre un único diálogo de impresión. Nada se sube a ningún servidor.

## Funciones
- Arrastrar y soltar (o elegir) varios PDF; ignora lo que no sea PDF y marca los que no se pueden leer.
- Orden manual (↑ ↓), por nombre o por fecha. Quitar archivos.
- Copias (1 a 50) y página en blanco tras documentos de páginas impares, para que cada uno empiece en hoja nueva al imprimir a doble cara.
- "Imprimir todo" (un solo diálogo) o "Descargar PDF unido".

## Archivos
- `index.html`: toda la app. Carga pdf-lib desde jsDelivr y, si falla, desde `vendor/`.
- `vendor/pdf-lib.min.js`: copia local de pdf-lib 1.17.1 (sirve también sin conexión).
- `vercel.json`: cabeceras básicas.

## Desplegar en Vercel
```
cd pdfallprint-web
npx vercel deploy          # vista previa
npx vercel deploy --prod   # producción
```
También funciona abriendo `index.html` directamente en el navegador.

## Límite conocido
Un navegador no puede imprimir sin mostrar el diálogo. Para impresión silenciosa haría falta un
pequeño programa local (opción "Web + programa local").
