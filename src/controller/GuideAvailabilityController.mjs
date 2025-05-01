import Availability from '../model/AvailabilitySchema.mjs';
import Guide from '../model/GuideSchema.mjs';
import { startOfDay, endOfDay, addDays, addWeeks, addMonths, format, parseISO } from 'date-fns';

// Helper to generate recurring dates
const generateRecurringDates = (startDate, recurrenceType, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dates.push(new Date(currentDate));

        switch (recurrenceType) {
            case 'daily':
                currentDate = addDays(currentDate, 1);
                break;
            case 'weekly':
                currentDate = addWeeks(currentDate, 1);
                break;
            case 'biweekly':
                currentDate = addWeeks(currentDate, 2);
                break;
            case 'monthly':
                currentDate = addMonths(currentDate, 1);
                break;
            default:
                currentDate = addDays(currentDate, 1);
        }
    }

    return dates;
};

// Set availability for a guide
export const setAvailability = async (req, res) => {
    try {
        const { guideId, date, timeSlots, recurrence, recurrenceEndDate } = req.body;
        console.log(guideId);
        // Validate guide exists
        const guide = await Guide.findById(guideId);

        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        // For single-day availability
        if (recurrence === 'none' || !recurrence) {
            const availability = new Availability({
                guideId,
                date: new Date(date),
                timeSlots,
                recurrence: 'none'
            });

            await availability.save();
            return res.status(201).json(availability);
        }

        // For recurring availability
        const dates = generateRecurringDates(date, recurrence, recurrenceEndDate);
        const availabilityRecords = [];

        for (const currentDate of dates) {
            const availability = new Availability({
                guideId,
                date: currentDate,
                timeSlots,
                recurrence,
                recurrenceEndDate: new Date(recurrenceEndDate)
            });

            await availability.save();
            availabilityRecords.push(availability);
        }

        return res.status(201).json(availabilityRecords);
    } catch (error) {
        console.error('Error setting availability:', error);
        return res.status(500).json({ message: 'Failed to set availability', error: error.message });
    }
};

// Get availability for a specific guide and date range
export const getAvailability = async (req, res) => {
    try {
        const { guideId, startDate, endDate } = req.query;

        const availability = await Availability.find({
            guideId,
            date: {
                $gte: startOfDay(new Date(startDate)),
                $lte: endOfDay(new Date(endDate))
            }
        }).sort({ date: 1 });

        return res.status(200).json(availability);
    } catch (error) {
        console.error('Error getting availability:', error);
        return res.status(500).json({ message: 'Failed to get availability', error: error.message });
    }
};

// Update availability
export const updateAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { timeSlots } = req.body;

        const availability = await Availability.findById(id);

        if (!availability) {
            return res.status(404).json({ message: 'Availability not found' });
        }

        // Update time slots
        availability.timeSlots = timeSlots;
        await availability.save();

        return res.status(200).json(availability);
    } catch (error) {
        console.error('Error updating availability:', error);
        return res.status(500).json({ message: 'Failed to update availability', error: error.message });
    }
};

// Delete availability
export const deleteAvailability = async (req, res) => {
    try {
        const { id } = req.params;

        await Availability.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Availability deleted successfully' });
    } catch (error) {
        console.error('Error deleting availability:', error);
        return res.status(500).json({ message: 'Failed to delete availability', error: error.message });
    }
};

// Book a time slot
export const bookTimeSlot = async (req, res) => {
    try {
        const { availabilityId, slotIndex, bookingId } = req.body;

        const availability = await Availability.findById(availabilityId);

        if (!availability) {
            return res.status(404).json({ message: 'Availability not found' });
        }

        if (availability.timeSlots[slotIndex].isBooked) {
            return res.status(400).json({ message: 'Time slot is already booked' });
        }

        // Book the slot
        availability.timeSlots[slotIndex].isBooked = true;
        availability.timeSlots[slotIndex].bookingId = bookingId;

        await availability.save();

        return res.status(200).json(availability);
    } catch (error) {
        console.error('Error booking time slot:', error);
        return res.status(500).json({ message: 'Failed to book time slot', error: error.message });
    }
};