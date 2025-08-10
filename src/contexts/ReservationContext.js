import { createContext, useContext, useReducer } from 'react';
import dayjs from 'dayjs';

const ReservationContext = createContext();

// Mock data pour la démo
const initialState = {
    reservations: [
        {
            id: '1',
            guestName: 'Marie Dubois',
            email: 'marie.dubois@email.com',
            phone: '+687 123 456',
            room: 1,
            checkIn: dayjs().add(2, 'day').format('YYYY-MM-DD'),
            checkOut: dayjs().add(5, 'day').format('YYYY-MM-DD'),
            adults: 2,
            children: 1,
            cribOption: true,
            status: 'confirmed',
            totalPrice: 22000,
            createdAt: dayjs().format('YYYY-MM-DD HH:mm')
        },
        {
            id: '2',
            guestName: 'Pierre Martin',
            email: 'pierre.martin@email.com',
            phone: '+687 987 654',
            room: 2,
            checkIn: dayjs().add(8, 'day').format('YYYY-MM-DD'),
            checkOut: dayjs().add(12, 'day').format('YYYY-MM-DD'),
            adults: 2,
            children: 0,
            cribOption: false,
            status: 'pending',
            totalPrice: 15000,
            createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm')
        },
        {
            id: '3',
            guestName: 'Sylvie Monnet',
            email: 'sylvie.m@email.com',
            phone: '+687 256 120',
            room: 3,
            checkIn: dayjs().add(8, 'day').format('YYYY-MM-DD'),
            checkOut: dayjs().add(11, 'day').format('YYYY-MM-DD'),
            adults: 2,
            children: 0,
            cribOption: false,
            status: 'pending',
            totalPrice: 10000,
            createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm')
        },
         {
            id: '4',
            guestName: 'Louis Straus',
            email: 'louis.straus@email.com',
            phone: '+687 556 481',
            room: 1,
            checkIn: dayjs().add(10, 'day').format('YYYY-MM-DD'),
            checkOut: dayjs().add(11, 'day').format('YYYY-MM-DD'),
            adults: 1,
            children: 0,
            cribOption: false,
            status: 'cancelled',
            totalPrice: 5000,
            createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm')
        },
    ],
    rooms: [
        { id: 1, name: 'Chambre Commit', capacity: 3 },
        { id: 2, name: 'Chambre Push', capacity: 3 },
        { id: 3, name: 'Chambre Review', capacity: 3 }
    ]
};

function reservationReducer(state, action) {
    switch (action.type) {
        case 'ADD_RESERVATION':
            return {
                ...state,
                reservations: [...state.reservations, { ...action.payload, id: Date.now().toString() }]
            };

        case 'UPDATE_RESERVATION':
            return {
                ...state,
                reservations: state.reservations.map(reservation =>
                    reservation.id === action.payload.id ? action.payload : reservation
                )
            };

        case 'DELETE_RESERVATION':
            return {
                ...state,
                reservations: state.reservations.filter(reservation => reservation.id !== action.payload)
            };

        default:
            return state;
    }
}

export function ReservationProvider({ children }) {
    const [state, dispatch] = useReducer(reservationReducer, initialState);

    const calculatePrice = (checkIn, checkOut, cribOption = false) => {
        const start = dayjs(checkIn);
        const end = dayjs(checkOut);
        const nights = end.diff(start, 'day');

        let totalPrice = 0;
        let currentDate = start;

        for (let i = 0; i < nights; i++) {
            const isWeekend = currentDate.day() === 0 || currentDate.day() === 6; // dimanche ou samedi
            const nightPrice = isWeekend ? 7000 : 5000;
            totalPrice += nightPrice;
            currentDate = currentDate.add(1, 'day');
        }

        if (cribOption) {
            totalPrice += 1000;
        }

        return totalPrice;
    };

    const isRoomAvailable = (roomId, checkIn, checkOut, excludeReservationId = null) => {
        const start = dayjs(checkIn);
        const end = dayjs(checkOut);

        return !state.reservations.some(reservation => {
            if (reservation.id === excludeReservationId) return false;
            if (reservation.room !== roomId) return false;
            if (reservation.status === 'cancelled') return false;

            const resStart = dayjs(reservation.checkIn);
            const resEnd = dayjs(reservation.checkOut);

            return start.isBefore(resEnd) && end.isAfter(resStart);
        });
    };

    const hasMonday = (checkIn, checkOut) => {
        let currentDate = dayjs(checkIn);
        const end = dayjs(checkOut);

        while (currentDate.isBefore(end)) {
            if (currentDate.day() === 1) { // lundi
                return true;
            }
            currentDate = currentDate.add(1, 'day');
        }
        return false;
    };

    const value = {
        ...state,
        dispatch,
        calculatePrice,
        isRoomAvailable,
        hasMonday
    };

    return (
        <ReservationContext.Provider value={value}>
            {children}
        </ReservationContext.Provider>
    );
}

export function useReservations() {
    const context = useContext(ReservationContext);
    if (!context) {
        throw new Error('useReservations doit être utilisé dans un ReservationProvider');
    }
    return context;
}