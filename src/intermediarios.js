const { contas } = require('./bancodedados')

const validaSenha = (req, res, next) => {
    const { senha } = req.query;

    if (senha !== 'Cubos123Bank') {
        return res.status(401).json({ mensagem: 'Senha está incorreta' });
    }
    next();
}
const validarCamposObrigatorios = (req, res, next) => {
    const { nome, sobrenome, data_nascimento, cpf, senha, email, telefone } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'nome inválido, revise suas informações e tente novamente' });
    }
    if (!sobrenome) {
        return res.status(400).json({ mensagem: 'sobrenome inválido, revise suas informações e tente novamente' });
    }
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'Sua data de nascimento precisa ser enviada' });
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: 'O campo "CPF" é obrigatório e precisa ser preenchido, revise suas informações e tente novamente' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'Precisamos de uma senha para sua conta.' });
    }
    if (!email) {
        return res.status(400).json({ mensagem: 'O campo e-mail precisa ser enviado' });
    }
    if (!telefone) {
        return res.status(400).json({ mensagem: 'Precisamos de pelomenos um telefone para contato, válido' });
    }
    next();
}
const VerificarCPFeEmailExistente = (req, res, next) => {
    const { cpf, email } = req.body;

    const cpfExistente = contas.find((conta) => {
        return conta.usuario.cpf === cpf
    });
    if (cpfExistente) {
        return res.status(400).json({ mensagem: "CPF já existe." })

    }
    const emailExistente = contas.find((conta) => {
        return conta.usuario.email === email
    });
    if (emailExistente) {
        return res.status(400).json({ mensagem: "E-mail já existe." });
    }
    next();
}

const verificarDadosParaTransferencia = (req, res, next) => {
    const { numero_conta_origem, valor, senha, numero_conta_destino } = req.body
    if (!Number(numero_conta_destino)) {
        return res.status(400).json({ mensagem: "O número da conta é invalido" })
    }
    if (!Number(valor)) {
        return res.status(400).json({ mensagem: "O valor está inválido, verifique seu bolso se não foi asaltada" })
    }
    if (!Number(numero_conta_origem)) {
        return res.status(400).json({ mensagem: "Preciso da conta de origem, ou posso creditar na minha?" })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: "Informe a senha" })
    }
    next();
}

const validarParametrosdeQueryExtrato = (req, res, next) => {
    const { numero_conta, senha } = req.query
    if (!numero_conta) {
        return res.status(400).json({ mensagem: "O número da conta  é invalido, verifique seus dados e tente novamente" })
    }
    const conta = contas.find(conta => conta.id === Number(numero_conta));

    if (!conta) {
        return res.status(400).json({ mensagem: "O número da conta é invalido" })
    }
    if (senha !== conta.usuario.senha) {
        return res.status(400).json({ mensagem: "Senha Inválida" })
    }
    next();
}
module.exports = {
    validaSenha,
    validarCamposObrigatorios,
    VerificarCPFeEmailExistente,
    verificarDadosParaTransferencia,
    validarParametrosdeQueryExtrato
}