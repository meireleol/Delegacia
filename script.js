// ==========================================
// SISTEMA DE DENÚNCIAS ANÔNIMAS
// JAVASCRIPT
// ==========================================


// ==========================================
// ARMAZENAMENTO
// ==========================================

const STORAGE_KEY = "denunciasAnonimas";


function obterDenuncias() {

    return JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];

}


function salvarDenuncias(denuncias) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(denuncias)
    );

}


// ==========================================
// GERAR PROTOCOLO
// ==========================================

function gerarProtocolo() {

    const numero = Math.floor(
        100000 + Math.random() * 900000
    );

    return `DEN-${numero}`;

}


// ==========================================
// REGISTRAR DENÚNCIA
// ==========================================

const denunciaForm =
    document.getElementById("denunciaForm");


if (denunciaForm) {

    denunciaForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


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
                ).value;


            const descricao =
                document.getElementById(
                    "descricao"
                ).value;


            const observacoes =
                document.getElementById(
                    "observacoes"
                ).value;


            const anonima =
                document.getElementById(
                    "anonima"
                ).checked;


            const protocolo =
                gerarProtocolo();


            const novaDenuncia = {

                protocolo: protocolo,

                categoria: categoria,

                data: data,

                local: local,

                descricao: descricao,

                observacoes: observacoes,

                anonima: anonima,

                status: "Recebida",

                criadaEm:
                    new Date().toISOString()

            };


            const denuncias =
                obterDenuncias();


            denuncias.push(
                novaDenuncia
            );


            salvarDenuncias(
                denuncias
            );


            const box =
                document.getElementById(
                    "protocoloBox"
                );


            box.classList.remove(
                "hidden"
            );


            box.innerHTML = `

                <h2>
                    Denúncia registrada!
                </h2>

                <p>
                    Guarde o protocolo abaixo
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

                <a
                    href="acompanhar.html"
                    class="btn btn-primary"
                >
                    Acompanhar denúncia
                </a>

            `;


            denunciaForm.reset();


            document.getElementById(
                "anonima"
            ).checked = true;


            window.scrollTo({

                top:
                    document.body.scrollHeight,

                behavior: "smooth"

            });

        }
    );

}


// ==========================================
// CONSULTAR DENÚNCIA
// ==========================================

const consultaForm =
    document.getElementById(
        "consultaForm"
    );


if (consultaForm) {

    consultaForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const protocolo =
                document
                    .getElementById(
                        "protocolo"
                    )
                    .value
                    .trim()
                    .toUpperCase();


            const denuncias =
                obterDenuncias();


            const denuncia =
                denuncias.find(
                    item =>
                        item.protocolo ===
                        protocolo
                );


            const resultado =
                document.getElementById(
                    "resultadoConsulta"
                );


            if (!denuncia) {

                resultado.innerHTML = `

                    <div class="alert">

                        ❌ Nenhuma denúncia
                        encontrada para o
                        protocolo informado.

                    </div>

                `;

                return;
            }


            resultado.innerHTML = `

                <div class="form-card">

                    <h2>
                        Denúncia encontrada
                    </h2>

                    <br>

                    <p>
                        <strong>
                            Protocolo:
                        </strong>

                        ${denuncia.protocolo}
                    </p>


                    <p>
                        <strong>
                            Categoria:
                        </strong>

                        ${denuncia.categoria}
                    </p>


                    <p>
                        <strong>
                            Data:
                        </strong>

                        ${denuncia.data}
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
                            Status:
                        </strong>
                    </p>


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

                </div>

            `;

        }
    );

}


// ==========================================
// STATUS
// ==========================================

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

    }


    return `

        <span
            class="status ${classe}"
        >
            ${status}
        </span>

    `;

}


// ==========================================
// DASHBOARD
// ==========================================

function carregarDashboard() {

    const tabela =
        document.getElementById(
            "tabelaDenuncias"
        );


    if (!tabela) {

        return;

    }


    atualizarEstatisticas();

    renderizarTabela();

}


// ==========================================
// ESTATÍSTICAS
// ==========================================

function atualizarEstatisticas() {

    const denuncias =
        obterDenuncias();


    const total =
        denuncias.length;


    const analise =
        denuncias.filter(
            d =>
                d.status === "Em análise"
        ).length;


    const investigacao =
        denuncias.filter(
            d =>
                d.status ===
                "Em investigação"
        ).length;


    const finalizadas =
        denuncias.filter(
            d =>
                d.status ===
                "Finalizada"
        ).length;


    document.getElementById(
        "totalDenuncias"
    ).textContent = total;


    document.getElementById(
        "emAnalise"
    ).textContent = analise;


    document.getElementById(
        "investigacao"
    ).textContent =
        investigacao;


    document.getElementById(
        "finalizadas"
    ).textContent =
        finalizadas;

}


// ==========================================
// TABELA DE DENÚNCIAS
// ==========================================

function renderizarTabela() {

    const tabela =
        document.getElementById(
            "tabelaDenuncias"
        );


    const busca =
        document
            .getElementById(
                "busca"
            )
            ?.value
            .toUpperCase() || "";


    const filtro =
        document
            .getElementById(
                "filtroStatus"
            )
            ?.value || "";


    let denuncias =
        obterDenuncias();


    denuncias =
        denuncias.filter(
            denuncia => {

                const correspondeBusca =
                    denuncia.protocolo
                        .toUpperCase()
                        .includes(busca);


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


    tabela.innerHTML = "";


    if (denuncias.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td colspan="5">

                    Nenhuma denúncia
                    encontrada.

                </td>

            </tr>

        `;

        return;
    }


    denuncias.forEach(
        denuncia => {

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
                    ${denuncia.data}
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
                        class="action-btn"
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


// ==========================================
// ALTERAR STATUS
// ==========================================

function alterarStatus(protocolo) {

    const denuncias =
        obterDenuncias();


    const denuncia =
        denuncias.find(
            d =>
                d.protocolo ===
                protocolo
        );


    if (!denuncia) {

        return;

    }


    const novoStatus =
        prompt(`Digite o novo status:

Recebida
Em análise
Em investigação
Finalizada`);


    const statusValidos = [

        "Recebida",

        "Em análise",

        "Em investigação",

        "Finalizada"

    ];


    if (
        !statusValidos.includes(
            novoStatus
        )
    ) {

        alert(
            "Status inválido."
        );

        return;

    }


    denuncia.status =
        novoStatus;


    salvarDenuncias(
        denuncias
    );


    atualizarEstatisticas();

    renderizarTabela();

}


// ==========================================
// EXCLUIR DENÚNCIA
// ==========================================

function excluirDenuncia(protocolo) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta denúncia?"
        );


    if (!confirmar) {

        return;

    }


    let denuncias =
        obterDenuncias();


    denuncias =
        denuncias.filter(
            d =>
                d.protocolo !==
                protocolo
        );


    salvarDenuncias(
        denuncias
    );


    atualizarEstatisticas();

    renderizarTabela();

}


// ==========================================
// FILTROS
// ==========================================

document
    .getElementById("busca")
    ?.addEventListener(
        "input",
        renderizarTabela
    );


document
    .getElementById("filtroStatus")
    ?.addEventListener(
        "change",
        renderizarTabela
    );


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    carregarDashboard
);
