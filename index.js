require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.post('/api/login', (req, res) => {
    const senhaDigitada = req.body.senha;
    const senhaCorreta = process.env.SENHA;

    console.log("Senha que chegou do site:", senhaDigitada);
    console.log("Senha que o Node leu do .env:", senhaCorreta);

    if (senhaDigitada === senhaCorreta) {
        res.status(200).json({ sucesso: true });
    } else {
        res.status(401).json({ sucesso: false });
    }
});

const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.MY_CHAT_ID;


app.get('/enviar', async (req, res) => {
    const mensagem = req.query.msg;

    if (!mensagem) {
        return res.status(400).send('Erro: Mensagem vazia.');
    }

    try {
        const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
        await axios.post(url, {
            chat_id: CHAT_ID,
            text: mensagem
        });
        console.log(`[${new Date().toLocaleTimeString()}] ✅ Enviado: ${mensagem}`);
        res.status(200).send('mensagem enviada');
    } 
    catch (error) {
        console.error('❌ Erro no Telegram:', error.response?.data?.description || error.message);
        res.status(500).send('Erro ao enviar para o Telegram.');
    }
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 PAINEL ONLINE: http://localhost:${PORT}`);
});