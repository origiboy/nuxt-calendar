<!-- components/Calendar.vue -->
<template>
  <div class="calendar">
    <div class="calendar__navigation">
      <button @click="prevMonth" class="calendar__navigation-button">←</button>
      <Transition>
        <div v-if="show" class="calendar__navigation-header">
          <h2>{{ currentMonth }}</h2>
          <h3>{{ currentYear }}</h3>
        </div>
      </Transition>
      <button @click="nextMonth" class="calendar__navigation-button">→</button>
    </div>
    <Transition>
      <div class="calendar__days" v-if="show">
        <div v-for="day in weekDays" :key="day" class="calendar__day_header">
          {{ day }}
        </div>
        <div
          v-for="day in days"
          :key="day.date"
          :class="{ calendar__today: day.isToday }"
          class="calendar__day"
        >
          <div v-if="day.day" class="calendar__day-number">{{ day.day }}</div>
          <div class="calendar__event-container">
            <div
              v-for="eventToDo in getEventsThisDate(day)"
              :key="event.id"
              @click="changeEvent(eventToDo)"
              class="calendar__event"
            >
              {{ eventToDo.title }}
            </div>
          </div>
          <button
            v-if="day.date"
            @click="addEventByDate(day.date)"
            class="calendar__event-add-new"
          >
            +
          </button>
        </div>
      </div>
    </Transition>
    <button @click="openEventForm" class="calendar__add-new">Добавить событие</button>
    <EventForm
      v-if="calendarStore.eventPopupStatus"
      @event="event"
      :defaultData="defaultData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCalendarStore } from '~/store/calendar'

const calendarStore = useCalendarStore()

const days = ref([])
const show = ref(true)
const weekDays = ref(['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'])
const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

let currentDate = new Date()
let currentMonth = ref(months[currentDate.getMonth()])
let currentYear = ref(currentDate.getFullYear())

const generateDays = () => {
  const firstDayOfMonth = new Date(
    Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1)
  )
  const lastDayOfMonth = new Date(
    Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  )
  const daysInMonth = lastDayOfMonth.getDate()
  let startDayOfWeek = firstDayOfMonth.getDay()
  startDayOfWeek = (startDayOfWeek + 6) % 7
  days.value = []

  for (let i = 0; i < startDayOfWeek; i++) {
    days.value.push({
      day: '',
      date: null,
    })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(
      Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), i)
    )
    const isToday = isSameDay(date, new Date())
    days.value.push({
      day: i,
      date,
      isToday,
    })
  }
}

const isSameDay = (dateFirst, dateSecond) => {
  return (
    dateFirst.getFullYear() === dateSecond.getFullYear() &&
    dateFirst.getMonth() === dateSecond.getMonth() &&
    dateFirst.getDate() === dateSecond.getDate()
  )
}

const prevMonth = () => {
  show.value = false
  currentDate.setMonth(currentDate.getMonth() - 1)
  currentMonth = months[currentDate.getMonth()]
  currentYear = currentDate.getFullYear()
  generateDays()
  setTimeout(() => (show.value = true), 500)
}

const nextMonth = () => {
  show.value = false
  currentDate.setMonth(currentDate.getMonth() + 1)
  currentMonth = months[currentDate.getMonth()]
  currentYear = currentDate.getFullYear()
  generateDays()
  setTimeout(() => (show.value = true), 500)
}

let defaultData = ref(null)

const changeEvent = (eventToDo) => {
  defaultData.value = Object.assign(eventToDo)
  calendarStore.changeEventPopupStatus(true)
}

const openEventForm = () => {
  defaultData.value = null
  calendarStore.changeEventPopupStatus(true)
}

const addEventByDate = (date) => {
  defaultData.value = Object.assign({})
  defaultData.value.date = date
  calendarStore.changeEventPopupStatus(true)
}

const getEventsThisDate = (day) => {
  if (day.date) 
    return calendarStore.getEventByDate(day.date)
  return []
}

const event = () => {
  generateDays()
}

onMounted(() => {
  generateDays()
})
</script>

<style scoped lang="scss">
@import '../style/animation.scss';

.calendar {
  display: flex;
  flex-direction: column;
  max-width: 800px;

  &__add-new {
    width: fit-content;
    margin: 0px;
    margin-top: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    background: #6c5cff;
    cursor: pointer;

    @include button-animation;
  }

  &__navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  &__navigation-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h2,
    h3 {
      height: fit-content;
      margin: 0px;
    }

    h2 {
      margin-bottom: 10px;
    }

    h3 {
      font-size: 12px;
    }
  }

  &__navigation-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 20px;
    color: white;
    font-weight: 900;
    font-size: 20px;
    line-height: 20px;
    background: #6c5cff;
    cursor: pointer;

    @include button-animation;
  }

  &__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }

  &__day {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 60px;
    border: 1px solid #ddd;
    padding: 4px;
    text-align: center;
    position: relative;

    &_header {
      font-weight: 900;
    }

    &:hover {
      .calendar__event-add-new {
        opacity: 1;
      }
    }
  }

  &__day-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 1px solid grey;
    border-radius: 50%;
    font-size: 10px;
  }

  &__today {
    background-color: #ddd; /* Highlight today's date */
  }

  &__day-header {
    font-weight: bold;
  }

  &__event-container {
    margin-top: 5px;
  }

  &__event {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 10px;
    margin-bottom: 2px;
    font-size: 14px;
    cursor: pointer;
    text-align: start;

    &:after {
      content: '';
      position: absolute;
      left: 0px;
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background-color: #8ed1fc;
    }

    &-add-new {
      opacity: 0;
      margin-top: auto;
      border: none;
      padding: 0px;
      font-size: 14px;
      color: #6c5cff;
      background: transparent;
      cursor: pointer;
      transition: opacity 0.2s linear;
    }
  }
}

button {
  margin-top: 5px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
