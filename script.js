// =========================================
// SISTEMA WEB DE DENÚNCIAS ANÔNIMAS
// JAVASCRIPT
// =========================================


// =========================================
// CONFIGURAÇÃO
// =========================================

const STORAGE_KEY = "denunciasAnonimas";


// =========================================
// FUNÇÕES DE ARMAZENAMENTO
// =========================================

function obterDenuncias() {

    const dados =
        localStorage.getItem(STORAGE_KEY);

    if (!dados) {
        return [];
    }

    return JSON.parse(dados);
}


function salvarDenuncias(denuncias) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(denuncias)
    );

}


// =========================================
// GERAR PROTOCOLO
// =========================================

function gerarProtocolo() {

    const numero =
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    return `DEN-${numero}`;

}


// =========================================
// REGISTRO DE DENÚNCIA
// =========================================

const denunciaForm =
    document.getElementById(
        "denunciaForm"
    );


if (denunciaForm) {


    denunciaForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // Pegar dados do formulário
            const categoria =
                document.getElementById(
                    "categoria"
                ).value;


            const data =
                document.getElementById(
                    "data"
                ).value;


            const local =
                document.getElementById(
                    "local"
                ).value.trim();


            const descricao =
                document.getElementById(
                    "descricao"
                ).value.trim();


            const observacoes =
                document.getElementById(
                    "observacoes"
                ).value.trim();


            const anonima =
                document.getElementById(
                    "anonima"
                ).checked;


            // Gerar protocolo
            const protocolo =
                gerarProtocolo();


            // Criar denúncia
            const novaDenuncia = {

                protocolo:
                    protocolo,

                categoria:
                    categoria,

                data:
                    data,

                local:
                    local,

                descricao:
                    descricao,

                observacoes:
                    observacoes,

                anonima:
                    anonima,

                status:
                    "Recebida",

                criadaEm:
                    new Date().toISOString()

            };


            // Buscar denúncias existentes
            const denuncias =
                obterDenuncias();


            // Adicionar nova denúncia
            denuncias.push(
                novaDenuncia
            );


            // Salvar
            salvarDenuncias(
                denuncias
            );


            // Mostrar protocolo
            const box =
                document.getElementById(
                    "protocoloBox"
                );


            box.classList.remove(
                "hidden"
            );


            box.innerHTML = `

                <h2>
                    ✅ Denúncia registrada!
                </h2>

                <p>
                    Sua denúncia foi registrada
                    com sucesso.
                </p>

                <p>
                    Guarde o número de protocolo
                    para acompanhar o andamento:
                </p>

                <h3>
                    ${protocolo}
                </h3>

                <p>
                    <strong>
                        Não perca este número.
                    </strong>
                </p>

                <br>

                <a
                    href="acompanhar.html"
                    class="btn btn-primary"
                >
                    🔎 Acompanhar Denúncia
                </a>

            `;


            // Limpar formulário
            denunciaForm.reset();


            // Manter anonimato marcado
            document.getElementById(
                "anonima"
            ).checked = true;


            // Ir para protocolo
            box.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}


// =========================================
// CONSULTAR DENÚNCIA
// =========================================

const consultaForm =
    document.getElementById(
        "consultaForm"
    );


if (consultaForm) {


    consultaForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // Pegar protocolo
            const protocolo =
                document
                    .getElementById(
                        "protocolo"
                    )
                    .value
                    .trim()
                    .toUpperCase();


            // Buscar denúncias
            const denuncias =
                obterDenuncias();


            // Encontrar denúncia
            const denuncia =
                denuncias.find(
                    function(item) {

                        return (
                            item.protocolo ===
                            protocolo
                        );

                    }
                );


            const resultado =
                document.getElementById(
                    "resultadoConsulta"
                );


            // Caso não encontre
            if (!denuncia) {

                resultado.innerHTML = `

                    <div class="alert">

                        ❌

                        <strong>
                            Denúncia não encontrada.
                        </strong>

                        <br>

                        Verifique o número do
                        protocolo e tente novamente.

                    </div>

                `;

                return;
            }


            // Mostrar resultado
            resultado.innerHTML = `

                <div class="form-card">

                    <span class="badge">
                        DENÚNCIA ENCONTRADA
                    </span>

                    <h2 style="margin-top: 15px;">
                        Protocolo ${denuncia.protocolo}
                    </h2>

                    <br>

                    <p>
                        <strong>
                            Categoria:
                        </strong>

                        ${denuncia.categoria}
                    </p>


                    <p>
                        <strong>
                            Data da ocorrência:
                        </strong>

                        ${formatarData(
                            denuncia.data
                        )}
                    </p>


                    <p>
                        <strong>
                            Local:
                        </strong>

                        ${denuncia.local}
                    </p>


                    <br>


                    <p>
                        <strong>
                            Status atual:
                        </strong>
                    </p>

                    <br>

                    ${criarStatus(
                        denuncia.status
                    )}


                    <br><br>


                    <p>
                        <strong>
                            Descrição:
                        </strong>
                    </p>


                    <p>
                        ${denuncia.descricao}
                    </p>


                    ${
                        denuncia.observacoes
                        ?
                        `
                        <br>

                        <p>
                            <strong>
                                Informações adicionais:
                            </strong>
                        </p>

                        <p>
                            ${denuncia.observacoes}
                        </p>
                        `
                        :
                        ""
                    }

                </div>

            `;

        }
    );

}


// =========================================
// FORMATAR DATA
// =========================================

function formatarData(data) {

    if (!data) {
        return "-";
    }

    const partes =
        data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// =========================================
// CRIAR STATUS
// =========================================

function criarStatus(status) {

    let classe = "";


    switch (status) {

        case "Recebida":

            classe =
                "status-recebida";

            break;


        case "Em análise":

            classe =
                "status-analise";

            break;


        case "Em investigação":

            classe =
                "status-investigacao";

            break;


        case "Finalizada":

            classe =
                "status-finalizada";

            break;


        default:

            classe = "";

    }


    return `

        <span class="status ${classe}">
            ${status}
        </span>

    `;

}


// =========================================
// DASHBOARD
// =========================================

function carregarDashboard() {

    const tabela =
        document.getElementById(
            "tabelaDenuncias"
        );


    // Se não estiver na página
    // do administrador, não faz nada.
    if (!tabela) {

        return;

    }


    atualizarEstatisticas();

    renderizarTabela();

}


// =========================================
// ESTATÍSTICAS
// =========================================

function atualizarEstatisticas() {

    const denuncias =
        obterDenuncias();


    const total =
        denuncias.length;


    const recebidas =
        denuncias.filter(
            function(denuncia) {

                return (
                    denuncia.status ===
                    "Recebida"
                );

            }
        ).length;


    const investigacao =
        denuncias.filter(
            function(denuncia) {

                return (
                    denuncia.status ===
                    "Em investigação"
                );

            }
        ).length;


    const finalizadas =
        denuncias.filter(
            function(denuncia) {

                return (
                    denuncia.status ===
                    "Finalizada"
                );

            }
        ).length;


    document.getElementById(
        "totalDenuncias"
    ).textContent =
        total;


    document.getElementById(
        "recebidas"
    ).textContent =
        recebidas;


    document.getElementById(
        "investigacao"
    ).textContent =
        investigacao;


    document.getElementById(
        "finalizadas"
    ).textContent =
        finalizadas;

}


// =========================================
// RENDERIZAR TABELA
// =========================================

function renderizarTabela() {

    const tabela =
        document.getElementById(
            "tabelaDenuncias"
        );


    if (!tabela) {
        return;
    }


    const campoBusca =
        document.getElementById(
            "busca"
        );


    const campoFiltro =
        document.getElementById(
            "filtroStatus"
        );


    const busca =
        campoBusca
        ?
        campoBusca.value
            .trim()
            .toUpperCase()
        :
        "";


    const filtro =
        campoFiltro
        ?
        campoFiltro.value
        :
        "";


    let denuncias =
        obterDenuncias();


    // Filtrar
    denuncias =
        denuncias.filter(
            function(denuncia) {


                const correspondeBusca =
                    denuncia.protocolo
                        .toUpperCase()
                        .includes(
                            busca
                        );


                const correspondeStatus =
                    !filtro ||
                    denuncia.status ===
                    filtro;


                return (
                    correspondeBusca &&
                    correspondeStatus
                );

            }
        );


    // Limpar tabela
    tabela.innerHTML = "";


    // Nenhuma denúncia
    if (denuncias.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center;"
                >

                    Nenhuma denúncia encontrada.

                </td>

            </tr>

        `;

        return;
    }


    // Criar linhas
    denuncias.forEach(
        function(denuncia) {


            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td>

                    <strong>
                        ${denuncia.protocolo}
                    </strong>

                </td>


                <td>
                    ${denuncia.categoria}
                </td>


                <td>
                    ${formatarData(
                        denuncia.data
                    )}
                </td>


                <td>

                    ${criarStatus(
                        denuncia.status
                    )}

                </td>


                <td>

                    <button
                        class="action-btn"
                        onclick="alterarStatus('${denuncia.protocolo}')"
                    >
                        Alterar
                    </button>


                    <button
                        class="action-btn delete-btn"
                        onclick="excluirDenuncia('${denuncia.protocolo}')"
                    >
                        Excluir
                    </button>

                </td>

            `;


            tabela.appendChild(
                linha
            );

        }
    );

}


// =========================================
// ALTERAR STATUS
// =========================================

function alterarStatus(protocolo) {

    const denuncias =
        obterDenuncias();


    const denuncia =
        denuncias.find(
            function(item) {

                return (
                    item.protocolo ===
                    protocolo
                );

            }
        );


    if (!denuncia) {

        alert(
            "Denúncia não encontrada."
        );

        return;

    }


    const novoStatus =
        prompt(
            `Alterar status da denúncia ${protocolo}.

Digite exatamente uma das opções:

Recebida
Em análise
Em investigação
Finalizada`
        );


    // Usuário cancelou
    if (novoStatus === null) {

        return;

    }


    const status =
        novoStatus.trim();
