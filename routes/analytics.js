import express from 'express';
import Item from '../models/Item.js';
import Rental from '../models/Rental.js';
const router = express.Router();
router.get('/overview', async (req, res) => {
    try {
        const totalItems = await Item.countDocuments();
        const availableItems = await Item.countDocuments({
            available: true
        });
        const rentedItems = totalItems - availableItems;
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);
        const todaySalesAgg = await Rental.aggregate([{
            $match: {
                status: 'returned',
                returnDate: {
                    $gte: startOfToday
                }
            }
        }, {
            $group: {
                _id: null,
                sum: {
                    $sum: '$totalPayment'
                }
            }
        }]);
        const monthSalesAgg = await Rental.aggregate([{
            $match: {
                status: 'returned',
                returnDate: {
                    $gte: startOfMonth
                }
            }
        }, {
            $group: {
                _id: null,
                sum: {
                    $sum: '$totalPayment'
                }
            }
        }]);
        const todaySales = (todaySalesAgg[0]?.sum) || 0;
        const monthSales = (monthSalesAgg[0]?.sum) || 0;
        const now = new Date();
        const year = now.getFullYear(),
            month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const graph = [];
        for (let d = 1; d <= daysInMonth; d++) {
            const start = new Date(year, month, d, 0, 0, 0, 0);
            const end = new Date(year, month, d, 23, 59, 59, 999);
            const agg = await Rental.aggregate([{
                $match: {
                    status: 'returned',
                    returnDate: {
                        $gte: start,
                        $lte: end
                    }
                }
            }, {
                $group: {
                    _id: null,
                    sum: {
                        $sum: '$totalPayment'
                    }
                }
            }]);
            graph.push({
                date: start.toISOString().slice(0, 10),
                sales: agg[0]?.sum || 0
            });
        }
        const recentRentals = await Rental.find().populate('itemId').populate('customerId').sort('-returnDate').limit(8);
        res.json({
            totalItems,
            availableItems,
            rentedItems,
            todaySales,
            monthSales,
            salesGraph: graph,
            recentRentals
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
});
export default router;