import { ReactNode, Children } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

interface TableProps {
  headers: string[]
  children: ReactNode
  emptyMessage?: string
  isLoading?: boolean
  loadingMessage?: string
}

export default function Table({ headers, children, emptyMessage, isLoading, loadingMessage = "Загрузка..." }: TableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500">{loadingMessage}</p>
      </div>
    )
  }

  const isEmpty = Children.count(children) === 0;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {!isEmpty && (
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th key={index} scope="col" className="table-col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="bg-white divide-y divide-gray-200 [&>tr]:hover:bg-gray-50">
          {isEmpty && emptyMessage ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : children}
        </tbody>
      </table>
    </div>
  )
} 