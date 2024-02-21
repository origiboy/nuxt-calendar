import { defineStore } from 'pinia'

export const useCalendarStore = defineStore('calendar', {
  state: () => {
    return { 
      events: [],
      eventPopup: false,
    }
  },
  actions: {
    addEvent(payload) {
      const payloadWithId = Object.assign(payload)
      if(this.events.length === 0) {
        payloadWithId.id = 0
      } else {
        payloadWithId.id = this.events.length
      }
      this.events.push(payloadWithId)
    },
    getEventByDate(date) {
      return this.events.filter((item) => {
        if (date.getDate() === item.date.getDate() && date.getMonth() === item.date.getMonth() && date.getFullYear() === item.date.getFullYear()) return true
        return false
      })
    },
    editEvent(id, payload) {
      this.events = this.events.map((item) => {
        if (item.id === id) {
          return payload
        }
        return item
      })
    },
    deleteEvent(id) {
      this.events = this.events.filter((item) => item.id !== id)
    },
    changeEventPopupStatus(status) {
      this.eventPopup = status
    },
  },
  getters: {
    eventPopupStatus() {
      return this.eventPopup
    }
  }
})