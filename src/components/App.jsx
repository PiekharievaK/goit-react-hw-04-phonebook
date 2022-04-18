import { useState } from 'react';
import ContactForm from './NewContactForm/NewContactForm';
import ContactsList from './ContactsList/ContactsList';
import Filter from './ContactsFilter/ContactsFilter';
import { Confirm } from 'notiflix';

const initialState = [
  { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
  { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
  { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
  { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
];

function App() {
  const [contactsList, setContactsList] = useState(() => {
    return JSON.parse(localStorage.getItem('contacts')) ?? initialState;
  });

  const [filter, setFilter] = useState('');

  const saveContact = e => {
    e.preventDefault();

    const shortid = require('shortid');
    const name = e.target.elements.name.value;
    const number = e.target.elements.number.value;

    const contactInfo = { id: shortid(), name: name, number: number };
    setContactsList(prevState => [contactInfo, ...prevState]);
    localStorage.setItem(
      'contacts',
      JSON.stringify([contactInfo, ...contactsList])
    );
  };

  const deleteContact = e => {
    const id = e.target.id;
    setContactsList(prevState =>
      prevState.filter(contact => contact.id !== id)
    );
    localStorage.setItem(
      'contacts',
      JSON.stringify([...contactsList.filter(contact => contact.id !== id)])
    );
  };

  const changeFilter = e => {
    setFilter(e.target.value);
  };

  const findContacts = fieldValue => {
    const lowerValue = fieldValue.toLowerCase();
    const filteredContacts = contactsList.filter(contact => {
      return (
        contact.name.toLowerCase().includes(lowerValue) ||
        contact.number.includes(lowerValue)
      );
    });
    return filteredContacts;
  };

  //   Дополнительный функционал
  const changeInfo = e => {
    const ChangeInfoList = contactsList;
    const contact = contactsList.find(contact => contact.id === e.target.id);
    const contactIdx = ChangeInfoList.indexOf(contact);

    Confirm.prompt(
      'Choose what you want to change',
      `Edit contact '${contact.name}'. ` +
        'You can also cancel editing if you leave the field blank and select the option',
      '',
      'Name',
      'Number',
      clientAnswer => {
        if (clientAnswer.trim().length === 0 || !!Number(clientAnswer)) {
          window.alert(
            `There is a mistake somewhere. Contact name should include letters`
          );
          return;
        }
        const result = window.confirm(
          `Are you sure that you want to save your changes on name?`
        );
        if (!result) {
          return;
        }
        ChangeInfoList[contactIdx].name = clientAnswer;

        localStorage.setItem('contacts', JSON.stringify(ChangeInfoList));
        setContactsList(JSON.parse(localStorage.getItem('contacts')));
      },

      clientAnswer => {
        if (clientAnswer.trim().length === 0 || !Number(clientAnswer)) {
          window.alert(
            `There is a mistake somewhere. Phone number should include just numbers and acceptably '+' '-' symbols.`
          );
          return;
        }
        const result = window.confirm(
          `Are you sure that you want to save your changes on number?`
        );
        if (!result) {
          return;
        }

        ChangeInfoList[contactIdx].number = clientAnswer;
        localStorage.setItem('contacts', JSON.stringify(ChangeInfoList));
        setContactsList(JSON.parse(localStorage.getItem('contacts')));
      },
      {}
    );
  };

  return (
    <>
      <h1>Phonebook</h1>
      <ContactForm
        contactsArr={contactsList.map(contact => contact.name.toLowerCase())}
        Submit={saveContact}
      />

      <h2>Contacts</h2>
      <Filter value={filter} changeFilter={changeFilter} />
      <ContactsList
        data={findContacts(filter)}
        deleteFoo={deleteContact}
        ChangeFoo={changeInfo}
      />
    </>
  );
}

export default App;
