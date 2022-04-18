import { useState } from 'react';
import PropTypes from 'prop-types';
import { Report, Confirm } from 'notiflix';
import s from './NewContactForm.module.css';

function ContactForm(props) {
  const [state, setState] = useState({ name: '', number: '' });

  const handleSubmit = e => {
    e.preventDefault();

    const { name } = state;
    const names = props.contactsArr;

    if (names.includes(name.toLowerCase())) {
      Report.warning(
        `'${name}' is already in contacts `,
        `Please change name to create unique contact`,
        'Okay',
        {
          titleMaxLength: 1000,
        }
      );
      return;
    }

    if (state.number.length < 7 || state.number.length > 12) {
      Confirm.show(
        'Unknown phone number format',
        'Are you sure you want to keep it?',
        'Yes',
        'No',
        () => {
          // При подтверждении
          props.Submit(e);
          reset();
        },
        () => {
          // при отказе
          return;
        }
      );
      return;
    }
    props.Submit(e);

    reset();
  };

  const handleChange = e => {
    const key = e.target.name;
    const value = e.target.value;
    setState(prevState => ({ ...prevState, [key]: value }));
  };

  const reset = () => {
    setState({
      name: '',
      number: '',
    });
  };

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <label className={s.label}>
        <span>Name</span>
        <input
          type="text"
          name="name"
          className={s.input}
          onChange={handleChange}
          value={state.name}
          pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
          title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
          required
          placeholder="Enter name"
        />
      </label>
      <label className={s.label}>
        <span>Number</span>
        <input
          type="tel"
          name="number"
          className={s.input}
          onChange={handleChange}
          value={state.number}
          placeholder="Enter number"
          pattern="\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          required
        />
      </label>
      <button type="submit" className={s.button}>
        Add contact
      </button>
    </form>
  );
}

ContactForm.propTypes = {
  name: PropTypes.string,
  number: PropTypes.number,
};

export default ContactForm;
