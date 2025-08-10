import { useState } from 'react';
import { useReservations } from '../../contexts/ReservationContext';
import dayjs from 'dayjs';

const Calendar = () => {
  const { reservations, rooms } = useReservations();
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const startOfMonth = currentMonth.startOf('month');
  const endOfMonth = currentMonth.endOf('month');
  const startOfCalendar = startOfMonth.startOf('week');
  const endOfCalendar = endOfMonth.endOf('week');

  const calendarDays = [];
  let currentDay = startOfCalendar;

  while (currentDay.isBefore(endOfCalendar) || currentDay.isSame(endOfCalendar, 'day')) {
    calendarDays.push(currentDay);
    currentDay = currentDay.add(1, 'day');
  }

  const getReservationsForDay = (day) => {
    return reservations.filter(reservation => {
      if (reservation.status === 'cancelled') return false;
      const checkIn = dayjs(reservation.checkIn);
      const checkOut = dayjs(reservation.checkOut);
      return day.isSameOrAfter(checkIn, 'day') && day.isBefore(checkOut, 'day');
    });
  };

  const getRoomColor = (roomId) => {
    const colors = {
      1: 'bg-blue-500',
      2: 'bg-green-500',
      3: 'bg-purple-500'
    };
    return colors[roomId] || 'bg-gray-500';
  };

  const isCurrentMonth = (day) => {
    return day.isSame(currentMonth, 'month');
  };

  const isToday = (day) => {
    return day.isSame(dayjs(), 'day');
  };

  const isMonday = (day) => {
    return day.day() === 1;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => prev.add(direction, 'month'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendrier</h1>
          <p className="text-gray-600">Visualisez les réservations par mois</p>
        </div>
      </div>

      {/* Navigation du mois */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigateMonth(-1)}
            className="btn-secondary flex items-center"
          >
            ← Mois précédent
          </button>

          <h2 className="text-xl font-bold text-gray-900">
            {currentMonth.format('MMMM YYYY')}
          </h2>

          <button
            onClick={() => navigateMonth(1)}
            className="btn-secondary flex items-center"
          >
            Mois suivant →
          </button>
        </div>

        {/* Légende */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700">Légende:</div>
          {rooms.map(room => (
            <div key={room.id} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${getRoomColor(room.id)} mr-2`}></div>
              <span className="text-sm text-gray-600">{room.name}</span>
            </div>
          ))}
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-200 mr-2"></div>
            <span className="text-sm text-gray-600">Fermé (Lundi)</span>
          </div>
        </div>

        {/* Calendrier */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Headers des jours */}
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
            <div key={day} className={`
              bg-gray-100 p-3 text-center text-sm font-medium
              ${index === 0 ? 'text-red-600' : 'text-gray-700'}
            `}>
              {day}
              {index === 0 && <div className="text-xs">Fermé</div>}
            </div>
          ))}

          {/* Jours du calendrier */}
          {calendarDays.map((day, index) => {
            const dayReservations = getReservationsForDay(day);
            const isCurrentMonthDay = isCurrentMonth(day);
            const isTodayDay = isToday(day);
            const isMondayDay = isMonday(day);

            return (
              <div
                key={index}
                className={`
                  bg-white p-2 min-h-[120px] relative
                  ${!isCurrentMonthDay ? 'opacity-40' : ''}
                  ${isTodayDay ? 'ring-2 ring-blue-500' : ''}
                  ${isMondayDay ? 'bg-red-50' : ''}
                `}
              >
                {/* Numéro du jour */}
                <div className={`
                  text-sm font-medium mb-1
                  ${isTodayDay ? 'text-blue-600' : isCurrentMonthDay ? 'text-gray-900' : 'text-gray-400'}
                  ${isMondayDay ? 'text-red-600' : ''}
                `}>
                  {day.format('D')}
                  {isMondayDay && (
                    <span className="text-xs block text-red-500">Fermé</span>
                  )}
                </div>

                {/* Réservations */}
                <div className="space-y-1">
                  {dayReservations.map(reservation => {
                    const room = rooms.find(r => r.id === reservation.room);
                    return (
                      <div
                        key={reservation.id}
                        className={`
                          text-xs px-2 py-1 rounded text-white truncate
                          ${getRoomColor(reservation.room)}
                        `}
                        title={`${reservation.guestName} - ${room?.name} - ${reservation.status}`}
                      >
                        {reservation.guestName}
                      </div>
                    );
                  })}
                </div>

                {/* Indicateur s'il y a plus de réservations */}
                {dayReservations.length > 3 && (
                  <div className="absolute bottom-1 right-1 text-xs text-gray-500">
                    +{dayReservations.length - 3}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistiques du mois */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Réservations ce mois
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {reservations.filter(r =>
              dayjs(r.checkIn).isSame(currentMonth, 'month') && r.status !== 'cancelled'
            ).length}
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nuits réservées
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {reservations
              .filter(r => dayjs(r.checkIn).isSame(currentMonth, 'month') && r.status !== 'cancelled')
              .reduce((total, r) => total + dayjs(r.checkOut).diff(dayjs(r.checkIn), 'day'), 0)
            }
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Revenus estimés
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {reservations
              .filter(r => dayjs(r.checkIn).isSame(currentMonth, 'month') && r.status === 'confirmed')
              .reduce((total, r) => total + r.totalPrice, 0)
              .toLocaleString()} XPF
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;