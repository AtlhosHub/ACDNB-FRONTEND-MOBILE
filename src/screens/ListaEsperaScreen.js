import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  useWindowDimensions,
} from "react-native";
import Button from "../components/Button";
import Label from "../components/Label";
import { ImageBackground, TextInput } from "react-native";
import AppHeader from "../components/AppHeader";
import {listaMock} from '../mocks/listaMock';

const ENDPOINTLISTAESPERA = "http/";
const REGISTROSPORPAGINA = 10;
const normalizarRegistro = (registro, indice) => ({
  id: String(registro.id ?? registro.alunoId ?? indice + 1),
  nomeAluno: String(
    registro.nomeAluno ?? registro.nome ?? registro.nomeEstudante ?? "-",
  ),
  dataContato: String(
    registro.dataContato ?? registro.contatoData ?? registro.dataAluno ?? "-",
  ),
  horarioPreferencia: String(
    registro.horarioPreferencia ??
      registro.horario ??
      registro.preferenciaAluno ??
      "-",
  ),
});

const listaEsperaScreen = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const scale = (size) => (screenWidth / 375) * size;

  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [usandoMock, setUsandoMock] = useState(false);
  const [textoBusca, setTextoBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    const carregarListaEspera = async () => {
      try {
        const resposta = await fetch(ENDPOINTLISTAESPERA);

        if (!resposta.ok) {
          throw new Error("Erro ao carregar lista de espera");
        }

        const dados = await resposta.json();
        const listaSegura = Array.isArray(dados) ? dados : dados?.itens;

        if (!Array.isArray(listaSegura)) {
          throw new Error("Formato de resposta inválido");
        }

        setRegistros(listaSegura.map(normalizarRegistro));
        setUsandoMock(false);
      } catch (erro) {
        setRegistros(listaMock);
        setUsandoMock(true);
      } finally {
        setCarregando(false);
      }
    };
    carregarListaEspera();
  }, []);

  const colunas = useMemo(
    () => [
      { key: "nomeAluno", label: "Nome", flex: 2.2, align: "left" },
      {
        key: "dataContato",
        label: "Data de Contato",
        flex: 1.2,
        align: "center",
      },
      {
        key: "horarioPreferencia",
        label: "Horario de Preferencia",
        flex: 1.1,
        align: "center",
      },
    ],
    [],
  );

  const registrosFiltrados = useMemo(() => {
    const consultaNormalizada = textoBusca.trim().toLowerCase();

    return registros.filter((registros) =>
      registros.nomeAluno.toLowerCase().includes(consultaNormalizada),
    );
  },[registros, textoBusca]);

  const totalPaginas = Math.max(1,Math.ceil(registrosFiltrados.length/REGISTROSPORPAGINA));

  useEffect(()=> {setPaginaAtual(1)},[textoBusca]);

  useEffect(()=> {
    if (paginaAtual>totalPaginas) {
        setPaginaAtual(totalPaginas);
    }
  },[paginaAtual, totalPaginas]);

  const inicioPagina = (paginaAtual-1)*REGISTROSPORPAGINA;

  const registrosPagina = registrosFiltrados.slice(inicioPagina, inicioPagina+REGISTROSPORPAGINA);

  const linhasVazias = Math.max(0, REGISTROSPORPAGINA-registrosPagina.length);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f3f9f9',
      }}
    >
      <AppHeader
        subtitulo={'Lista de Espera'}
        onBackPress={() => console.log('voltar pressionado')}
      />
    </View>
  );
};

export default listaEsperaScreen;
