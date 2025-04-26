// components/common/status-badge.jsx
import React from 'react'

const StatusBadge = ({ status }) => {
  // Define styles for different statuses
  const statusStyles = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending'
    },
    processing: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Processing'
    },
    shipped: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      label: 'Shipped'
    },
    delivered: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Delivered'
    },
    cancelled: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Cancelled'
    },
    paid: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Paid'
    },
    unpaid: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Unpaid'
    },
    default: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: status
    }
  }

  // Get the appropriate style or use default
  const style = statusStyles[status.toLowerCase()] || statusStyles.default

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  )
}

export default StatusBadge