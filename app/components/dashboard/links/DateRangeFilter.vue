<script setup>
import { now, startOfMonth, startOfWeek } from '@internationalized/date'
import { Calendar } from 'lucide-vue-next'

const emit = defineEmits(['update:dateRange'])

const dateRange = ref('all')
const openCustomDateRange = ref(false)
const customDate = ref()
const customDateRange = ref()

const locale = getLocale()

function updateCustomDate(customDateValue) {
  const startUnix = date2unix(customDateValue, 'start')
  const endUnix = date2unix(customDateValue, 'end')
  emit('update:dateRange', { start: startUnix, end: endUnix })
  openCustomDateRange.value = false
  customDate.value = undefined
}

function updateCustomDateRange(customDateRangeValue) {
  if (customDateRangeValue.start && customDateRangeValue.end) {
    const startUnix = date2unix(customDateRangeValue.start, 'start')
    const endUnix = date2unix(customDateRangeValue.end, 'end')
    emit('update:dateRange', { start: startUnix, end: endUnix })
    openCustomDateRange.value = false
    customDateRange.value = undefined
  }
}

function isDateDisabled(dateValue) {
  return dateValue.toDate() > new Date()
}

watch(dateRange, (newValue) => {
  switch (newValue) {
    case 'all':
      emit('update:dateRange', null)
      break
    case 'today':
      emit('update:dateRange', { start: date2unix(now(), 'start'), end: date2unix(now()) })
      break
    case 'last-24h':
      emit('update:dateRange', { start: date2unix(now().subtract({ hours: 24 })), end: date2unix(now()) })
      break
    case 'this-week':
      emit('update:dateRange', { start: date2unix(startOfWeek(now(), locale), 'start'), end: date2unix(now()) })
      break
    case 'last-7d':
      emit('update:dateRange', { start: date2unix(now().subtract({ days: 7 })), end: date2unix(now()) })
      break
    case 'this-month':
      emit('update:dateRange', { start: date2unix(startOfMonth(now()), 'start'), end: date2unix(now()) })
      break
    case 'last-30d':
      emit('update:dateRange', { start: date2unix(now().subtract({ days: 30 })), end: date2unix(now()) })
      break
    case 'custom':
      openCustomDateRange.value = true
      dateRange.value = null
      break
    default:
      break
  }
})
</script>

<template>
  <Select v-model="dateRange">
    <SelectTrigger class="w-full sm:w-48">
      <Calendar class="h-4 w-4 sm:mr-2" />
      <SelectValue v-if="dateRange" />
      <span v-else class="hidden sm:inline">{{ $t('dashboard.date_range') }}</span>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">
        {{ $t('links.filter.all_dates') }}
      </SelectItem>
      <SelectSeparator />
      <SelectItem value="today">
        {{ $t('dashboard.date_picker.today') }}
      </SelectItem>
      <SelectItem value="last-24h">
        {{ $t('dashboard.date_picker.last_24h') }}
      </SelectItem>
      <SelectSeparator />
      <SelectItem value="this-week">
        {{ $t('dashboard.date_picker.this_week') }}
      </SelectItem>
      <SelectItem value="last-7d">
        {{ $t('dashboard.date_picker.last_7d') }}
      </SelectItem>
      <SelectSeparator />
      <SelectItem value="this-month">
        {{ $t('dashboard.date_picker.this_month') }}
      </SelectItem>
      <SelectItem value="last-30d">
        {{ $t('dashboard.date_picker.last_30d') }}
      </SelectItem>
      <SelectSeparator />
      <SelectItem value="custom">
        {{ $t('dashboard.date_picker.custom') }}
      </SelectItem>
    </SelectContent>
  </Select>

  <Dialog v-model:open="openCustomDateRange">
    <DialogContent class="w-auto max-w-[95svw] max-h-[95svh] md:max-w-screen-md grid-rows-[auto_minmax(0,1fr)_auto]">
      <DialogHeader>
        <DialogTitle>{{ $t('dashboard.date_picker.custom_title') }}</DialogTitle>
      </DialogHeader>
      <Tabs default-value="range">
        <div class="flex justify-center">
          <TabsList>
            <TabsTrigger value="date">
              {{ $t('dashboard.date_picker.single_date') }}
            </TabsTrigger>
            <TabsTrigger value="range">
              {{ $t('dashboard.date_picker.date_range') }}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="date"
          class="overflow-y-auto h-80"
        >
          <Calendar
            :model-value="customDate"
            weekday-format="short"
            :is-date-disabled="isDateDisabled"
            @update:model-value="updateCustomDate"
          />
        </TabsContent>
        <TabsContent
          value="range"
          class="overflow-y-auto h-80"
        >
          <RangeCalendar
            :model-value="customDateRange"
            initial-focus
            weekday-format="short"
            :number-of-months="2"
            :is-date-disabled="isDateDisabled"
            @update:model-value="updateCustomDateRange"
          />
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>
