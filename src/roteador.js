const express = require('express');
const { validaSenha, validarCamposObrigatorios, VerificarCPFeEmailExistente, verificarDadosParaTransferencia, validarParametrosdeQueryExtrato } = require('./intermediarios');
const { CriarConta, listarContas, atualizarUsuario, excluirConta, } = require('./controladores/conta');
const { depositar, sacar, transferir, saldo, extrato } = require('./controladores/transacoes');
const { transferencias } = require('./bancodedados');
// const validaSenha = requiere('./intermediario')



const rotas = express();


rotas.get('/contas', validaSenha, listarContas);
rotas.post('/contas', VerificarCPFeEmailExistente, CriarConta);
rotas.put('/contas/:numeroConta/usuario', validarCamposObrigatorios, atualizarUsuario);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', verificarDadosParaTransferencia, transferir);
rotas.get('/contas/saldo', validarParametrosdeQueryExtrato, saldo)
rotas.get('/contas/extrato', validarParametrosdeQueryExtrato, extrato)

rotas.delete('/contas/:numeroConta', excluirConta)

module.exports = rotas;
