const { contas, depositos, transferencias, saques } = require('../bancodedados')
const { format } = require("date-fns");



const depositar = (req, res) => {
    const { numero_conta, valor } = req.body
    const conta = contas.find(conta => conta.id === Number(numero_conta));

    if (!numero_conta) {
        return res.status(400).json({ mensagem: "O número da conta  é invalido, verifique seus dados e tente novamente" })
    }
    if (!valor) {
        return res.status(400).json({ mensagem: "Precisamos do valor a ser creditado na conta." })

    }
    if (!conta) {
        return res.status(400).json({ mensagem: "O número da conta  é invalido" })
    }
    if (valor === 0) {
        return res.status(400).json({ mensagem: " O valor do depósito não pode ser negativo" })

    }

    conta.saldo += valor

    const deposito = {
        data: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        numero_conta,
        valor: valor
    };

    depositos.push(deposito)
    return res.status(201).json({ mensagem: "Deposito efetuado com suceso" })

};
const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body
    if (!numero_conta) {
        return res.status(400).json({ mensagem: "O número da conta  é invalido, verifique seus dados e tente novamente" })
    }
    if (!valor) {
        return res.status(400).json({ mensagem: "Precisamos do valor a ser debitado da conta." })

    }
    if (valor <= 0) {
        return res.status(400).json({ mensagem: " O valor do saque não pode ser negativo" })

    }
    const conta = contas.find(conta => conta.id === Number(numero_conta));

    if (!conta) {
        return res.status(400).json({ mensagem: "O número da conta é invalido" })
    }
    if (senha !== conta.usuario.senha) {
        return res.status(400).json({ mensagem: "Senha Inválida" })
    }
    if (conta.saldo < valor) {
        return res.status(400).json({ mensagem: "saldo insufuiciente" })
    }

    conta.saldo -= valor
    const saque = {
        data: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        numero_conta,
        valor: valor
    };

    saques.push(saque)
    return res.status(200).json({ mensagem: `o saque de ${valor} foi efetuado com sucesso` })

};
const transferir = (req, res) => {
    const { numero_conta_origem, valor, senha, numero_conta_destino } = req.body
    const contaOrigem = contas.find(conta => conta.id === Number(numero_conta_origem));
    const contaDestino = contas.find(conta => conta.id === Number(numero_conta_destino));

    if (!contaOrigem) {
        return res.status(400).json({ mensagem: "O número da conta de origem é invalido" })
    }
    if (!contaDestino) {
        return res.status(400).json({ mensagem: "O número da conta de destino está invalido" })
    }
    if (senha !== contaOrigem.usuario.senha) {
        return res.status(400).json({ mensagem: "Senha Inválida" })
    }
    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: "saldo insufuiciente" })
    }
    contaOrigem.saldo -= valor
    contaDestino.saldo += valor

    const registroDaTransacao = {
        data: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }
    transferencias.push(registroDaTransacao);
    return res.status(200).json({ mensagem: "Transação realizada com sucesso" })
};
const saldo = (req, res) => {
    const { numero_conta } = req.query

    const conta = contas.find(conta => conta.id === Number(numero_conta));

    return res.status(200).json({ saldo: conta.saldo })
}
const extrato = (req, res) => {
    const { numero_conta, senha } = req.query

    const conta = contas.find(conta => conta.id === Number(numero_conta));
    const extratoTotal = {
        depositos: depositos.filter(deposito => {
            return deposito.numero_conta === conta.id

        }),
        saques: saques.filter(saque => {
            return saque.numero_conta === conta.id
        }),
        transfereciasEnviadas: transferencias.filter(transferencia => {
            return transferencia.numero_conta_origem === conta.id
        }),
        transferenciasRecebidas: transferencias.filter(transferencia => {
            return transferencia.numero_conta_destino === conta.id
        }),
    }
    return res.status(200).json(extratoTotal);



}

module.exports = {
    depositar, sacar, transferir, saldo, extrato
}