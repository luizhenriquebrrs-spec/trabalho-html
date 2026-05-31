// funcoes em javascript do trabalho de viagens

var valorPacote = 0;

// funcao que roda na pagina de destinos.html ao clicar no comprar
function comprar(nomeDestino, preco) {
    // envia as informacoes do pacote pela url para a pagina de orcamento
    window.location.href = "orcamento.html?destino=" + encodeURIComponent(nomeDestino) + "&preco=" + preco;
}

// executa ao carregar qualquer uma das paginas
document.addEventListener("DOMContentLoaded", function() {
    // verifica se estamos na pagina de orcamento.html (se o form existe)
    var formulario = document.getElementById("form_orc");
    
    if (formulario) {
        // pega os dados que vieram na url caso o usuario tenha vindo do clique de comprar
        var urlParams = new URLSearchParams(window.location.search);
        var destinoUrl = urlParams.get("destino");
        var precoUrl = urlParams.get("preco");
        
        if (destinoUrl && precoUrl) {
            // preenche o select
            var select = document.getElementById("destino");
            select.value = destinoUrl;
            
            // define o valor global do pacote vindo da url
            valorPacote = parseFloat(precoUrl);
            
            // roda a simulacao
            atualizarValores();
        }
    }
});

// funcao para calcular as parcelas e desconto do cupom
function atualizarValores() {
    var dest = document.getElementById("destino").value;
    var boxSimulador = document.getElementById("box-simulador");
    
    // se nao escolheu destino nao mostra a simulacao
    if (dest === "") {
        boxSimulador.style.display = "none";
        return;
    }
    
    // atualiza o valor baseado no destino caso o usuario mude manualmente pelo select
    if (dest === "Rio de Janeiro") valorPacote = 990;
    if (dest === "Gramado") valorPacote = 1500;
    if (dest === "Paris") valorPacote = 5900;
    
    var total = valorPacote;
    var parcelas = total / 10;
    
    // exibe a caixa de simulacao e insere os valores na tela
    boxSimulador.style.display = "block";
    document.getElementById("simular-valor-original").innerText = total.toFixed(2).replace(".", ",");
    document.getElementById("simular-parcelas").innerText = parcelas.toFixed(2).replace(".", ",");
}

// funcao de validacao do formulario antes de enviar
function validarFormulario(event) {
    event.preventDefault();
    
    var nome = document.getElementById("nome").value;
    var email = document.getElementById("email").value;
    var dest = document.getElementById("destino").value;
    
    // verifica se o nome esta vazio
    if (nome.trim() == "") {
        alert("Por favor, preencha o seu nome.");
        return false;
    }
    
    // validacao simples de email
    if (email.trim() == "" || email.indexOf("@") == -1) {
        alert("Por favor, insira um e-mail valido.");
        return false;
    }
    
    // verifica se escolheu o destino
    if (dest == "") {
        alert("Por favor, selecione um destino de interesse.");
        return false;
    }

    // mensagem de sucesso final
    alert("Mensagem enviada com sucesso! Obrigado pelo contato, " + nome + ".");
    
    // reseta o formulario e esconde o simulador
    document.getElementById("form_orc").reset();
    document.getElementById("box-simulador").style.display = "none";
    valorPacote = 0;
    
    // depois de enviar com sucesso, volta pra home do site
    window.location.href = "index.html";
    return true;
}
