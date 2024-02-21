<template>
  <div class="event-popup">
    <div class="event-form">
      <div class="event-form__nav">
        <button type="button" class="event-form__close" @click="closeForm">✗</button>
      </div>
      <h3>Добавить событие</h3>
      <form @submit.prevent="submitEvent">
        <label for="eventTitle">Заголовок:</label>
        <input v-model="eventTitle" type="text" id="eventTitle" required />

        <label for="eventDescription">Описание:</label>
        <textarea v-model="eventDescription" id="eventDescription" required></textarea>

        <label for="eventDate">Дата:</label>
        <input v-model="eventDate" type="date" id="eventDate" required />

        <button v-if="!isEdit" type="submit" class="event-form__add">Добавить</button>
        <button v-else type="submit" class="event-form__add">Изменить</button>
        <button
          v-if="isEdit"
          type="button"
          class="event-form__delete"
          @click="deleteEvent"
        >
          Удалить событие
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import { useCalendarStore } from '~/store/calendar'
const emit = defineEmits(['event'])
const props = defineProps(['defaultData'])

const eventId = ref(0)
const eventTitle = ref('')
const eventDescription = ref('')
const eventDate = ref('')
const isEdit = ref(false)

const calendarStore = useCalendarStore()

const closeForm = () => {
  resetForm()
  calendarStore.changeEventPopupStatus(false)
}

const submitEvent = () => {
  if (isEdit.value) {
    const event = {
      id: eventId.value,
      title: eventTitle.value,
      description: eventDescription.value,
      date: new Date(eventDate.value),
    }
    calendarStore.editEvent(eventId.value, event)
  } else {
    const event = {
      title: eventTitle.value,
      description: eventDescription.value,
      date: new Date(eventDate.value),
    }
    calendarStore.addEvent(event)
  }
  emit('event')
  resetForm()
  calendarStore.changeEventPopupStatus(false)
}

const resetForm = () => {
  eventTitle.value = ''
  eventDescription.value = ''
  eventDate.value = ''
}

const deleteEvent = () => {
  store.deleteEvent(eventId.value)
  store.changeEventPopupStatus(false)
}

onMounted(() => {
  console.log(props.defaultData)
  if (props.defaultData) {
    if (props.defaultData.title) {
      isEdit.value = true
    }

    eventId.value = props.defaultData.id
    eventTitle.value = props.defaultData.title
    eventDescription.value = props.defaultData.description
    eventDate.value = new Date(props.defaultData.date).toISOString().slice(0, 10)
  }
})
</script>

<style scoped lang="scss">
@import '../style/animation.scss';

.event-popup {
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}
.event-form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 20px;
  background: white;

  h3 {
    margin-top: 0px;
    margin-bottom: 10px;
  }

  &__add {
    width: fit-content;
    margin: 0px;
    margin-top: 10px;
    margin-bottom: 5px;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    background: #6c5cff;
    cursor: pointer;

    @include button-animation;
  }

  &__delete {
    width: fit-content;
    margin: 0px;
    margin-top: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    background: red;
    cursor: pointer;

    @include button-animation;
  }

  &__close {
    padding: 0px;
    border: none;
    background: transparent;
    font-weight: 900;
    font-size: 20px;
    cursor: pointer;

    @include button-animation;
  }

  &__nav {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
}

input,
textarea {
  margin-bottom: 10px;
  padding: 5px;
}
</style>
