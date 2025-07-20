const express = require('express');
const app = express();

app.use(express.json());

app.post('webhook-reembolso', (req, res) = {
    console.log('🚨 REEMBOLSO DETECTADO', req.body);
    
    const chave = req.body.custom_fields.license_key  
                  `PREMIUM-2025-${req.body.order_id}`;

    console.log('🔒 BLOQUEANDO CHAVE', chave);

     Aqui você pode salvar a chave em um txt, banco ou repo GitHub
    res.status(200).send('OK - Chave bloqueada');
});

app.get('', (req, res) = {
    res.send('🔧 Webhook Online');
});

app.listen(3000, () = {
    console.log('🎯 Webhook rodando na porta 3000');
});
