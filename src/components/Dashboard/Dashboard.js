import { useReservations } from '../../contexts/ReservationContext';
import dayjs from 'dayjs';

const Dashboard = () => {
  const { reservations, rooms } = useReservations();

  // Calculs pour les statistiques
  const today = dayjs();
  const thisMonth = today.format('YYYY-MM');

  const stats = {
    totalReservations: reservations.length,
    confirmedReservations: reservations.filter(r => r.status === 'confirmed').length,
    pendingReservations: reservations.filter(r => r.status === 'pending').length,
    monthlyRevenue: reservations
      .filter(r => r.status === 'confirmed' && dayjs(r.checkIn).format('YYYY-MM') === thisMonth)
      .reduce((sum, r) => sum + r.totalPrice, 0),
  };

  // Prochaines arrivées (7 prochains jours)
  const upcomingArrivals = reservations
    .filter(r => {
      const checkIn = dayjs(r.checkIn);
      return checkIn.isAfter(today) && checkIn.isBefore(today.add(7, 'day')) && r.status === 'confirmed';
    })
    .sort((a, b) => dayjs(a.checkIn).diff(dayjs(b.checkIn)));

  // Réservations actuelles
  const currentOccupancy = reservations.filter(r => {
    const checkIn = dayjs(r.checkIn);
    const checkOut = dayjs(r.checkOut);
    return today.isAfter(checkIn) && today.isBefore(checkOut) && r.status === 'confirmed';
  });

  const occupancyRate = Math.round((currentOccupancy.length / rooms.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de votre gîte</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Réservations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmedReservations}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReservations}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-nc-coral/20 rounded-lg">
              <span className="text-nc-coral text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CA ce mois</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.monthlyRevenue.toLocaleString()} XPF
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Taux d'occupation */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Occupation actuelle
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Taux d'occupation</span>
              <span className="text-2xl font-bold text-primary-600">{occupancyRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500">
              {currentOccupancy.length} sur {rooms.length} chambres occupées
            </div>
          </div>

          {/* Détail des chambres */}
          <div className="mt-6 space-y-2">
            {rooms.map(room => {
              const isOccupied = currentOccupancy.some(r => r.room === room.id);
              const reservation = currentOccupancy.find(r => r.room === room.id);

              return (
                <div key={room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${isOccupied ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className="font-medium">{room.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {isOccupied ? reservation.guestName : 'Disponible'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prochaines arrivées */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Prochaines arrivées (7 jours)
          </h3>
          {upcomingArrivals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">🏖️</span>
              Aucune arrivée prévue
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingArrivals.map(reservation => (
                <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{reservation.guestName}</p>
                    <p className="text-sm text-gray-500">
                      {rooms.find(r => r.id === reservation.room)?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {dayjs(reservation.checkIn).format('DD/MM')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dayjs(reservation.checkIn).format('dddd')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary">
            ➕ Nouvelle réservation
          </button>
          <button className="btn-secondary">
            📧 Envoyer rappels
          </button>
          <button className="btn-secondary">
            📊 Rapport mensuel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;