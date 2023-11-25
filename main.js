import './style.css'
import TomSelect from 'tom-select';

const MAX_COMEDIANS = 6;

const bookingComediansList = document.querySelector('.form__comedians-list');

const createComedianBlock = (comedians) => {
  const bookingComedian = document.createElement('li');
  bookingComedian.classList.add('form__comedian');

  const bookingLabelComedian = document.createElement('label');
  const bookingSelectComedian = document.createElement('select');
  bookingSelectComedian.classList.add('form__select');
  bookingSelectComedian.name = 'comedian';
  bookingLabelComedian.append(bookingSelectComedian);

  const bookingLabelTime = document.createElement('label');
  const bookingSelectTime = document.createElement('select');
  bookingSelectTime.classList.add('form__select');
  bookingSelectTime.name = 'time';
  bookingLabelTime.append(bookingSelectTime);

  const inputHidden = document.createElement('hidden');
  inputHidden.type = 'hidden';
  inputHidden.name = 'booking';

  const bookingHall = document.createElement('button');
  bookingHall.type = 'button';
  bookingHall.setAttribute('disabled', true);
  bookingHall.classList.add('form__btn-hall');

  bookingComedian.append(bookingLabelComedian, bookingLabelTime, bookingHall);

  const bookingTomSelectComedian = new TomSelect(bookingSelectComedian, {
    hideSelected: true,
    placeholder: 'Выбрать комика',
    maxItems: 1,
    options: comedians.map((item) => ({
      value: item.id,
      text: item.comedian,
    })),
  });

  const bookingTomSelectTime = new TomSelect(bookingSelectTime, {
    hideSelected: true,
    placeholder: 'Время',
    maxItems: 1,
  });
  bookingTomSelectTime.disable();

  bookingTomSelectComedian.on('change', function (id) {
    bookingTomSelectTime.enable();
    bookingTomSelectComedian.blur();

    const {performances} = comedians.find((item) => item.id === id);

    bookingTomSelectTime.clear();
    bookingTomSelectTime.clearOptions();

    bookingTomSelectTime.addOptions(performances.map((item) => ({
      value: item.time,
      text: item.time,
    })));
  });

  bookingTomSelectTime.on('change', function (time) {
    bookingTomSelectTime.blur();
    const li = this.wrapper.closest('.form__comedian');
    const btn = li.querySelector('.form__btn-hall');

    if (!time) {
      btn.setAttribute('disabled', true);
      btn.textContent = '';
      return;
    }

    const idComedian = bookingTomSelectComedian.getValue();
    const {performances} = comedians.find((item) => item.id === idComedian);

    const {hall} = performances.find((item) => item.time === time);
    inputHidden.value = `${idComedian},${time}`;

    btn.removeAttribute('disabled');
    btn.textContent = hall;
  });

  const createNextBookingComedian = () => {
    if (bookingComediansList.children.length < MAX_COMEDIANS) {
      const nextComediansBlock = createComedianBlock(comedians);
      bookingComediansList.append(nextComediansBlock);
    }

    bookingTomSelectTime.off('change', createNextBookingComedian);
  }

  bookingTomSelectTime.on('change', createNextBookingComedian);

  return bookingComedian;
};

const getComedians = async () => {
  const response = await fetch('http://localhost:8080/comedians');
  return response.json();
};

const init = async () => {
  const comediansQuantity = document.querySelector('.event__info-item--comedians .event__info-number');
  const comedians = await getComedians();

  comediansQuantity.textContent = comedians.length;

  const comedianBlock = createComedianBlock(comedians);

  bookingComediansList.append(comedianBlock);
};

window.addEventListener('load', () => {
  init();
});

/**
 *             <li class="form__comedian">
              <label>
                <select class="form__select" name="comedian">
                  <option value="" disabled hidden>Выбрать комика</option>
                  <option value="2" selected>Юлия Ахмедова</option>
                  <option value="4">Слава Комиссаренко</option>
                </select>
              </label>

              <label>
                <select class="form__select" name="comedian">
                  <option value="" disabled hidden>Время</option>
                  <option value="14:00" selected>14:00</option>
                  <option value="16:00">16:00</option>
                </select>
              </label>

              <button class="form__btn-hall" type="button">
                <span class="form__btn-text">Зал 1</span>
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M9 3.5H3V9.5H5V5.5H9V3.5ZM3 21.5V15.5H5V19.5H9V21.5H3ZM15 3.5V5.5H19V9.5H21V3.5H15ZM19 15.5H21V21.5H15V19.5H19V15.5ZM7 7.5H11V11.5H7V7.5ZM7 13.5H11V17.5H7V13.5ZM17 7.5H13V11.5H17V7.5ZM13 13.5H17V17.5H13V13.5Z"
                    fill="#1A1A1A" />
                </svg>
              </button>
            </li>
 */
