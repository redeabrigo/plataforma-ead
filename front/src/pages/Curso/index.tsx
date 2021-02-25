import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import arrayMove from 'array-move';
import { FiArrowDown, FiArrowUp, FiMinusCircle } from 'react-icons/fi';
import { useMutation, useQuery } from '@apollo/client';

import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import { VER_CURSO, DELETE_MODULO } from './apolloQueries';

import CursoForm from '../../components/CursoForm';
import AulaForm from '../../components/AulaForm';
import Navbar from '../../components/Navbar';
import TopMenu from '../../components/TopMenu';
import NavbarDesktop from '../../components/NavbarDesktop';
import CursoPerguntaForm from '../../components/CursoPerguntaForm';
import ModuleForm from '../../components/ModuleForm';
import Popup from '../../components/Popup';

import { Container, CursoContent, ListaModulos, Modulo, AulasContainer } from './styles';

interface IRouteParams {
  id: string;
}

export interface IAulasData {
  id: number;
  nome: string;
  video_url: string;
  duracao: number;
}

export interface IPerguntasData {
  id: number;
  enunciado: string;
  escolha_1: string;
  escolha_2: string;
  escolha_3: string;
  escolha_4: string;
  resposta_certa: "1" | "2" | "3" | "4";
  justificativa: string;
}

export interface IModuloContent {
  content_is: 'aula' | 'pergunta';
  content_data: IAulasData | IPerguntasData;
}

export interface IModuloData {
  id: string;
  nome: string;
  content: IModuloContent[]
  aulas: {
    id: string;
    nome: string;
    ordem: number;
  }[];
  perguntas: {
    id: string;
    enunciado: string;
    ordem: number;
  }[];
}

export interface ICursoData {
  id: number;
  nome: string;
  descricao: string;
  modulos: IModuloData[];
}

export interface ICursoGQL {
  verCurso: {
    curso: {
      id: string;
      nome: string;
      descricao: string;
      modulos: IModuloData[];
    }
  }
}

const Curso: React.FC = () => {
  const { id } = useParams<IRouteParams>();
  const [isModuleFormVisible, setIsModuleFormVisible] = useState(false);
  const [isAulaFormVisible, setIsAulaFormVisible] = useState(false);
  const [isPerguntaFormVisible, setIsPerguntaFormVisible] = useState(false);
  const [isModuloPopupOpen, setIsModuloPopupOpen] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<string>();

  const [curso, setCurso] = useState<ICursoData>();
  const [selectedAula, setSelectedAula] = useState<IAulasData>();
  const [selectedPergunta, setSelectedPergunta] = useState<IPerguntasData>();
  const [selectedModulo, setSelectedModulo] = useState<IModuloData>();

  const { addToast } = useToast();

  // VER CURSO
  const { data: cursoData, refetch } = useQuery<ICursoGQL>(VER_CURSO, {
    variables: { id: id }
  });
  // DELETAR MODULO
  const [DeletarModulo] = useMutation(DELETE_MODULO, {
    onCompleted() {
      addToast({
        title: "modulo deletado com sucesso",
        type: "success"
      });
      refetch();
    },
    onError() {
      addToast({
        title: "erro ao deletar o modulo",
        type: "error"
      });
    }
  });

  const handleDeleteModule = useCallback(async (moduleId: string) => {
    DeletarModulo({
      variables: {
        id: moduleId
      }
    });
    setIsModuloPopupOpen(false);
  }, []);

  // AULA -> criar - ver - atualizar - deletar

  // PERGUNTA -> criar - ver - atualizar - deletar

  //delete pergunta
  const handleDeleteContent = useCallback((idToRemove: number) => {
    // if (curso) {
    //   const updatedCurso = curso;
    //   updatedCurso.modulos.forEach(modulo => {
    //     modulo.content = modulo.content.filter(aula => aula.content_data.id !== idToRemove);
    //   });
    //   try {
    //     api.put(`/cursos/${id}`, updatedCurso);
    //     api.delete(`/cursoperguntas/${idToRemove}`);
    //     setCurso(updatedCurso);
    //     addToast({
    //       title: 'curso atualizado',
    //       type: 'success'
    //     });
    //   } catch (err) {
    //     console.log(err);
    //     addToast({
    //       title: 'Erro ao deletar',
    //       message: 'tente novamente',
    //       type: 'success'
    //     });
    //   }
    // }
  }, [curso]);

  const handleUpdateAula = useCallback((childAula: IAulasData) => {
    // if (curso) {
    //   let currentModule = curso.modulos.find(modulo => modulo.id === currentModuleId);
    //   if (currentModule) {
    //     let todoConteudo = currentModule.content.map(content => {
    //       if (content.content_data.id === childAula.id) {
    //         content.content_data = childAula;
    //       }
    //       return content;
    //     });

    //     const updatedModules = curso.modulos.map(modulo => {
    //       if (currentModule && modulo.id === currentModule.id) {
    //         modulo.content = todoConteudo;
    //       }
    //       return modulo;
    //     });

    //     const updatedCurso = { ...curso, modulos: updatedModules };

    //     setSelectedAula(undefined);
    //     setIsAulaFormVisible(false);

    //     try {
    //       api.put(`/cursos/${id}`, updatedCurso);
    //       setCurso(updatedCurso);
    //       addToast({
    //         title: 'Curso atualizado',
    //         type: 'success'
    //       });
    //     } catch (err) {
    //       console.log(err);
    //       addToast({
    //         title: 'Erro ao atualizar curso',
    //         message: 'tente novamente',
    //         type: 'success'
    //       });
    //     }
    //   }
    // }
  }, [curso, currentModuleId]);

  const handleUpdatePergunta = useCallback((childPergunta: IPerguntasData) => {
    // if (curso) {
    //   let currentModule = curso.modulos.find(modulo => modulo.id === currentModuleId);
    //   if (currentModule) {
    //     let todoConteudo = currentModule.content.map(content => {
    //       if (content.content_data.id === childPergunta.id) {
    //         content.content_data = childPergunta;
    //       }
    //       return content;
    //     });

    //     const updatedModules = curso.modulos.map(modulo => {
    //       if (currentModule && modulo.id === currentModule.id) {
    //         modulo.content = todoConteudo;
    //       }
    //       return modulo;
    //     });

    //     const updatedCurso = { ...curso, modulos: updatedModules };

    //     setSelectedPergunta(undefined);
    //     setIsPerguntaFormVisible(false);

    //     try {
    //       api.put(`/cursos/${id}`, updatedCurso);
    //       setCurso(updatedCurso);
    //       addToast({
    //         title: 'Curso atualizado',
    //         type: 'success'
    //       });
    //     } catch (err) {
    //       console.log(err);
    //       addToast({
    //         title: 'Erro ao atualizar curso',
    //         message: 'tente novamente',
    //         type: 'success'
    //       });
    //     }
    //   }
    // }
  }, [curso, currentModuleId]);

  const handleAddNewAula = useCallback(async (moduleId: string) => {
    // if (curso) {

    //   const newAula: IAulasData = {
    //     id: Math.floor(Math.random() * Math.floor(1000)),
    //     nome: '',
    //     video_url: '',
    //     duracao: 0
    //   }
    //   setSelectedAula(newAula);
    //   setIsAulaFormVisible(true);
    //   setCurrentModuleId(moduleId);

    //   let updatedModules = curso.modulos.map(module => {
    //     if (module.id === moduleId) {
    //       module.content.push({ content_is: 'aula', content_data: newAula });
    //     }
    //     return module;
    //   });

    //   const updatedCurso = { ...curso, modulos: updatedModules };
    //   await api.put(`/cursos/${id}`, updatedCurso);
    // }
  }, [curso]);

  const handleAddNewPergunta = useCallback(async (moduleId: string) => {
    // if (curso) {
    //   const newPergunta: IPerguntasData = {
    //     id: Math.floor(Math.random() * Math.floor(1000)),
    //     enunciado: '',
    //     escolha_1: '',
    //     escolha_2: '',
    //     escolha_3: '',
    //     escolha_4: '',
    //     resposta_certa: "1",
    //     justificativa: ''
    //   }
    //   setSelectedPergunta(newPergunta);
    //   setIsPerguntaFormVisible(true);
    //   setCurrentModuleId(moduleId);

    //   let updatedModules = curso.modulos.map(module => {
    //     if (module.id === moduleId) {
    //       module.content.push({ content_is: 'pergunta', content_data: newPergunta });
    //     }
    //     return module;
    //   });

    //   const updatedCurso = { ...curso, modulos: updatedModules };
    //   await api.put(`/cursos/${id}`, updatedCurso);
    // }
  }, [curso]);

  const handleEditAula = (aula: IAulasData, moduleId: string) => {
    setCurrentModuleId(moduleId);
    setSelectedAula(aula);
    setIsAulaFormVisible(true);
  }

  const handleEditPergunta = (pergunta: IPerguntasData, moduleId: string) => {
    setCurrentModuleId(moduleId);
    setSelectedPergunta(pergunta);
    setIsPerguntaFormVisible(true);
  }

  const handleEditModulo = (modulo: IModuloData) => {
    setSelectedModulo(modulo);
    setIsModuleFormVisible(true);
  }

  const handleCreateNewModulo = () => {
    setSelectedModulo({} as IModuloData);
    setIsModuleFormVisible(true);
  }

  const handleCreateModule = useCallback(async (moduleName: string) => {
    // let modulos: IModuloData[] = [];
    // if (curso) {
    //   modulos = [...curso.modulos, {
    //     id: Math.floor(Math.random() * Math.floor(1000)),
    //     nome: moduleName,
    //     content: []
    //   }];
    //   const updatedCurso = { ...curso, modulos }

    //   setCurso(updatedCurso);
    //   await api.put(`/cursos/${id}`, updatedCurso);
    //   setIsModuleFormVisible(false);
    // }
  }, [curso]);

  const handleUpdateModule = useCallback(async (moduleId: string, moduleName: string) => {
    // if (curso) {
    //   const updatedModulos = curso.modulos.map(modulo => {
    //     if (modulo.id === moduleId) {
    //       modulo.nome = moduleName;
    //     }
    //     return modulo;
    //   });

    //   const updatedCurso = { ...curso, modulos: updatedModulos }
    //   setCurso(updatedCurso);

    //   await api.put(`/cursos/${id}`, updatedCurso);
    //   setIsModuleFormVisible(false);
    // }
  }, [curso]);



  const handleMoveContent = useCallback(async (moduloId, index, isUp) => {
    let newPosition: number;

    isUp ? newPosition = index - 1 : newPosition = index + 1;

    if (curso) {
      const updatedModulos = curso.modulos.filter(modulo => {
        if (modulo.id === moduloId) {
          modulo.content = arrayMove(modulo.content, index, newPosition);
        }
        return modulo;
      });

      const updatedCurso = {
        ...curso,
        modulos: updatedModulos
      }

      setCurso(updatedCurso);

      await api.put(`/cursos/${id}`, updatedCurso);
    }
  }, [curso, id]);

  useEffect(() => {
    api.get(`/cursos/${id}`).then(response => {
      setCurso(response.data);
    });
  }, []);

  return (
    <Container>
      <TopMenu />

      <CursoForm curso={cursoData} headingText="editar curso" />

      <CursoContent>
        <h2>módulos, aulas e perguntas</h2>
        <button className="alt" onClick={handleCreateNewModulo} >criar novo módulo</button>

        <ListaModulos>
          {cursoData && cursoData.verCurso.curso.modulos && cursoData.verCurso.curso.modulos.map(modulo => (
            <Modulo key={modulo.id}>
              <h3 onClick={() => handleEditModulo(modulo)}>{modulo.nome}</h3>
              <div>
                <button className="alt" onClick={() => handleAddNewAula(modulo.id)}>nova aula</button>
                <button className="alt" onClick={() => handleAddNewPergunta(modulo.id)}>nova pergunta</button>
                <button className="delete" onClick={() => setIsModuloPopupOpen(true)}>deletar módulo<FiMinusCircle size={16} /></button>
                <Popup isVisible={isModuloPopupOpen} onCancel={() => setIsModuloPopupOpen(false)} onFulfill={() => handleDeleteModule(modulo.id)} >
                  Tem certeza que deseja remover este módulo?
                </Popup>
              </div>
              {/* <AulasContainer>
                {modulo.content.map((content, index) => {
                  if (content.content_is === 'aula') {
                    let contentData: IAulasData = content.content_data as IAulasData;
                    return (
                      <div key={contentData.id}>
                        <aside>
                          <button onClick={() => handleMoveContent(modulo.id, index, true)}><FiArrowUp size={14} /></button>
                          <button onClick={() => handleMoveContent(modulo.id, index, false)}><FiArrowDown size={14} /></button>
                        </aside>
                        <label>aula</label>
                        <button onClick={() => handleEditAula(contentData, modulo.id)}>{contentData.nome}</button>
                        <button onClick={() => handleDeleteContent(contentData.id)}><FiMinusCircle size={24} /></button>
                      </div>
                    )
                  }

                  if (content.content_is === 'pergunta') {
                    let contentData: IPerguntasData = content.content_data as IPerguntasData;
                    return (
                      <div key={contentData.id}>
                        <aside>
                          <button onClick={() => handleMoveContent(modulo.id, index, true)}><FiArrowUp size={14} /></button>
                          <button onClick={() => handleMoveContent(modulo.id, index, false)}><FiArrowDown size={14} /></button>
                        </aside>
                        <label>pergunta</label>
                        <button onClick={() => handleEditPergunta(contentData, modulo.id)}>{contentData.enunciado}</button>
                        <button onClick={() => handleDeleteContent(contentData.id)}><FiMinusCircle size={24} /></button>
                      </div>
                    )
                  }

                })}
              </AulasContainer> */}
            </Modulo>
          ))}
        </ListaModulos>

        {isModuleFormVisible && (
          <ModuleForm modulo={selectedModulo} cursoId={id} setVisibility={setIsModuleFormVisible} reloadCurso={refetch} />
        )}

        {isAulaFormVisible && (
          <AulaForm aula={selectedAula} updateAula={handleUpdateAula} />
        )}

        {isPerguntaFormVisible && (
          <CursoPerguntaForm pergunta={selectedPergunta} updatePergunta={handleUpdatePergunta} />
        )}

      </CursoContent>

      <Navbar />
      <NavbarDesktop />
    </Container>
  );
}

export default Curso;