
let { contas } = require('../bancodedados')
let idProximacontaCriada = 1



const listarContas = (req, res) => {
    if (contas.length === 0) {
        return res.status(400).json({ "mensagem": "Não existe conta cadastrada ainda." })
    }
    return res.json(contas);
}

const CriarConta = (req, res) => {
    const { nome, data_nascimento, cpf, senha, email, telefone } = req.body;



    const novoConta = {

        id: idProximacontaCriada,
        saldo: 0,
        usuario: {
            nome, cpf, data_nascimento, telefone, email, senha
        }


    }
    contas.push(novoConta);
    idProximacontaCriada++
    return res.status(201).json(novoConta);




}

const atualizarUsuario = (req, res) => {
    const { nome, data_nascimento, cpf, senha, email, telefone } = req.body;
    const { numeroConta } = req.params

    const cpfExistente = contas.find((conta) => {
        return conta.usuario.cpf === cpf && conta.id !== Number(numeroConta);
    });
    const emailExistente = contas.find((conta) => {
        return conta.usuario.email === email && conta.id !== Number(numeroConta);
    });


    if (cpfExistente) {
        return res.status(400).json({ mensagem: "CPF já existe." })

    }
    if (emailExistente) {
        return res.status(400).json({ mensagem: "e-mail já existe." })

    }
    let contaAtualizada = contas.filter((conta) => {
        if (conta.id === Number(numeroConta)) {
            return conta.usuario = { nome, data_nascimento, cpf, senha, email, telefone }
        }
    })
    if (!contaAtualizada) {
        return res.status(400).json({ mensagem: "Não encontrado, verifique o numero e tente novamente" })
    }
    return res.status(200).send();
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params
    const conta = contas.find(conta => conta.id === Number(numeroConta));
    if (!conta) {
        return res.status(400).json({ mensagem: 'Não tem conta sua aqui para ser apagada.' })
    }
    if (conta.saldo !== 0) {
        return res.status(400).json({ mensagem: 'ainda tem dinheiro em sua conta, precisa sacar tudo antes de apagar seu usuário' })
    }
    contas = contas.filter((contaUsuario) => {
        return contaUsuario.id !== conta.id
    })
    return res.status(200).json({ mensagem: 'Conta excluida com suceso' });

}
module.exports = {
    listarContas,
    CriarConta,
    atualizarUsuario,
    excluirConta
}