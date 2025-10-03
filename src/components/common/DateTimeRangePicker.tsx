import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';

// --- Helper Functions using pure JavaScript Date objects ---
const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isSameMonth = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
};

const getStartOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getEndOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const getStartOfWeek = (date: Date) => {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  day.setDate(day.getDate() - day.getDay());
  return day;
};

const getEndOfWeek = (date: Date) => {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  day.setDate(day.getDate() + (6 - day.getDay()));
  return day;
};

const addMonths = (date: Date, months: number) => {
  const newDate = new Date(date.getTime());
  newDate.setMonth(date.getMonth() + months);
  return newDate;
};

const addDays = (date: Date, days: number) => {
  const newDate = new Date(date.getTime());
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const isBefore = (d1: Date, d2: Date) => {
  return d1.getTime() < d2.getTime();
};

const isWithinInterval = (date: Date, interval: { start: Date; end: Date }) => {
  return date.getTime() >= interval.start.getTime() && date.getTime() <= interval.end.getTime();
};

const format = (date: Date, formatStr: string) => {
  return dayjs(date).format(formatStr);
};

const generateDays = (
  currentDate: Date,
  selectedStartDate: Date | null,
  selectedEndDate: Date | null
) => {
  const monthStart = getStartOfMonth(currentDate);
  const monthEnd = getEndOfMonth(currentDate);
  const startDate = getStartOfWeek(monthStart);
  const endDate = getEndOfWeek(monthEnd);

  const days = [];
  let day = startDate;

  while (day.getTime() <= endDate.getTime()) {
    days.push(new Date(day));
    day = addDays(day, 1);
  }

  const today = new Date();
  return days.map((d) => {
    const isCurrentMonth = isSameMonth(d, currentDate);
    const isSelected =
      selectedStartDate &&
      selectedEndDate &&
      isWithinInterval(d, { start: selectedStartDate, end: selectedEndDate });
    const isStart = selectedStartDate && isSameDay(d, selectedStartDate);
    const isEnd = selectedEndDate && isSameDay(d, selectedEndDate);
    const isToday = isSameDay(d, today);

    return {
      day: d,
      isCurrentMonth,
      isSelected,
      isStart,
      isEnd,
      isToday,
      key: format(d, 'YYYY-MM-DD'),
    };
  });
};

const generateHours = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i.toString().padStart(2, '0'));
  }
  return hours;
};

const generateMinutes = () => {
  const minutes = [];
  for (let i = 0; i < 60; i++) {
    minutes.push(i.toString().padStart(2, '0'));
  }
  return minutes;
};

interface DateRangePickerProps {
  onDateRangeChange?: (startDate: string | null, endDate: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeChange,
  label = 'Date',
  placeholder = 'Select a date range',
  className = '',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const now = new Date();
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(addDays(now, -6));
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(now);
  const [selectedTab, setSelectedTab] = useState('Last 7 Days');
  const [startHour, setStartHour] = useState('00');
  const [startMinute, setStartMinute] = useState('00');
  const [endHour, setEndHour] = useState('00');
  const [endMinute, setEndMinute] = useState('00');
  const [showPicker, setShowPicker] = useState(false);

  const inputRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  const handlePrevMonth = () => setCurrentDate(addMonths(currentDate, -1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = (day: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(day);
      setSelectedEndDate(null);
    } else if (selectedStartDate && !selectedEndDate) {
      if (isBefore(day, selectedStartDate)) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(day);
      } else {
        setSelectedEndDate(day);
      }
    }
  };

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    const now = new Date();
    switch (tab) {
      case 'Today':
        setSelectedStartDate(now);
        setSelectedEndDate(now);
        break;
      case 'Yesterday':
        const yesterday = addDays(now, -1);
        setSelectedStartDate(yesterday);
        setSelectedEndDate(yesterday);
        break;
      case 'Last 7 Days':
        setSelectedStartDate(addDays(now, -6));
        setSelectedEndDate(now);
        break;
      case 'Last 30 Days':
        setSelectedStartDate(addDays(now, -29));
        setSelectedEndDate(now);
        break;
      case 'This Month':
        setSelectedStartDate(getStartOfMonth(now));
        setSelectedEndDate(now);
        break;
      case 'Last Month':
        const lastMonth = addMonths(now, -1);
        setSelectedStartDate(getStartOfMonth(lastMonth));
        setSelectedEndDate(getEndOfMonth(lastMonth));
        break;
      default:
        break;
    }
  };

  const handleOKClick = () => {
    if (onDateRangeChange) {
      let startISO: string | null = null;
      let endISO: string | null = null;

      if (selectedStartDate) {
        startISO = dayjs(selectedStartDate)
          .hour(parseInt(startHour, 10))
          .minute(parseInt(startMinute, 10))
          .toISOString();
      }

      if (selectedEndDate) {
        endISO = dayjs(selectedEndDate)
          .hour(parseInt(endHour, 10))
          .minute(parseInt(endMinute, 10))
          .toISOString();
      }

      onDateRangeChange(startISO, endISO);
    }
    setShowPicker(false);
  };

  const formattedStartDate = selectedStartDate ? format(selectedStartDate, 'DD-MM-YYYY') : '';
  const formattedEndDate = selectedEndDate ? format(selectedEndDate, 'DD-MM-YYYY') : '';
  const dateRangeText =
    formattedStartDate && formattedEndDate
      ? `${formattedStartDate} - ${formattedEndDate}`
      : placeholder;

  const days = generateDays(currentDate, selectedStartDate, selectedEndDate);
  const nextMonthDays = generateDays(addMonths(currentDate, 1), selectedStartDate, selectedEndDate);
  const hours = generateHours();
  const minutes = generateMinutes();

  const tabClass = (tabName: string) =>
    `cursor-pointer px-2 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
      selectedTab === tabName
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  const dayClass = (day: any) => {
    let base =
      'h-6 w-6 text-center rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer flex items-center justify-center ';
    if (!day.isCurrentMonth) {
      base += 'text-gray-300 pointer-events-none ';
    } else {
      base += 'text-gray-800 hover:bg-gray-200 ';
    }
    if (day.isToday) {
      base += 'border border-blue-500 ';
    }
    if (day.isStart || day.isEnd) {
      base += 'bg-blue-600 text-white hover:bg-blue-700 ';
    }
    if (day.isSelected) {
      base += 'bg-blue-200 text-blue-800 rounded-none';
    }
    if (day.isStart && day.isEnd && day.isSelected) {
      base += 'rounded-full';
    } else if (day.isStart) {
      base += 'rounded-l-full';
    } else if (day.isEnd) {
      base += 'rounded-r-full';
    }
    return base;
  };

  const hourMinuteWrapperClass =
    'relative inline-flex items-center rounded border border-gray-300 px-2 py-1 bg-white';

  const renderMonth = (date: Date, daysData: any[], showNavigation: boolean) => (
    <div className="flex-1 min-w-[180px] px-1">
      <div className="flex items-center justify-between mb-2">
        {showNavigation && (
          <button
            onClick={handlePrevMonth}
            className="text-gray-500 hover:bg-gray-100 p-1 rounded transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
        <span
          className={`font-semibold text-sm text-gray-900 ${!showNavigation ? 'w-full text-center' : ''}`}
        >
          {format(date, 'MMM YYYY')}
        </span>
        {showNavigation && (
          <button
            onClick={handleNextMonth}
            className="text-gray-500 hover:bg-gray-100 p-1 rounded transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </div>
      <div className="grid grid-cols-7 text-xs text-gray-500 text-center font-medium mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="h-5 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {daysData.map((day) => (
          <div
            key={day.key}
            className={dayClass(day)}
            onClick={() => day.isCurrentMonth && handleDayClick(day.day)}
          >
            {day.day.getDate()}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      <label className="block">{label}</label>
      <div
        ref={inputRef}
        onClick={() => setShowPicker(true)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer bg-background hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      >
        <div className="flex items-center justify-center">
          <span
            className={`text-sm ${dateRangeText === placeholder ? 'text-gray-400' : 'text-gray-900'}`}
          >
            {dateRangeText}
          </span>
        </div>
      </div>

      {showPicker && (
        <div
          ref={pickerRef}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] w-[95vw] sm:w-[500px] lg:w-[600px] max-h-[90vh] overflow-auto"
        >
          <div className="flex flex-col lg:flex-row">
            <div className="bg-gray-50 p-3 lg:p-4 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="flex flex-wrap gap-1 lg:flex-col lg:space-y-1 lg:min-w-[110px]">
                <button onClick={() => handleTabClick('Today')} className={tabClass('Today')}>
                  Today
                </button>
                <button
                  onClick={() => handleTabClick('Yesterday')}
                  className={tabClass('Yesterday')}
                >
                  Yesterday
                </button>
                <button
                  onClick={() => handleTabClick('Last 7 Days')}
                  className={tabClass('Last 7 Days')}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => handleTabClick('Last 30 Days')}
                  className={tabClass('Last 30 Days')}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => handleTabClick('This Month')}
                  className={tabClass('This Month')}
                >
                  This Month
                </button>
                <button
                  onClick={() => handleTabClick('Last Month')}
                  className={tabClass('Last Month')}
                >
                  Last Month
                </button>
              </div>
            </div>

            <div className="flex-1 p-3 lg:p-4">
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="flex-1">{renderMonth(currentDate, days, true)}</div>
                <div className="hidden sm:block flex-1">
                  {renderMonth(addMonths(currentDate, 1), nextMonthDays, false)}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-center sm:justify-start space-x-1 text-sm">
                  <div className={hourMinuteWrapperClass}>
                    <select
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className="w-10 text-center text-xs bg-transparent border-0 focus:outline-none"
                    >
                      {hours.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-gray-500">:</span>
                  <div className={hourMinuteWrapperClass}>
                    <select
                      value={startMinute}
                      onChange={(e) => setStartMinute(e.target.value)}
                      className="w-10 text-center text-xs bg-transparent border-0 focus:outline-none"
                    >
                      {minutes.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-gray-500 mx-1">—</span>
                  <div className={hourMinuteWrapperClass}>
                    <select
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      className="w-10 text-center text-xs bg-transparent border-0 focus:outline-none"
                    >
                      {hours.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-gray-500">:</span>
                  <div className={hourMinuteWrapperClass}>
                    <select
                      value={endMinute}
                      onChange={(e) => setEndMinute(e.target.value)}
                      className="w-10 text-center text-xs bg-transparent border-0 focus:outline-none"
                    >
                      {minutes.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleOKClick}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
