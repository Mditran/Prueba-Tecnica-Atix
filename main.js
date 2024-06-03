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
    try {
        const pdfBuffer = await generatePdf({
            tipoDocumento: req.body.tipoDocumento,
            numeroDocumento: req.body.numeroDocumento,
            captchaText: req.body.captchaText,
        });

        res.status(200)
            .set({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/pdf',
            })
            .end(pdfBuffer);
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).json({ error: 'Error al generar el PDF' });
    }
});

app.get('/download-img/:numeroDocumento', (req, res) => {
    const filePath = path.join(__dirname, './img', `${req.params.numeroDocumento}.png`);
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error al descargar la imagen:', err);
            res.status(500).json({ error: 'Error al descargar la imagen' });
        }
    });
});

app.get('/download-html/:numeroDocumento', (req, res) => {
    const filePath = path.join(__dirname, './html', `${req.params.numeroDocumento}.html`);
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error al descargar el HTML:', err);
            res.status(500).json({ error: 'Error al descargar el HTML' });
        }
    });
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
