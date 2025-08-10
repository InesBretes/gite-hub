import { useState } from 'react';
import { useReservations } from '../../contexts/ReservationContext';
import ReservationForm from './ReservationForm';
import dayjs from 'dayjs';

const Reservations = () => {
  const { reservations, rooms, dispatch } = useReservations();
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setShowForm(true);
  };

  const handleDelete = (reservationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      dispatch({ type: 'DELETE_RESERVATION', payload: reservationId });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingReservation(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Réservations</h1>
          <p className="text-gray-600">Gérez toutes les réservations du gîte</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          ➕ Nouvelle réservation
        </button>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filtrer par statut:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field w-40"
          >
            <option value="all">Toutes</option>
            <option value="confirmed">Confirmées</option>
            <option value="pending">En attente</option>
            <option value="cancelled">Annulées</option>
          </select>
          <div className="ml-auto text-sm text-gray-500">
            {filteredReservations.length} réservation(s)
          </div>
        </div>
      </div>

      {/* Liste des reservations */}
      <div className="card">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📅</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune réservation
            </h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "Aucune réservation pour le moment" 
                : `Aucune réservation avec le statut "${getStatusText(filter)}"`
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chambre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Personnes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.guestName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rooms.find(r => r.id === reservation.room)?.name || `Chambre ${reservation.room}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>Du {dayjs(reservation.checkIn).format('DD/MM/YYYY')}</div>
                        <div>Au {dayjs(reservation.checkOut).format('DD/MM/YYYY')}</div>
                        <div className="text-xs text-gray-500">
                          {dayjs(reservation.checkOut).diff(dayjs(reservation.checkIn), 'day')} nuit(s)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{reservation.adults} adulte(s)</div>
                        {reservation.children > 0 && (
                          <div>{reservation.children} enfant(s)</div>
                        )}
                        {reservation.cribOption && (
                          <div className="text-xs text-blue-600">+ Lit parapluie</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reservation.totalPrice.toLocaleString()} XPF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`status-badge ${getStatusColor(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(reservation)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(reservation.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal du formulaire */}
      {showForm && (
        <ReservationForm
          reservation={editingReservation}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Reservations;