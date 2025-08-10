import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useReservations } from '../../contexts/ReservationContext';
import dayjs from 'dayjs';

const ReservationForm = ({ reservation, onClose }) => {
  const { rooms, dispatch, calculatePrice, isRoomAvailable, hasMonday } = useReservations();
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [errors, setErrors] = useState([]);

  const { register, handleSubmit, watch, setValue, formState: { errors: formErrors } } = useForm({
    defaultValues: reservation || {
      guestName: '',
      email: '',
      phone: '',
      room: 1,
      checkIn: '',
      checkOut: '',
      adults: 2,
      children: 0,
      cribOption: false,
      status: 'pending'
    }
  });

  const watchedValues = watch();

  // Recalculer le prix quand les valeurs changent
  useEffect(() => {
    if (watchedValues.checkIn && watchedValues.checkOut) {
      const price = calculatePrice(
        watchedValues.checkIn,
        watchedValues.checkOut,
        watchedValues.cribOption
      );
      setCalculatedPrice(price);
      setValue('totalPrice', price);
    }
  }, [watchedValues.checkIn, watchedValues.checkOut, watchedValues.cribOption, calculatePrice, setValue]);

  const validateReservation = (data) => {
    const validationErrors = [];
    const checkIn = dayjs(data.checkIn);
    const checkOut = dayjs(data.checkOut);

    // Vérifier que checkout est après checkin
    if (!checkOut.isAfter(checkIn)) {
      validationErrors.push("La date de départ doit être après la date d'arrivée");
    }

    // Vérifier qu'il n'y a pas de lundi dans le séjour
    if (hasMonday(data.checkIn, data.checkOut)) {
      validationErrors.push("Le gîte est fermé le lundi. Aucun séjour ne peut inclure un lundi.");
    }

    // Vérifier la disponibilité de la chambre
    if (!isRoomAvailable(data.room, data.checkIn, data.checkOut, reservation?.id)) {
      validationErrors.push("Cette chambre n'est pas disponible pour ces dates");
    }

    // Vérifier le nombre de personnes
    const totalGuests = parseInt(data.adults) + parseInt(data.children);
    if (totalGuests > 3) {
      validationErrors.push("Maximum 3 personnes par chambre (2 adultes + 1 enfant)");
    }

    if (parseInt(data.adults) > 2) {
      validationErrors.push("Maximum 2 adultes par chambre");
    }

    if (parseInt(data.children) > 1) {
      validationErrors.push("Maximum 1 enfant par chambre");
    }

    // Vérifier les dates dans le futur
    if (!reservation && checkIn.isBefore(dayjs(), 'day')) {
      validationErrors.push("La date d'arrivée doit être dans le futur");
    }

    return validationErrors;
  };

  const onSubmit = (data) => {
    const validationErrors = validateReservation(data);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    const reservationData = {
      ...data,
      adults: parseInt(data.adults),
      children: parseInt(data.children),
      room: parseInt(data.room),
      totalPrice: calculatedPrice,
      createdAt: reservation?.createdAt || dayjs().format('YYYY-MM-DD HH:mm')
    };

    if (reservation) {
      dispatch({
        type: 'UPDATE_RESERVATION',
        payload: { ...reservationData, id: reservation.id }
      });
    } else {
      dispatch({
        type: 'ADD_RESERVATION',
        payload: reservationData
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {reservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Erreurs de validation */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Nous avons rencontré un problème lors de votre réservation :
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informations client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du client *
                </label>
                <input
                  {...register('guestName', { required: 'Le nom est requis' })}
                  className="input-field"
                  placeholder="Marie Dubois"
                />
                {formErrors.guestName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.guestName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  {...register('email', { 
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  type="email"
                  className="input-field"
                  placeholder="marie@email.com"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  {...register('phone')}
                  className="input-field"
                  placeholder="+687 123 456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chambre *
                </label>
                <select {...register('room', {
                  required: 'La chambre est requise'
                })} className="input-field">
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                {formErrors.room && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.room.message}</p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'arrivée *
                </label>
                <input
                  {...register('checkIn', { required: 'La date d\'arrivée est requise' })}
                  type="date"
                  className="input-field"
                  min={dayjs().format('YYYY-MM-DD')}
                />
                {formErrors.checkIn && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.checkIn.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de départ *
                </label>
                <input
                  {...register('checkOut', { required: 'La date de départ est requise' })}
                  type="date"
                  className="input-field"
                  min={watchedValues.checkIn || dayjs().format('YYYY-MM-DD')}
                />
                {formErrors.checkOut && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.checkOut.message}</p>
                )}
              </div>
            </div>

            {/* Personnes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre d'adultes *
                </label>
                <select {...register('adults', { required: 'Le nombre d\'adultes est requis' })} 
                        className="input-field">
                  <option value={1}>1 adulte</option>
                  <option value={2}>2 adultes</option>
                </select>
                {formErrors.adults && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.adults.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre d'enfants
                </label>
                <select {...register('children')} className="input-field">
                  <option value={0}>0 enfant</option>
                  <option value={1}>1 enfant</option>
                </select>
              </div>

              <div className="flex items-center">
                <div className="mt-6">
                  <label className="flex items-center">
                    <input
                      {...register('cribOption')}
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Lit parapluie (+1 000 XPF)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut de la réservation
              </label>
              <select {...register('status')} className="input-field w-48">
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>

            {/* Récapitulatif du prix */}
            {watchedValues.checkIn && watchedValues.checkOut && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Récapitulatif des prix
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Nombre de nuits:</span>
                    <span>{dayjs(watchedValues.checkOut).diff(dayjs(watchedValues.checkIn), 'day')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prix de base:</span>
                    <span>{(calculatedPrice - (watchedValues.cribOption ? 1000 : 0)).toLocaleString()} XPF</span>
                  </div>
                  {watchedValues.cribOption && (
                    <div className="flex justify-between">
                      <span>Lit parapluie:</span>
                      <span>1 000 XPF</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{calculatedPrice.toLocaleString()} XPF</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {reservation ? 'Modifier' : 'Créer'} la réservation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;