import Head from "next/head";
import { useEffect, useState } from "react";
import { createContact, deleteContact, getContacts, updateContact } from "@/utils/fetch-api";
import { Contact } from "@/types/contacts";
import { Modal, ModalBody, ModalDialog, ModalHeader, ModalTitle } from "react-bootstrap";

export default function Home() {
  const [contacts, setContacts] = useState<Contact[] | undefined>(undefined);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [ativo, setAtivo] = useState("Sim");
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [salvarIsDisabled, setSalvarIsDisabled] = useState(true);
  const [editarIsDisabled, setEditarIsDisabled] = useState(true);
  const [id, setId] = useState(0);
  const [type, setType] = useState<"salvar" | "editar">("salvar");
  const [show, setShow] = useState<boolean>(false);
  const [displaySalvarButton, setDisplaySalvarButton] = useState<boolean>(false);
  const [displayEditarButton, setDisplayEditarButton] = useState<boolean>(false);

  const regexTelefone = /^(\d{10}|\d{11})$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onClickDelete = async (id: number) => {
    await deleteContact(id);
    setContacts(await getContacts());
  }

  const clearModal = () => {
    setNome('');
    setTelefone('');
    setAtivo("Sim");
    setEmail('');
    setDataNascimento('');
  }

  const handleClose = () => {
    clearModal();
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const onOpenSalvar = async () => {
    handleShow();
    setDisplaySalvarButton(true);
    setDisplayEditarButton(false);
    setType("salvar");
  }

  const onClickSalvar = async () => {
    const data = {
      nome,
      telefone,
      ativo: ativo === "Sim",
      email,
      dataNascimento,
    }

    await createContact(data);
    const contacts = await getContacts();
    setContacts(contacts);

    handleClose();
    setDisplaySalvarButton(false);
  }

  const onOpenEditar = (id: number) => {
    handleShow();
    setDisplaySalvarButton(false);
    setDisplayEditarButton(true);
    setType("editar");
    setId(id);

    const contact = contacts?.find(contact => contact.id === id);
    if (contact) {
      setNome(contact.nome);
      setTelefone(contact.telefone);
      setAtivo(contact.ativo ? "Sim" : "Não");
      setEmail(contact.email);
      setDataNascimento(formatDataToShow(contact.dataNascimento));
    }
  }

  const onClickEditar = async (id: number) => {
    const data = {
      nome,
      telefone,
      ativo: ativo === "Sim",
      email,
      dataNascimento,
    }

    await updateContact(id, data);
    const contacts = await getContacts();
    setContacts(contacts);

    handleClose();
    setDisplayEditarButton(false);
  }

  const handleModal = () => {
    if (type === "salvar") {
      if (nome && email && telefone && dataNascimento && regexTelefone.test(telefone.replace(/\s/g, '').trim()) && regexEmail.test(email)) {
        setSalvarIsDisabled(false);
      } else {
        setSalvarIsDisabled(true);
      }
    } else if (type === "editar") {
      if (nome && email && telefone && dataNascimento && regexTelefone.test(telefone.replace(/\s/g, '').trim()) && regexEmail.test(email)) {
        setEditarIsDisabled(false);
      } else {
        setEditarIsDisabled(true);
      }
    }
  }

  const formatDataToShow = (dataNascimento: string) => {
    const [ano, mes, dia] = dataNascimento.split('-');
    return `${ano}-${mes}-${dia[0]}${dia[1]}`;
  }

  const formatDataNascimento = (dataNascimento: string) => {
    const [ano, mes, dia] = dataNascimento.split('-');
    return `${dia[0]}${dia[1]}/${mes}/${ano}`;
  }

  const formatTelefone = (telefone: string) => {
    const formated = telefone.replace(/\s/g, '').trim();
    const ddd = formated.slice(0, 2);
    let numero = formated.slice(2);
    
    if (numero.length === 8) {
      numero = numero.slice(0, 4) + '-' + numero.slice(4);
    } else if (numero.length === 9) {
      numero = numero.slice(0, 5) + '-' + numero.slice(5);
    }
    
    return `(${ddd}) ${numero}`;
  }

  const createLoadingMessage = () => {
    const container = document.querySelector('.container');

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'spinner-border';
    loadingDiv.role = 'status'; 
  
    const loadingSpan = document.createElement('span');
    loadingSpan.className = 'sr-only';
    loadingSpan.innerText = 'Carregando...';
    loadingDiv.appendChild(loadingSpan);
  
    container!.appendChild(loadingDiv);
  }; 
  
  const deleteLoadingMessage = () => {
    const container = document.querySelector('.container');
    const message = container!.lastChild;
    container!.removeChild(message!);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await getContacts();
      setContacts(response);
    }

    createLoadingMessage();
    fetchContacts();
    deleteLoadingMessage();
  }, []);
  
  return (
    <>
      <Head>
        <title>Contatos</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className="container">
          <h1>Contatos</h1>
          
          <button
            id="addContactButton"
            type="button"
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#addContactModal"
            onClick={() => onOpenSalvar()}
          >
            Adicionar Contato
          </button>
        
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Ativo</th>
                <th>Data de Nascimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="contactTableBody">
              { contacts && contacts.map(contact => (
                <tr key={contact.id}>
                  <td>{contact.nome}</td>
                  <td>{formatTelefone(contact.telefone)}</td>
                  <td>{contact.email}</td>
                  <td>{contact.ativo ? "Sim" : "Não"}</td>
                  <td>{formatDataNascimento(contact.dataNascimento)}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => onOpenEditar(contact.id!)}
                    >
                      Editar
                    </button>
                    <button
                      onClick={async () => await onClickDelete(contact.id!)}
                      className="btn btn-danger btn-sm"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <Modal show={show}>
          <ModalDialog>
              <ModalHeader>
                <ModalTitle>Adicionar Contato</ModalTitle>
                <button onClick={handleClose} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </ModalHeader>
        
              <ModalBody>
                <form id="addContactForm" onChange={() => handleModal()}>
                    <div className="form-group">
                      <label htmlFor="nome">Nome:</label>
                      <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        type="text"
                        className="form-control"
                        id="nome"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="telefone">Telefone:</label>
                      <input
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        type="text"
                        className="form-control"
                        id="telefone"
                        required
                      />
                      <p>Apenas números</p>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        id="email"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ativo">Ativo:</label>
                      <select id="ativo" value={ativo} onChange={(e) => setAtivo(e.target.value)}>
                        <option value="Sim" >Sim</option>
                        <option value="Não" >Não</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="dataNascimento">Data de nascimento:</label>
                      <input
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        type="date"
                        className="form-control"
                        id="dataNascimento"
                        required
                      />
                    </div>
                    { displaySalvarButton && 
                      (<button
                        id="salvar"
                        type="button"
                        className="btn btn-success"
                        disabled={salvarIsDisabled}
                        onClick={async () => await onClickSalvar()}
                        style={{ display: "block" }}
                      >
                        Salvar
                      </button>) }
                    { displayEditarButton && 
                      (<button
                        id="editar"
                        type="button"
                        className="btn btn-success"
                        disabled={editarIsDisabled}
                        onClick={async () => await onClickEditar(id)}
                        style={{ display: "block" }}
                      >
                        Editar
                      </button>) }
                  </form>
              </ModalBody>
          </ModalDialog>
        </Modal> 
      </main>
    </>
  );
}
