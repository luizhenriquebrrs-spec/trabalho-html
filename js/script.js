// funcoes em javascript do trabalho de viagens
// agência fortaleza - simulador e validador de orcamento para pacotes 2026

var val_pacote = 0;
var TAXA_EMBARQUE = 50.00; // taxa obrigatoria cobrada pela agencia em todos os pacotes

// funcao de compra que cria a URL com dados do destino para o formulario
function comprar(nomeDestino, preco) {
    try {
        if (!nomeDestino || preco <= 0) {
            throw new Error("Dados do destino invalidos para compra.");
        }
        // redireciona o usuario enviando as variaveis de preco e destino pela URL
        window.location.href = "orcamento.html?destino=" + encodeURIComponent(nomeDestino) + "&preco=" + preco;
    } catch (erro) {
        console.error("erro no redirecionamento: " + erro.message);
        alert("Nao foi possivel processar a escolha do destino. Tente novamente.");
    }
}

// listener que monitora a inicializacao da pagina de orcamento
document.addEventListener("DOMContentLoaded", function() {
    var formOrcamento = document.getElementById("form_orc");
    
    // verifica se o formulario de orcamento existe na pagina atual
    if (formOrcamento) {
        var urlParams = new URLSearchParams(window.location.search);
        var destinoUrl = urlParams.get("destino");
        var precoUrl = urlParams.get("preco");
        
        if (destinoUrl && precoUrl) {
            var select = document.getElementById("destino");
            select.value = destinoUrl;
            
            val_pacote = parseFloat(precoUrl);
            
            // executa os calculos iniciais com os dados da url
            atualizarValores();
        }
    }
});

// formata valores para reais de forma manual sem usar bibliotecas prontas do sistema
function formatarDinheiro(valor) {
    // arredonda para duas casas decimais
    var valorArredondado = Math.round(valor * 100) / 100;
    var partes = valorArredondado.toString().split(".");
    var reais = partes[0];
    var centavos = partes.length > 1 ? partes[1] : "00";
    
    // garante que os centavos sempre tenham 2 digitos
    if (centavos.length === 1) {
        centavos += "0";
    }
    
    return reais + "," + centavos;
}

// calcula e atualiza o simulador financeiro na tela
function atualizarValores() {
    var dest_sel = document.getElementById("destino").value;
    var box_financas = document.getElementById("box-simulador");
    
    if (dest_sel === "") {
        box_financas.style.display = "none";
        return;
    }
    
    // precos fixos definidos pela diretoria da agencia fortaleza para a temporada 2026
    if (dest_sel === "Rio de Janeiro") val_pacote = 990.00;
    if (dest_sel === "Gramado") val_pacote = 1500.00;
    if (dest_sel === "Paris") val_pacote = 5900.00;
    
    // calculo da regra de negocio: valor total soma a taxa de embarque obrigatoria
    var total_final = val_pacote + TAXA_EMBARQUE;
    var valor_parcela = total_final / 10;
    
    // bloco de atualizacao da interface
    try {
        box_financas.style.display = "block";
        document.getElementById("simular-valor-original").innerText = formatarDinheiro(total_final);
        document.getElementById("simular-parcelas").innerText = formatarDinheiro(valor_parcela);
    } catch (e) {
        console.warn("erro ao renderizar simulador na tela: " + e.message);
    }
}

// validacoes de seguranca e integridade do formulario
function validarFormulario(event) {
    event.preventDefault();
    
    var txt_nome = document.getElementById("nome").value;
    var userEmail = document.getElementById("email").value;
    var dest_sel = document.getElementById("destino").value;
    
    // regra de negocio: o passageiro precisa preencher nome e sobrenome para emissao do bilhete
    var nomeDividido = txt_nome.trim().split(" ");
    if (nomeDividido.length < 2 || nomeDividido[0].length < 2) {
        alert("erro de validacao: Insira seu nome completo (Nome e Sobrenome) para emissao do bilhete aereo.");
        return false;
    }
    
    // validacao de email basica obrigatoria
    if (userEmail.trim() === "" || userEmail.indexOf("@") === -1) {
        alert("erro de validacao: Insira um e-mail valido.");
        return false;
    }
    
    // impede emails de teste comuns de passarem para o banco da agencia
    var emailBloqueado = userEmail.toLowerCase();
    if (emailBloqueado.includes("teste@") || emailBloqueado.includes("admin@") || emailBloqueado.includes("email.com")) {
        alert("erro de negocio: E-mails de teste ou temporarios nao sao aceitos pelo sistema da agencia.");
        return false;
    }
    
    if (dest_sel === "") {
        alert("erro de validacao: Escolha o seu destino de viagem.");
        return false;
    }

    // confirmacao de dados salvos
    alert("Orcamento enviado! Obrigado, " + txt_nome + ". Nossa equipe da Agencia Fortaleza entrara em contato no email: " + userEmail);
    
    // limpa o formulario e retorna a home
    document.getElementById("form_orc").reset();
    box_financas = document.getElementById("box-simulador");
    if (box_financas) box_financas.style.display = "none";
    val_pacote = 0;
    
    window.location.href = "index.html";
    return true;
}
