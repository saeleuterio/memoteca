import ui from "./ui.js"
import api from "./api.js"

const regexConteudo = /^[A-Za-z\s]{3,}$/

function validarConteudo(conteudo) {
  return regexConteudo.test(conteudo)
}

const regexAutoria = /^[a-zA-Z]{3,15}$/

function validarAutoria(autoria) {
  return regexAutoria.test(autoria)
}

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarPensamentos()

  const formularioPensamento = document.getElementById("pensamento-form")
  const botaoCancelar = document.getElementById("botao-cancelar")
  const inputBusca = document.getElementById("campo-busca")

  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario)
  botaoCancelar.addEventListener("click", manipularCancelamento)
  inputBusca.addEventListener("input", manipularBusca)
})

async function manipularSubmissaoFormulario(event) {
  event.preventDefault()
  const id = document.getElementById("pensamento-id").value
  const conteudo = document.getElementById("pensamento-conteudo").value
  const autoria = document.getElementById("pensamento-autoria").value
  const data = document.getElementById("pensamento-data").value

  if (!validarConteudo(conteudo)) {
    alert("É permitida a inclusão de letras e espaços com no mínimo 3 caracteres.")
    return
  }

  if (!validarAutoria(autoria)) {
    alert("É permitida a inclusão de letras e entre 3 e 15 caracteres sem espaços")
    return
  }

  if (!validarData(data)) {
    alert ("Não é permitido o cadastro de datas futuras")
  }

  try { 
    if(id) {
      await api.editarPensamento({ id, conteudo, autoria, data })
    } else {
      await api.salvarPensamento({ conteudo, autoria, data })
    }
    ui.renderizarPensamentos()
  }
  catch {
    alert("Erro ao salvar pensamento")
  }
}

function manipularCancelamento() {
  ui.limparFormulario()
}

async function manipularBusca() {
  const termoBusca = document.getElementById("campo-busca").value
  try {
    const pensamentosFiltrados = await api.buscarPensamentosPorTermo(termoBusca)
    ui.renderizarPensamentos(pensamentosFiltrados)
    } catch (error) {
    alert ("Erro ao realizar busca")
  }
}

function validarData(data) {
  const dataAtual = new Date()
  const dataInserida = new Date(data)
  return dataInserida <= dataAtual
}