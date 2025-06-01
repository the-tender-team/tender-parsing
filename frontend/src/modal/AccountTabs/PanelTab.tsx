'use client'

import { useEffect, useState } from 'react'
import { useAdmin } from '@/providers/ControlProvider'
import { useAuth } from '@/providers/AuthProvider'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Section from "../../components/ModalSection"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faSpinner, faSyncAlt, faListUl } from '@fortawesome/free-solid-svg-icons'

interface AdminRequest {
  id: number
  username: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function PanelTab() {
  const { handleAdminRequest, fetchAdminRequests } = useAdmin()
  const { user } = useAuth()
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  // Если не owner, не показываем панель
  if (!user || user.role !== 'owner') {
    return null
  }

  const loadRequests = async () => {
    try {
      setLoading(true)
      const { success, data, error } = await fetchAdminRequests()
      
      if (success && data) {
        setRequests(data)
      } else {
        console.error('Error fetching requests:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const handleAction = async (username: string, action: 'approve' | 'reject') => {
    try {
      setProcessing(username)
      const { success } = await handleAdminRequest(username, action)
      if (success) {
        loadRequests()
      }
    } catch (error: any) {
      console.error('Error handling admin request:', error)
    } finally {
      setProcessing(null)
    }
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('ru-RU')

  const headers = ['Имя пользователя', 'Дата и время', 'Статус', 'Действия']

  return (
    <>
      <Section icon={<FontAwesomeIcon icon={faListUl} />} title="Заявки на получение роли администратора">   
        <Button
          onClick={loadRequests}
          type="button"
          variant="primary"
          icon={faSyncAlt}
        > 
          Обновить
        </Button>
      </Section>
      <Table 
        headers={headers}
        emptyMessage="Нет активных заявок"
        isLoading={loading}
        loadingMessage="Загрузка заявок..."
      >
        {requests.map((request) => (
          <tr key={request.id}>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{request.username}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(request.created_at)}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {processing === request.username ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-indigo-600" />
              ) : (
                <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status === 'pending' ? 'На рассмотрении' : 
                    request.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
              {request.status === 'pending' && (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleAction(request.username, 'approve')}
                    disabled={processing === request.username}
                    className="text-green-600 hover:text-green-900 disabled:opacity-50 text-xl"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button
                    onClick={() => handleAction(request.username, 'reject')}
                    disabled={processing === request.username}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 text-xl"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </>
  )
}