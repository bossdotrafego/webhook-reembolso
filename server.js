const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// Webhook da Kiwify
app.post('/webhook-reembolso', (req, res) => {
    console.log('🚨 WEBHOOK RECEBIDO:', req.body);
    
    try {
        const chave = req.body.custom_fields?.license_key || 
                      `PREMIUM-2025-${req.body.order_id}`;
        
        console.log('🔒 BLOQUEANDO CHAVE:', chave);
        
        const blacklistPath = path.join(__dirname, 'blacklist.txt');
        let blacklist = '';
        
        if (fs.existsSync(blacklistPath)) {
            blacklist = fs.readFileSync(blacklistPath, 'utf8');
        }
        
        blacklist += '\n' + chave;
        fs.writeFileSync(blacklistPath, blacklist.trim());
        
        const logEntry = `[${new Date().toISOString()}] REEMBOLSO: ${chave}\n`;
        fs.appendFileSync('reembolsos.log', logEntry);
        
        res.status(200).send(`OK - Chave bloqueada: ${chave}`);
        
    } catch (error) {
        console.error('❌ ERRO:', error);
        res.status(500).send('Erro interno');
    }
});

app.post('/api/update-file', (req, res) => {
    try {
        const { filename, content } = req.body;
        fs.writeFileSync(filename, content);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/read-file/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const content = fs.readFileSync(filename, 'utf8');
        res.send(content);
    } catch (error) {
        res.status(404).send('Arquivo não encontrado');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🎯 Webhook: /webhook-reembolso`);
    console.log(`🖥️ Painel: /painel.html`);
});
