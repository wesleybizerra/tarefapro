import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Log de requisições para depuração no Railway
app.use((req, res, next) => {
    if (req.url !== '/health') {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    }
    next();
});

app.get('/health', (req, res) => res.status(200).send('OK'));

// --- MOCK API ---
const globalState = {
    users: [{ name: "Wesley Bizerra", email: "wesleybizerra@hotmail.com", password: "Cadernorox@27", role: "ADMIN", balance: 0 }],
    stats: { totalRevenue: 0, adminCommission: 0, activeUsers: 1 }
};

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = globalState.users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });
    res.json({ success: true, user });
});

app.get('/api/admin/stats', (req, res) => res.json({ ...globalState.stats, members: globalState.users }));

// --- SERVIR FRONTEND ---
const distPath = path.resolve(__dirname, 'dist');

// Servir arquivos estáticos (CSS, JS do build do Vite)
app.use(express.static(distPath));

// Fallback para SPA - Serve o index.html gerado pelo BUILD
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error(`ERRO: index.html não encontrado em ${indexPath}`);
        res.status(404).send('Frontend não encontrado. Verifique os logs de build.');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📂 Pasta dist: ${distPath}`);
});