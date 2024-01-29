import { Contact } from "@/types/contacts";

const token = "d83aa658-6caa-43ee-ab28-c76423dc6f05";
const urlBase = `https://api.box3.work/api/Contato/${token}`;

export const getContacts = async (): Promise<Contact[] | undefined> => {
  try {
    const response = await fetch(urlBase);
    const lista = await response.json();
    return lista;
  } catch (error) {
    console.log(error);
  }
};

export const getContactById = async (id: number): Promise<Contact | undefined> => {
  try {
    const response = await fetch(`${urlBase}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const createContact = async (contact: Contact): Promise<Contact | undefined> => {
  try {
    const response = await fetch(urlBase, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const deleteContact = async (id: number): Promise<Contact | undefined> => {
  try {
    const response = await fetch(`${urlBase}/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const updateContact = async (id: number, contact: Contact): Promise<Contact | undefined> => {
  try {
    const response = await fetch(`${urlBase}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
