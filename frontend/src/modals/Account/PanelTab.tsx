'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNotification } from '@/components/ui/NotificationProvider'

interface AdminRequest {
  id: string
  username: string
  regDate: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function PanelTab() {
  const { notify } = useNotification()
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin-requests', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!res.ok) throw new Error('Ошибка загрузки заявок')
      const data = await res.json()
      setRequests(data)
    } catch (error: any) {
      notify({ title: 'Ошибка', message: error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (username: string, action: 'approve' | 'reject') => {
    try {
      setProcessing(username)
      const res = await fetch(`/api/admin-requests/${action}/${username}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!res.ok) throw new Error(`Ошибка при ${action === 'approve' ? 'одобрении' : 'отклонении'} заявки`)
      const data = await res.json()
      notify({ title: 'Успешно', message: data.msg, type: 'success' })
      fetchRequests()
    } catch (error: any) {
      notify({ title: 'Ошибка', message: error.message, type: 'error' })
    } finally {
      setProcessing(null)
    }
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('ru-RU')

  return (
    <div className="p-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Список заявок</h2>
          <button
            onClick={fetchRequests}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Обновить
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <FontAwesomeIcon icon={faSpinner} className="text-4xl text-indigo-600 animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Нет активных заявок</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Пользователь</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата регистрации</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата заявки</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{request.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(request.regDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(request.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status === 'pending' ? 'На рассмотрении' : request.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(request.username, 'approve')}
                            disabled={processing === request.username}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            {processing === request.username ? (
                              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                            ) : (
                              <FontAwesomeIcon icon={faCheck} />
                            )}
                          </button>
                          <button
                            onClick={() => handleAction(request.username, 'reject')}
                            disabled={processing === request.username}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {processing === request.username ? (
                              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                            ) : (
                              <FontAwesomeIcon icon={faTimes} />
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
