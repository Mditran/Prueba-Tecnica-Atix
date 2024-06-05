import express from 'express';
import generatePdf from './pdf/generatePDF.js';
import path from 'path';

const app = express();
const port = 3005;

// Middleware para parsear JSON
app.use(express.json());

// Definir rutas estáticas
const __dirname = path.resolve();
app.use('/img', express.static(path.join(__dirname, 'src/img')));
app.use('/html', express.static(path.join(__dirname, 'src/html')));

app.post('/generate-pdf', async (req, res) => {

    const results = [];

    for (const request of req.body) {
        try {
            const pdfBuffer = await generatePdf({
                tipoDocumento: request.tipoDocumento,
                numeroDocumento: request.numeroDocumento
            });

            // Agrega la respuesta al array de resultados
            results.push(pdfBuffer);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            // Si hay un error, agrega un objeto con el error al array de resultados
            results.push({ error: 'Error al generar el PDF' });
        }
    }
     // Devuelve los resultados como respuesta
    res.json(results);
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
